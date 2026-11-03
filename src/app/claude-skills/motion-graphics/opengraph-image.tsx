import { renderOg, ogSize, ogType } from "@/lib/og";

export const alt = "Best free Claude Code skills for motion graphics and reels";
export const size = ogSize;
export const contentType = ogType;

export default function Image() {
  return renderOg({
    kicker: "Claude skills",
    title: "Motion graphics & reels",
    sub: "Free skills for paper, 3D, talking-head and motion.",
  });
}
