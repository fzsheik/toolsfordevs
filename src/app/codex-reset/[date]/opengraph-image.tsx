import { renderOg, ogSize, ogType } from "@/lib/og";
import { getEvent, getEvents, fmtDate } from "@/lib/events";

export const alt = "Codex reset news";
export const size = ogSize;
export const contentType = ogType;

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getEvents("codex")).map((e) => ({ date: e.date }));
}

export default async function Image({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const e = await getEvent("codex", date);
  return renderOg({
    kicker: `Codex reset · ${fmtDate(date)}`,
    title: e?.title ?? "Codex reset",
    sub: e?.scope,
  });
}
