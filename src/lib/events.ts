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
  /** Separate "propagated / it's done" post, when the landing came after the announcement. */
  landed_at?: string;
  landed_post_url?: string;
  /** Announcement post, when `postId` points at the landing post instead. */
  announced_post_url?: string;
  /** One hand-written sentence of context. Required for indexing when there is no post text. */
  context?: string;
  /** Generated from our own log at load time. Never stored, never overrides `context`. */
  auto_context?: string;
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
  // Hand-set fields always win: skip synced posts we already hold as primary, announcement or landing post.
  const idOf = (u?: string) => u?.match(/status\/(\d+)/)?.[1];
  const postIds = new Set(base.flatMap((e) => [e.postId, idOf(e.landed_post_url), idOf(e.announced_post_url)]).filter(Boolean));
  const days = new Set(base.map((e) => `${e.vendor}:${e.date}`));
  const fresh: ResetEvent[] = [];
  for (const e of await liveEvents()) {
    const day = `${e.vendor}:${e.date}`;
    if (postIds.has(e.postId) || days.has(day)) continue;
    postIds.add(e.postId);
    days.add(day);
    fresh.push(e);
  }
  return addAutoContext([...base, ...fresh].sort((a, b) => b.date.localeCompare(a.date)));
}

const ordinal = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10 > 3 ? 0 : n % 10]}`;

/** Fills `auto_context` from the log itself (newest-first input). Skips nothing; display prefers `context`. */
function addAutoContext(all: ResetEvent[]) {
  return all.map((e) => {
    const same = all.filter((x) => x.vendor === e.vendor && x.kind === e.kind);
    const i = same.findIndex((x) => x.id === e.id);
    const prev = same[i + 1];
    const inWindow = same.filter((x) => x.date <= e.date && gapDays(e.date, x.date) < 30).length;
    const name = VENDORS[e.vendor].name;
    const noun = e.kind === "banked" ? "banked reset" : e.kind === "reset" ? "reset" : "update";
    const lead = leadMinutes(e);
    const parts = [
      `${ordinal(inWindow)} ${name} ${noun} in the last 30 days${prev ? `, ${plural(gapDays(e.date, prev.date), "day")} after the previous one (${fmtMDY(prev.date)})` : ""}.`,
      e.announced_at ? ` Announced ${fmtHM(e.announced_at)} UTC${e.landed_at && lead !== null ? `, landed ${fmtDur(lead)} later` : ""}.` : "",
      e.expires_at ? (Date.parse(e.expires_at) > Date.now() ? ` Usable until ${fmtMDY(e.expires_at)}.` : ` Expired ${fmtMDY(e.expires_at)}.`) : "",
    ];
    return { ...e, auto_context: parts.join("") };
  });
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

/** Time of the post whose text we quote (landing post when separate). */
export const postAt = (e: ResetEvent) => (e.postId ? isoFromPostId(e.postId) : e.announced_at);

export const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
/** "today" / "1 day ago" / "5 days ago". Days are counted in UTC. */
export const ago = (days: number) => (days <= 0 ? "today" : `${plural(days, "day")} ago`);

export type EventType = "global" | "banked" | "max-only";
export const eventType = (e: ResetEvent): EventType =>
  e.kind === "banked" ? "banked" : /\bmax\b/i.test(e.scope) && !/\ball\b|pro/i.test(e.scope) ? "max-only" : "global";

/** Thin pages (no post text and not checked by us) stay out of the index until enriched. */
export const indexable = (e: ResetEvent) => Boolean(e.date && e.sources.length);

/** Hand-written context first, generated one as fallback. */
export const contextOf = (e: ResetEvent) => e.context ?? e.auto_context;

/** Minutes between announcement and landing, when both are known. */
export const leadMinutes = (e: ResetEvent) =>
  e.announced_at && e.landed_at ? Math.round((Date.parse(e.landed_at) - Date.parse(e.announced_at)) / 60_000) : null;

/** "8 h 41 min" */
export const fmtDur = (min: number) => {
  const m = Math.abs(Math.round(min));
  return m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`;
};

/** Banked credits are active until `expires_at` passes. Computed per request, never stored. */
export const bankedStatus = (e: ResetEvent, now = Date.now()): "active" | "expired" | null =>
  e.kind !== "banked" || !e.expires_at ? null : Date.parse(e.expires_at) > now ? "active" : "expired";

/** "2 d 3 h" / "5 h 10 min" left until `iso`. */
export const countdown = (iso: string, now = Date.now()) => {
  const min = Math.max(0, Math.floor((Date.parse(iso) - now) / 60_000));
  const d = Math.floor(min / 1440), h = Math.floor((min % 1440) / 60);
  return d ? `${d} d ${h} h` : fmtDur(min);
};

export const activeBanked = async (vendor?: VendorId) =>
  (await getEvents(vendor)).filter((e) => bankedStatus(e) === "active");

export const gapDays = (a: string, b: string) => Math.round((utc(a) - utc(b)) / DAY);

/** Cadence of full resets from our own log. */
export async function stats(vendor: VendorId, now = Date.now()) {
  const resets = (await getEvents(vendor)).filter((e) => e.kind === "reset");
  const gaps: number[] = [];
  for (let i = 0; i < resets.length - 1; i++) gaps.push(gapDays(resets[i].date, resets[i + 1].date));
  const sorted = [...gaps].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  const median = sorted.length ? (sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2) : null;
  const within = (d: number) => resets.filter((e) => daysSince(e.date, now) < d).length;
  const leads = resets.map(leadMinutes).filter((m): m is number => m !== null);
  return {
    leadAvg: leads.length ? Math.round(leads.reduce((a, b) => a + b, 0) / leads.length) : null,
    leadN: leads.length,
    last7: within(7),
    total: resets.length, gaps, median, longest: sorted.length ? sorted[sorted.length - 1] : null, last30: within(30), last90: within(90) };
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

