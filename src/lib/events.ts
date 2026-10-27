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
  /** Keep `date` as written instead of deriving it from the post (reset landed on a different UTC day than the post). */
  keepDate?: boolean;
  /** When the primary post went out (ISO, UTC). Derived from `postId` when absent. */
  announced_at?: string;
  /** Banked events only: when the credit stopped being redeemable (ISO, UTC). */
  expires_at?: string;
  /** Verbatim post text when we have it. `via` credits the tracker we got it from. */
  quote?: { text: string; via?: string };
  scope: string;
  /** verified = a human opened the primary source. reported = primary link cited, not yet opened. */
  status: "verified" | "reported";
  sources: { label: string; url: string }[];
};

/** X status IDs are snowflakes: the top bits are ms since 2010-11-04T01:42:54.657Z. */
export const isoFromPostId = (id: string) =>
  new Date(Number((BigInt(id) >> BigInt(22)) + BigInt(1288834974657))).toISOString();
export const dateFromPostId = (id: string) => isoFromPostId(id).slice(0, 10);

const withTime = (e: ResetEvent): ResetEvent =>
  e.postId ? { ...e, ...(e.keepDate ? {} : { date: dateFromPostId(e.postId) }), announced_at: e.announced_at ?? isoFromPostId(e.postId) } : e;

const base = (raw as ResetEvent[]).map(withTime);

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

const fmtParts = (iso: string, tz: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString("en-US", { timeZone: tz, ...opts });

/** "Oct 26, 2026" */
export const fmtMDY = (date: string) =>
  new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
/** "06:08" (UTC, 24h) */
export const fmtHM = (iso: string) => fmtParts(iso, "UTC", { hour: "2-digit", minute: "2-digit", hour12: false });
/** "Oct 26, 2026, 06:08 UTC" */
export const fmtUtc = (iso: string) => `${fmtMDY(iso)}, ${fmtHM(iso)} UTC`;
/** "Oct 25, 2026, 11:08 PM PDT" */
export const fmtPacific = (iso: string) =>
  fmtParts(iso, "America/Los_Angeles", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).replace(/(\d{4}) at /, "$1, ");
/** Best available time label for an event: full UTC time when we know it, else the date. */
export const when = (e: ResetEvent) => (e.announced_at ? fmtUtc(e.announced_at) : fmtDate(e.date));

export const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
/** "today" / "1 day ago" / "5 days ago". Days are counted in UTC. */
export const ago = (days: number) => (days <= 0 ? "today" : `${plural(days, "day")} ago`);

export type EventType = "global" | "banked" | "max-only";
export const eventType = (e: ResetEvent): EventType =>
  e.kind === "banked" ? "banked" : /\bmax\b/i.test(e.scope) && !/\ball\b|pro/i.test(e.scope) ? "max-only" : "global";

/** Thin pages (no post text and not checked by us) stay out of the index until enriched. */
export const indexable = (e: ResetEvent) => Boolean(e.quote?.text) || e.status === "verified";

export const gapDays = (a: string, b: string) => Math.round((utc(a) - utc(b)) / DAY);

export const isExpired = (e: ResetEvent, now = Date.now()) => Boolean(e.expires_at && Date.parse(e.expires_at) <= now);

/** Cadence of full resets from our own log. */
export async function stats(vendor: VendorId, now = Date.now()) {
  const resets = (await getEvents(vendor)).filter((e) => e.kind === "reset");
  const gaps: number[] = [];
  for (let i = 0; i < resets.length - 1; i++) gaps.push(gapDays(resets[i].date, resets[i + 1].date));
  const sorted = [...gaps].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  const median = sorted.length ? (sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2) : null;
  const within = (d: number) => resets.filter((e) => daysSince(e.date, now) < d).length;
  return { total: resets.length, gaps, median, longest: sorted.length ? sorted[sorted.length - 1] : null, last30: within(30), last90: within(90) };
}

export const fmtShort = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export const fmtDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

