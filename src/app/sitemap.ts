import type { MetadataRoute } from "next";
import { SITE, VENDORS, type VendorId } from "@/lib/site";
import { getEvents, indexable } from "@/lib/events";
import { INDEX_PATH, SKILLS, UPDATED } from "@/lib/motion-skills";

export const revalidate = 300;

const LAST_CHECKED = "2026-10-27";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const everything = await getEvents();
  const byVendor = Object.fromEntries(await Promise.all(Object.values(VENDORS).map(async (v) => [v.id, await getEvents(v.id)]))) as Record<VendorId, Awaited<ReturnType<typeof getEvents>>>;
  const stamp = (e?: { announced_at?: string; date: string }) => e?.announced_at ?? e?.date ?? LAST_CHECKED;
  const u = (p: string, lastModified: string, priority: number) => ({ url: `${SITE.url}${p}`, lastModified, priority });
  const guides = ["/claude-usage-limits", "/claude-limit-reset", "/codex-usage-limits", "/codex-banked-reset"].map((p) => u(p, LAST_CHECKED, 0.7));
  const skills = [u(INDEX_PATH, UPDATED, 0.7), ...SKILLS.map((s) => u(`${INDEX_PATH}/${s.slug}`, UPDATED, 0.6))];
  return [
    { ...u("/", stamp(everything[0]), 1), changeFrequency: "daily" as const },
    u("/reset-history", stamp(everything[0]), 0.8),
    u("/claude-vs-codex-resets", stamp(everything[0]), 0.6),
    u("/changes", stamp(everything.find((e) => e.kind === "policy")), 0.5),
    ...guides,
    ...skills,
    ...Object.values(VENDORS).flatMap((v) => [
      { ...u(v.path, stamp(byVendor[v.id][0]), 0.9), changeFrequency: "daily" as const },
      ...byVendor[v.id].filter(indexable).map((e) => u(`${v.path}/${e.date}`, stamp(e), 0.6)),
    ]),
  ];
}
