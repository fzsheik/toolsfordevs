import type { Metadata } from "next";
import EventPage from "@/components/EventPage";
import { getEvents, getEvent } from "@/lib/events";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getEvents("codex")).map((e) => ({ date: e.date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const e = await getEvent("codex", date);
  return {
    title: e?.title ?? "Codex reset",
    description: e?.summary,
    alternates: { canonical: `/codex-reset/${date}` },
  };
}

export default async function Page({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  return <EventPage vendor="codex" date={date} />;
}
