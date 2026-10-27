import { SITE } from "@/lib/site";
import { getEvents, eventUrl, eventType, bankedStatus, leadMinutes } from "@/lib/events";

export const revalidate = 300;

export async function GET() {
  const events = (await getEvents()).map((e) => ({
    id: e.id,
    vendor: e.vendor,
    date: e.date,
    announced_at: e.announced_at ?? null,
    expires_at: e.expires_at ?? null,
    banked_status: bankedStatus(e),
    landed_at: e.landed_at ?? null,
    landed_post_url: e.landed_post_url ?? null,
    announced_post_url: e.announced_post_url ?? null,
    lead_time_minutes: leadMinutes(e),
    context: e.context ?? null,
    type: eventType(e),
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
