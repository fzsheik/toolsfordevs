import type { Metadata } from "next";
import EventPage from "@/components/EventPage";
import { getEvents, getEvent, indexable } from "@/lib/events";
import { eventMeta } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getEvents("claude")).map((e) => ({ date: e.date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const e = await getEvent("claude", date);
  if (!e) return { title: "Claude reset" };
  return {
    ...(await eventMeta(e)),
    alternates: { canonical: `/claude-reset/${date}` },
    robots: indexable(e) ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  return <EventPage vendor="claude" date={date} />;
}
