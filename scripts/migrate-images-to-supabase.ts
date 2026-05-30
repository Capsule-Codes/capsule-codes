/**
 * One-shot migration: Azure Blob Storage → Supabase Storage.
 *
 * For every `projects.image` / `projects.images[].blobKey` / `reviews.avatar`
 * that points at the old Azure proxy (`/api/images/...`) or directly at Azure,
 * download the bytes from Azure, re-upload to the Supabase `images` bucket,
 * and rewrite the DB row to the Supabase public URL.
 *
 * Idempotent: rows already pointing at a Supabase public URL are skipped.
 *
 * Run once:
 *   npx tsx scripts/migrate-images-to-supabase.ts
 *
 * Required env (read from .env.local manually so this works without dotenv):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   AZURE_STORAGE_CONNECTION_STRING
 *   AZURE_CONTAINER_NAME
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";

// ---------- env loader (no dotenv dep) ----------
function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    console.warn(`[migrate] .env.local not found at ${path}, using process.env`);
    return;
  }
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

// ---------- deps (loaded AFTER env is in place) ----------
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AZURE_CONNECTION = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER = process.env.AZURE_CONTAINER_NAME;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------- Azure lazy loader (only initialized if needed) ----------
type AzureContainer = {
  getBlockBlobClient(name: string): {
    download(): Promise<{ readableStreamBody?: NodeJS.ReadableStream }>;
  };
};

let azureContainer: AzureContainer | null = null;
async function getAzureContainer(): Promise<AzureContainer | null> {
  if (azureContainer) return azureContainer;
  if (!AZURE_CONNECTION || !AZURE_CONTAINER) {
    console.warn(
      "[migrate] Azure env not configured — cannot download legacy blobs"
    );
    return null;
  }
  // Dynamic import so this script can still run after @azure/storage-blob has
  // been uninstalled. If the package is gone we simply have nothing to migrate.
  try {
    const { BlobServiceClient } = await import("@azure/storage-blob");
    const cleaned = AZURE_CONNECTION.trim().replace(/^["']|["']$/g, "");
    const svc = BlobServiceClient.fromConnectionString(cleaned);
    azureContainer = svc.getContainerClient(AZURE_CONTAINER) as AzureContainer;
    return azureContainer;
  } catch (e) {
    console.warn(
      "[migrate] @azure/storage-blob not installed — skipping legacy migration"
    );
    return null;
  }
}

// ---------- helpers ----------
const BUCKET = "images";
const SUPABASE_PUBLIC_PREFIX = `${SUPABASE_URL!.replace(
  /\/$/,
  ""
)}/storage/v1/object/public/${BUCKET}/`;

function isSupabaseUrl(s: string | null | undefined): boolean {
  return !!s && s.includes("/storage/v1/object/public/images/");
}

/**
 * Pull the Azure blob key out of whatever a DB row holds. Returns null when
 * the value clearly isn't Azure-managed.
 */
function extractAzureBlobKey(value: string | null | undefined): string | null {
  if (!value) return null;
  if (isSupabaseUrl(value)) return null;

  // /api/images/<blobKey>
  if (value.startsWith("/api/images/")) {
    return decodeURIComponent(value.slice("/api/images/".length));
  }

  // Direct Azure URL (https://<account>.blob.core.windows.net/<container>/<blobKey>)
  const azMatch = value.match(/\.blob\.core\.windows\.net\/[^/]+\/(.+)$/);
  if (azMatch) {
    return decodeURIComponent(azMatch[1]);
  }

  return null;
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : (chunk as Buffer));
  }
  return Buffer.concat(chunks);
}

