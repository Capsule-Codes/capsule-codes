import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/server/data";
import { getPublishedProjects } from "@/lib/project-pages";
import { buildSitemapEntries } from "@/lib/sitemap-entries";

// Cached; admin writes revalidate it together with the pages.
export const revalidate = 300;

// Fixed per server start (i.e. per deploy), not per request.
const BUILD_TIME = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = getPublishedProjects(await getProjects());
  return buildSitemapEntries(projects, BUILD_TIME);
}
