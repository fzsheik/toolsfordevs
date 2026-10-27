import { VENDORS } from "./site";
import { ago, daysSince, eventType, fmtHM, fmtMDY, gapDays, getEvents, isExpired, postHandle, when, type ResetEvent } from "./events";
import type { VendorId } from "./site";

/** Position of an event among same-kind events of its vendor (newest first in the list). */
export async function neighbours(e: ResetEvent) {
  const same = (await getEvents(e.vendor)).filter((x) => x.kind === e.kind);
  const i = same.findIndex((x) => x.id === e.id);
  return { n: same.length - i, prev: same[i + 1], next: same[i - 1] };
}

const SHORT = { global: "global limit reset", banked: "banked reset credit", "max-only": "weekly reset, Max plans" } as const;

export const shortSummary = (e: ResetEvent) => SHORT[eventType(e)].slice(0, 35);

export const eventH1 = (e: ResetEvent) => `${VENDORS[e.vendor].name} usage limit reset: ${fmtMDY(e.date)}`;

export async function eventMeta(e: ResetEvent) {
  const name = VENDORS[e.vendor].name;
  const date = fmtMDY(e.date);
  const base = `${name} reset on ${date}: ${shortSummary(e)}`;
  const title = `${base} | toolsfordevs`.length <= 60 ? `${base} | toolsfordevs` : base;
  const { n, prev } = await neighbours(e);
  const handle = postHandle(e);
  const actor = handle ? `@${handle}` : VENDORS[e.vendor].owner;
  const noun = e.kind === "banked" ? "banked usage limit reset" : "usage limit reset";
  const time = e.announced_at ? ` at ${fmtHM(e.announced_at)} UTC` : "";
  const text = e.quote?.text.replace(/\s+/g, " ").trim().slice(0, 80).replace(/[.!?\s]+$/, "");
  const tail = prev ? `Reset #${n} in our log, ${gapDays(e.date, prev.date)} days after the previous one.` : `Reset #${n} in our log, the first one.`;
  const posted = e.announced_at && e.announced_at.slice(0, 10) !== e.date ? fmtMDY(e.announced_at) : date;
  const landed = posted !== date ? ` It landed ${date}.` : "";
  const description = `${actor} announced a ${name} ${noun} on ${posted}${time}.${landed}${text ? ` "${text}".` : ""} ${tail}`;
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
      text += isExpired(banked) ? ` The banked reset granted ${g} expired ${x}.` : ` The banked reset granted ${g} is redeemable until ${x}.`;
    } else text += ` A banked reset was granted ${g}; its expiry is shown in your usage settings.`;
  }
  return { last, banked, text };
}