async function uploadToSupabase(
  folder: "projects" | "reviews",
  entityId: string,
  buffer: Buffer
): Promise<{ path: string; publicUrl: string }> {
  const path = `${folder}/${entityId}/${randomUUID()}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    throw new Error(`Supabase upload failed (${path}): ${error.message}`);
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

async function fetchAzureBlob(blobKey: string): Promise<Buffer | null> {
  const container = await getAzureContainer();
  if (!container) return null;
  const client = container.getBlockBlobClient(blobKey);
  const dl = await client.download();
  if (!dl.readableStreamBody) return null;
  return streamToBuffer(dl.readableStreamBody);
}

// ---------- per-table migration ----------
let migrated = 0;
let skipped = 0;
let failed = 0;

async function migrateProjects() {
  console.log("\n[migrate] Projects");
  const { data: rows, error } = await supabase
    .from("projects")
    .select("id, title, image, images");
  if (error) {
    console.error("  ! could not list projects:", error.message);
    return;
  }
  if (!rows || rows.length === 0) {
    console.log("  (no rows)");
    return;
  }

  for (const row of rows) {
    const update: Record<string, unknown> = {};
    let changed = false;

    // Primary image
    const primaryKey = extractAzureBlobKey(row.image as string | null);
    if (primaryKey) {
      try {
        const buf = await fetchAzureBlob(primaryKey);
        if (!buf) {
          console.log(
            `  - project ${row.id} (${row.title}): azure blob unavailable, skipping primary image`
          );
          skipped++;
        } else {
          const { publicUrl } = await uploadToSupabase("projects", row.id, buf);
          update.image = publicUrl;
          changed = true;
          migrated++;
          console.log(
            `  OK: project ${row.id} (${row.title}) image migrated to ${publicUrl}`
          );
        }
      } catch (e: any) {
        failed++;
        console.error(
          `  ! project ${row.id} primary image failed: ${e?.message || e}`
        );
      }
    } else if (row.image) {
      skipped++;
    }

    // images[] (JSONB array of {mediaId, blobKey, ...})
    const imageArr = Array.isArray(row.images) ? [...(row.images as any[])] : [];
    if (imageArr.length > 0) {
      let arrChanged = false;
      for (let i = 0; i < imageArr.length; i++) {
        const item = imageArr[i] || {};
        const k = extractAzureBlobKey(item.blobKey);
        if (!k) continue;
        try {
          const buf = await fetchAzureBlob(k);
          if (!buf) {
            console.log(
              `  - project ${row.id} images[${i}]: azure blob unavailable, leaving as-is`
            );
            skipped++;
            continue;
          }
          const { publicUrl } = await uploadToSupabase(
            "projects",
            row.id,
            buf
          );
          imageArr[i] = { ...item, blobKey: publicUrl };
          arrChanged = true;
          migrated++;
          console.log(
            `  OK: project ${row.id} images[${i}] migrated to ${publicUrl}`
          );
        } catch (e: any) {
          failed++;
          console.error(
            `  ! project ${row.id} images[${i}] failed: ${e?.message || e}`
          );
        }
      }
      if (arrChanged) {
        update.images = imageArr;
        changed = true;
      }
    }

    if (changed) {
      const { error: upErr } = await supabase
        .from("projects")
        .update(update)
        .eq("id", row.id);
      if (upErr) {
        console.error(
          `  ! could not persist project ${row.id}: ${upErr.message}`
        );
        failed++;
      }
    }
  }
}

async function migrateReviews() {
  console.log("\n[migrate] Reviews");
  const { data: rows, error } = await supabase
    .from("reviews")
    .select("id, author, avatar");
  if (error) {
    console.error("  ! could not list reviews:", error.message);
    return;
  }
  if (!rows || rows.length === 0) {
    console.log("  (no rows)");
    return;
  }

  for (const row of rows) {
    const azureKey = extractAzureBlobKey(row.avatar as string | null);
    if (!azureKey) {
      if (row.avatar) skipped++;
      continue;
    }
    try {
      const buf = await fetchAzureBlob(azureKey);
      if (!buf) {
        console.log(
          `  - review ${row.id} (${row.author}): azure avatar unavailable, skipping`
        );
        skipped++;
        continue;
      }
      const { publicUrl } = await uploadToSupabase("reviews", row.id, buf);
      const { error: upErr } = await supabase
        .from("reviews")
        .update({ avatar: publicUrl })
        .eq("id", row.id);
      if (upErr) throw upErr;
      migrated++;
      console.log(
        `  OK: review ${row.id} (${row.author}) avatar migrated to ${publicUrl}`
      );
    } catch (e: any) {
      failed++;
      console.error(
        `  ! review ${row.id} avatar failed: ${e?.message || e}`
      );
    }
  }
}

// ---------- main ----------
(async () => {
  console.log("[migrate] Supabase Storage:", SUPABASE_PUBLIC_PREFIX);
  console.log(
    "[migrate] Azure source:",
    AZURE_CONTAINER || "(not configured — script will still scan DB)"
  );

  await migrateProjects();
  await migrateReviews();
  // team_members is skipped: no Azure data existed for it.
  console.log("\n[migrate] team_members: skipped (no Azure history)");

  console.log("\n[migrate] Done.");
  console.log(`  migrated: ${migrated}`);
  console.log(`  skipped:  ${skipped}`);
  console.log(`  failed:   ${failed}`);

  process.exit(failed > 0 ? 1 : 0);
})().catch((e) => {
  console.error("[migrate] FATAL", e);
  process.exit(1);
});
