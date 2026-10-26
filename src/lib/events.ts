import raw from "@/data/events.json";
import { SITE, VENDORS, type VendorId } from "./site";
import { liveEvents } from "./live";

export type ResetEvent = {
  id: string;
  vendor: VendorId;
  date: string; // YYYY-MM-DD (UTC)
  /** reset = limits flushed now. banked = a credit users redeem later. policy = feature/rule news. */
  kind: "reset" | "banked" | "policy";
  title: string;
  summary: string;
  /** X status ID of the primary post. When set, `date` is derived from it (UTC). */
  postId?: string;
  /** Verbatim post text when we have it. `via` credits the tracker we got it from. */
  quote?: { text: string; via?: string };
  scope: string;
  /** verified = a human opened the primary source. reported = primary link cited, not yet opened. */
  status: "verified" | "reported";
  sources: { label: string; url: string }[];
};

/** X status IDs are snowflakes: the top bits are ms since 2010-11-04T01:42:54.657Z. */
export const dateFromPostId = (id: string) =>
  new Date(Number((BigInt(id) >> BigInt(22)) + BigInt(1288834974657))).toISOString().slice(0, 10);

const base = (raw as ResetEvent[]).map((e) => (e.postId ? { ...e, date: dateFromPostId(e.postId) } : e));

/** Committed events + whatever the community trackers report right now. Ours win on conflicts (same post or same vendor+day). */
async function load() {
  const postIds = new Set(base.map((e) => e.postId).filter(Boolean));
  const days = new Set(base.map((e) => `${e.vendor}:${e.date}`));
  const fresh: ResetEvent[] = [];
  for (const e of await liveEvents()) {
    const day = `${e.vendor}:${e.date}`;
    if (postIds.has(e.postId) || days.has(day)) continue;
    postIds.add(e.postId);
    days.add(day);
    fresh.push(e);
  }
  return [...base, ...fresh].sort((a, b) => b.date.localeCompare(a.date));
}

export const eventUrl = (e: ResetEvent) => `${SITE.url}${VENDORS[e.vendor].path}/${e.date}`;

export const getEvents = async (vendor?: VendorId) => {
  const all = await load();
  return vendor ? all.filter((e) => e.vendor === vendor) : all;
};

export const getEvent = async (vendor: VendorId, date: string) =>
  (await load()).find((e) => e.vendor === vendor && e.date === date);

const DAY = 86_400_000;
const utc = (d: string) => new Date(`${d}T00:00:00Z`).getTime();

export const daysSince = (date: string, now = Date.now()) =>
  Math.floor((now - utc(date)) / DAY);

export const postHandle = (e: ResetEvent) => e.sources.find((s) => /x\.com\/[^/]+\/status/.test(s.url))?.url.match(/x\.com\/([^/]+)\/status/)?.[1];
export const postUrl = (e: ResetEvent) => e.sources.find((s) => /x\.com\/[^/]+\/status/.test(s.url))?.url;

export const fmtShort = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export const fmtDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export type Verdict = "fresh" | "waiting" | "due" | "overdue";

/** Base-rate gauge: how long since the last full reset vs. how long resets usually take. Not a forecast. */
export async function estimate(vendor: VendorId, now = Date.now()) {
  const events = await getEvents(vendor);
  const resets = events.filter((e) => e.kind === "reset");
  const last = resets[0];
  if (!last) return null;
  const gaps: number[] = [];
  for (let i = 0; i < resets.length - 1 && gaps.length < 8; i++)
    gaps.push(Math.round((utc(resets[i].date) - utc(resets[i + 1].date)) / DAY));
  if (gaps.length < 3) return null;
  const sorted = [...gaps].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
  const median = Math.max(at(0.5), 1);
  const since = daysSince(last.date, now);
  const verdict: Verdict =
    since <= 1 ? "fresh" : since < median ? "waiting" : since <= Math.ceil(median * 1.5) ? "due" : "overdue";
  const banked = events.find((e) => e.kind === "banked" && e.date > last.date);
  return {
    last,
    n: resets.length,
    gaps,
    median,
    since,
    verdict,
    left: Math.max(median - since, 0),
    behind: Math.max(since - median, 0),
    // medium only when the recent gaps are fairly consistent
    confidence: (gaps.length >= 6 && at(0.75) <= median * 2.5 ? "medium" : "low") as "low" | "medium",
    banked,
  };
}
