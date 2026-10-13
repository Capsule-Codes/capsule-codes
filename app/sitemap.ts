import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/server/data";
import { getPublishedProjects } from "@/lib/project-pages";
import { buildSitemapEntries } from "@/lib/sitemap-entries";

export const dynamic = "force-dynamic";

// Fixed per server start (i.e. per deploy), not per request.
const BUILD_TIME = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = getPublishedProjects(await getProjects());
  return buildSitemapEntries(projects, BUILD_TIME);
}
