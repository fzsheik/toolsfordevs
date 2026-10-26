import type { MetadataRoute } from "next";
import { SITE, VENDORS } from "@/lib/site";
import { getEvents } from "@/lib/events";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const everything = await getEvents();
  const byVendor: Record<string, Awaited<ReturnType<typeof getEvents>>> = Object.fromEntries(await Promise.all(Object.values(VENDORS).map(async (v) => [v.id, await getEvents(v.id)])));
  const latest = everything[0]?.date ?? new Date().toISOString().slice(0, 10);
  const u = (p: string, lastModified: string, priority: number) => ({
    url: `${SITE.url}${p}`,
    lastModified,
    changeFrequency: "daily" as const,
    priority,
  });
  return [
    u("/", latest, 1),
    u("/reset-history", latest, 0.8),
    ...Object.values(VENDORS).flatMap((v) => [
      u(v.path, byVendor[v.id][0]?.date ?? latest, 0.9),
      ...byVendor[v.id].map((e) => u(`${v.path}/${e.date}`, e.date, 0.6)),
    ]),
  ];
}
