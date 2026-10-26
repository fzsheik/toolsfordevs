import type { Metadata } from "next";
import EventList from "@/components/EventList";
import { getEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Claude and Codex reset history: every limit reset logged",
  description: "Timeline of every Claude and Codex usage limit reset with dates and source links.",
  alternates: { canonical: "/reset-history" },
};

export const revalidate = 300;

export default async function Page() {
  const events = await getEvents();
  return (
    <>
      <h1>Claude and Codex reset history</h1>
      <EventList events={events} />
    </>
  );
}
