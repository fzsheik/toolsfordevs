import { SITE } from "@/lib/site";
import { getEvents, eventUrl } from "@/lib/events";

export const revalidate = 300;

export async function GET() {
  const events = (await getEvents()).map((e) => ({
    id: e.id,
    vendor: e.vendor,
    date: e.date,
    kind: e.kind,
    title: e.title,
    scope: e.scope,
    status: e.status,
    url: eventUrl(e),
    sources: e.sources,
  }));
  return Response.json(
    { site: SITE.url, count: events.length, events },
    { headers: { "Access-Control-Allow-Origin": "*" } },
  );
}
