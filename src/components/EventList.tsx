import type { ResetEvent } from "@/lib/events";
import Message from "./Message";

export default function EventList({ events }: { events: ResetEvent[] }) {
  return (
    <ol className="events">
      {events.map((e) => (
        <li key={e.id} data-vendor={e.vendor} data-kind={e.kind}>
          <Message e={e} />
        </li>
      ))}
    </ol>
  );
}
