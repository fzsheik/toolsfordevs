import { VENDORS } from "./site";
import { plural, ago, daysSince, eventType, fmtDur, fmtHM, fmtMDY, gapDays, leadMinutes, getEvents, bankedStatus, postHandle, when, type ResetEvent } from "./events";
import type { VendorId } from "./site";

const MAX = 155;
const ordinal = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10 > 3 ? 0 : n % 10]}`;

/** Appends `extra` after `head`, never exceeding MAX and never cutting mid-sentence (falls back to a word boundary + ellipsis). t.co links are stripped. */
function fit(head: string, extra?: string) {
  const clean = (extra ?? "").replace(/https?:\/\/t\.co\/\S+/g, "").replace(/\s+/g, " ").trim();
  const room = MAX - head.length - 1;
  if (!clean || room < 20) return head.slice(0, MAX);
  if (clean.length <= room) return `${head} ${clean}`;
  const window = clean.slice(0, room);
  const sentence = window.match(/^.*[.!?…](?=\s|$)/);
  if (sentence && sentence[0].length >= 20) return `${head} ${sentence[0]}`;
  const word = window.slice(0, window.lastIndexOf(" ")).replace(/[\s,;:\-–—]+$/, "");
  return word.length >= 15 ? `${head} ${word.slice(0, room - 1)}…` : head;
}

/** Position of an event among same-kind events of its vendor (newest first in the list). */
export async function neighbours(e: ResetEvent) {
  const same = (await getEvents(e.vendor)).filter((x) => x.kind === e.kind);
  const i = same.findIndex((x) => x.id === e.id);
  return { n: same.length - i, prev: same[i + 1], next: same[i - 1] };
}

const SHORT = { global: "global limit reset", banked: "banked reset credit", "max-only": "weekly reset, Max plans", update: "update" } as const;

export const shortSummary = (e: ResetEvent) =>
  (e.kind === "policy" ? e.scope.replace(/^Feature:\s*/i, "") : SHORT[eventType(e)]).slice(0, 35);

export const eventH1 = (e: ResetEvent) => `${VENDORS[e.vendor].name} ${e.kind === "policy" ? "feature update" : "usage limit reset"}: ${fmtMDY(e.date)}`;

export async function eventMeta(e: ResetEvent) {
  const name = VENDORS[e.vendor].name;
  const date = fmtMDY(e.date);
  const base = `${name} ${e.kind === "policy" ? "update" : "reset"} on ${date}: ${shortSummary(e)}`;
  const title = `${base} | toolsfordevs`.length <= 60 ? `${base} | toolsfordevs` : base;
  const { n, prev } = await neighbours(e);
  const handle = postHandle(e);
  const actor = handle ? `@${handle}` : VENDORS[e.vendor].owner;
  const noun = e.kind === "banked" ? "banked usage limit reset" : "usage limit reset";
  const time = e.announced_at ? ` at ${fmtHM(e.announced_at)} UTC` : "";
  const posted = e.announced_at ? fmtMDY(e.announced_at) : date;
  const lead = leadMinutes(e);
  const landed = e.landed_at && lead !== null ? `; it landed at ${fmtHM(e.landed_at)} UTC, ${fmtDur(lead)} later` : "";
  const gap = prev ? `, ${plural(gapDays(e.date, prev.date), "day")} after the previous` : "";
  let description: string;
  if (e.kind === "policy") {
    description = fit(`Not a reset: ${name} feature update on ${date}.`, e.title);
  } else {
    // Numbering is per type, so banked grants never claim to be the first reset overall.
    const lead1 = e.kind === "banked" ? `${ordinal(n)} banked reset${gap || " in our log"}.` : `Reset #${n}${gap || ", the first in our log"}.`;
    const main = `${actor} announced a ${name} ${noun} on ${posted}${time}`;
    const head = `${lead1} ${main}${landed}.`;
    const short = `${lead1} ${main}.`;
    description = fit(head.length <= MAX ? head : short, e.context ?? e.quote?.text);
  }
  return { title: { absolute: title }, description };
}

/** One-sentence status for a vendor: last full reset plus the latest banked grant, with expiry. Days are counted in UTC. */
export async function answer(vendor: VendorId) {
  const name = VENDORS[vendor].name;
  const events = await getEvents(vendor);
  const last = events.find((e) => e.kind === "reset");
  if (!last) return { last, banked: undefined, text: `We have not logged any ${name} reset yet.` };
  const d = daysSince(last.date);
  const plans = eventType(last) === "max-only" ? " (Max plans)" : "";
  let text = `${name}${d === 0 ? " reset today" : `'s last full reset was ${when(last)}${plans}, ${ago(d)}`}.`;
  const banked = events.find((e) => e.kind === "banked" && e.date > last.date);
  if (banked) {
    const g = fmtMDY(banked.date).replace(/, \d{4}$/, "");
    if (banked.expires_at) {
      const x = fmtMDY(banked.expires_at).replace(/, \d{4}$/, "");
      text += bankedStatus(banked) === "expired" ? ` The banked reset granted ${g} expired ${x}.` : ` The banked reset granted ${g} is redeemable until ${x}.`;
    } else text += ` A banked reset was granted ${g}; its expiry is shown in your usage settings.`;
  }
  return { last, banked, text };
}
