import { renderOg, ogSize, ogType } from "@/lib/og";

export const alt = "AI tools for Unity, Godot, and Unreal: MCP or CLI";
export const size = ogSize;
export const contentType = ogType;

export default function Image() {
  return renderOg({
    kicker: "Game dev",
    title: "Unity, Godot, Unreal",
    sub: "Official or community. MCP or CLI.",
  });
}
