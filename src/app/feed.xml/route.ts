import { SITE, VENDORS } from "@/lib/site";
import { getEvents } from "@/lib/events";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const revalidate = 300;

export async function GET() {
  const items = (await getEvents())
    .map((e) => {
      const link = `${SITE.url}${VENDORS[e.vendor].path}/${e.date}`;
      return `<item><title>${esc(e.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${new Date(e.announced_at ?? `${e.date}T00:00:00Z`).toUTCString()}</pubDate><description>${esc(e.summary)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${SITE.name} reset tracker</title><link>${SITE.url}</link><description>${esc(SITE.tagline)}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
