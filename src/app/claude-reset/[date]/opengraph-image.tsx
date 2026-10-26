import { renderOg, ogSize, ogType } from "@/lib/og";
import { getEvent, getEvents, fmtDate } from "@/lib/events";

export const alt = "Claude reset news";
export const size = ogSize;
export const contentType = ogType;

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getEvents("claude")).map((e) => ({ date: e.date }));
}

export default async function Image({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const e = await getEvent("claude", date);
  return renderOg({
    kicker: `Claude reset · ${fmtDate(date)}`,
    title: e?.title ?? "Claude reset",
    sub: e?.scope,
  });
}
