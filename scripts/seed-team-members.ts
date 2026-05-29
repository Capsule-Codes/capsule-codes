import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { translations } from "../lib/i18n";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !serviceKey) throw new Error("Missing Supabase env vars");

const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

type Trans = { name: string; role: string; description: string };

interface MemberSeed {
  category: "cofounder" | "developer";
  order: number;
  en: Trans;
  es: Trans;
  it: Trans;
}

function pick(member: { name: string; role: string; description: string }): Trans {
  return { name: member.name, role: member.role, description: member.description };
}

async function run() {
  const en = translations.en.team;
  const es = translations.es.team;
  const it = translations.it.team;

  const seeds: MemberSeed[] = [
    {
      category: "cofounder",
      order: 1,
      en: pick(en.coFounders.miguel),
      es: pick(es.coFounders.miguel),
      it: pick(it.coFounders.miguel),
    },
    {
      category: "cofounder",
      order: 2,
      en: pick(en.coFounders.facundo),
      es: pick(es.coFounders.facundo),
      it: pick(it.coFounders.facundo),
    },
    {
      category: "developer",
      order: 1,
      en: pick(en.developers.marco),
      es: pick(es.developers.marco),
      it: pick(it.developers.marco),
    },
    {
      category: "developer",
      order: 2,
      en: pick(en.developers.lucas),
      es: pick(es.developers.lucas),
      it: pick(it.developers.lucas),
    },
    {
      category: "developer",
      order: 3,
      en: pick(en.developers.juan),
      es: pick(es.developers.juan),
      it: pick(it.developers.juan),
    },
  ];

  // Fetch existing names by translations.en.name
  const { data: existing, error: fetchErr } = await sb
    .from("team_members")
    .select("id, translations");
  if (fetchErr) throw fetchErr;

  const existingNames = new Set(
    (existing ?? []).map((r: any) => r.translations?.en?.name).filter(Boolean)
  );

  console.log(`Existing names: ${[...existingNames].join(", ") || "(none)"}`);

  const missing = seeds.filter((s) => !existingNames.has(s.en.name));

  if (missing.length === 0) {
    console.log("All seed members already present. Nothing to insert.");
    return;
  }

  const rows = missing.map((s) => ({
    category: s.category,
    order: s.order,
    avatar: null,
    avatar_blob_key: null,
    published: true,
    translations: { en: s.en, es: s.es, it: s.it },
  }));

  console.log(
    `Inserting ${rows.length} missing member(s): ${rows
      .map((r) => r.translations.en.name)
      .join(", ")}`
  );

  const { data: inserted, error: insertErr } = await sb
    .from("team_members")
    .insert(rows)
    .select();
  if (insertErr) throw insertErr;

  console.log(`Inserted ${inserted?.length ?? 0} row(s).`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
