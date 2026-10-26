import { renderOg, ogSize, ogType } from "@/lib/og";

export const alt = "Claude reset and Codex reset tracker";
export const size = ogSize;
export const contentType = ogType;

export default function Image() {
  return renderOg({
    kicker: "Live tracker",
    title: "Claude reset & Codex reset",
    sub: "Did your usage limits reset? News, history, sources.",
  });
}
