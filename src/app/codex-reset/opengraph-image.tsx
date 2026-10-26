import { renderOg, ogSize, ogType } from "@/lib/og";
import { getEvents, fmtDate } from "@/lib/events";

export const alt = "Codex reset tracker";
export const size = ogSize;
export const contentType = ogType;

export const revalidate = 300;

export default async function Image() {
  const last = (await getEvents("codex")).find((e) => e.kind === "reset");
  return renderOg({
    kicker: "Codex reset tracker",
    title: "Did Codex reset?",
    sub: last ? `Last reset: ${fmtDate(last.date)}` : "No resets logged yet",
  });
}
