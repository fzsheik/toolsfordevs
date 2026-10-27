import { SITE } from "@/lib/site";
import { getEvents, eventUrl } from "@/lib/events";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** RSS of actual resets only (no policy/feature news). */
export const revalidate = 300;

export async function GET() {
  const items = (await getEvents())
    .filter((e) => e.kind === "reset")
    .map(
      (e) =>
        `<item><title>${esc(e.title)}</title><link>${eventUrl(e)}</link><guid>${eventUrl(e)}</guid><pubDate>${new Date(e.announced_at ?? `${e.date}T00:00:00Z`).toUTCString()}</pubDate><description>${esc(e.summary)}</description></item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${SITE.name}: Claude and Codex resets only</title><link>${SITE.url}</link><description>Only announced usage limit resets.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
