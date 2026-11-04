import { renderOg, ogSize, ogType } from "@/lib/og";

export const alt = "Claude reset and Codex reset tracker";
export const size = ogSize;
export const contentType = ogType;

export default function Image() {
  return renderOg({
    kicker: "toolsfordevs",
    title: "Claude tools and skills",
    sub: "Reset trackers, plus free motion-graphics skills.",
  });
}
