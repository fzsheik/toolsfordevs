import { renderOg, ogSize, ogType } from "@/lib/og";
import { getEvents, fmtDate } from "@/lib/events";

export const alt = "Claude reset tracker";
export const size = ogSize;
export const contentType = ogType;

export const revalidate = 300;

export default async function Image() {
  const last = (await getEvents("claude")).find((e) => e.kind === "reset");
  return renderOg({
    kicker: "Claude reset tracker",
    title: "Did Claude reset?",
    sub: last ? `Last reset: ${fmtDate(last.date)}` : "No resets logged yet",
  });
}
