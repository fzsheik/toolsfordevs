import { renderOg, ogSize, ogType } from "@/lib/og";
import { categoryLabel, getSkill } from "@/lib/motion-skills";

export const alt = "Claude Code motion graphics skill";
export const size = ogSize;
export const contentType = ogType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = getSkill(slug);
  return renderOg({
    kicker: skill ? categoryLabel(skill.category) : "Claude skill",
    title: skill?.name ?? "Motion skill",
    sub: skill?.style,
  });
}
