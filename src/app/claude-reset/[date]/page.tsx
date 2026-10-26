import type { Metadata } from "next";
import EventPage from "@/components/EventPage";
import { getEvents, getEvent } from "@/lib/events";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getEvents("claude")).map((e) => ({ date: e.date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const e = await getEvent("claude", date);
  return {
    title: e?.title ?? "Claude reset",
    description: e?.summary,
    alternates: { canonical: `/claude-reset/${date}` },
  };
}

export default async function Page({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  return <EventPage vendor="claude" date={date} />;
}
