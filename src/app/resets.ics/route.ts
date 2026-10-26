import { SITE, VENDORS } from "@/lib/site";
import { getEvents, eventUrl } from "@/lib/events";

const ymd = (d: string) => d.replace(/-/g, "");
const nextDay = (d: string) => ymd(new Date(Date.parse(`${d}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10));
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** All-day calendar events for past resets. Subscribe to see the pattern. */
export const revalidate = 300;

export async function GET() {
  const events = (await getEvents())
    .filter((e) => e.kind === "reset")
    .flatMap((e) => [
      "BEGIN:VEVENT",
      `UID:${e.id}@${new URL(SITE.url).hostname}`,
      `DTSTAMP:${ymd(e.date)}T000000Z`,
      `DTSTART;VALUE=DATE:${ymd(e.date)}`,
      `DTEND;VALUE=DATE:${nextDay(e.date)}`,
      `SUMMARY:${esc(`${VENDORS[e.vendor].name} limits reset`)}`,
      `DESCRIPTION:${esc(e.title)}`,
      `URL:${eventUrl(e)}`,
      "END:VEVENT",
    ]);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE.name}//reset tracker//EN`,
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Claude and Codex resets",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
  return new Response(ics + "\r\n", { headers: { "Content-Type": "text/calendar; charset=utf-8" } });
}
