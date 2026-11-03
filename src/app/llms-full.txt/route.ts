import { SITE } from "@/lib/site";
import { INDEX_PATH, INDEX_TITLE, SKILLS, TAKEAWAYS, UPDATED_LABEL, skillPath } from "@/lib/motion-skills";

export const revalidate = 300;

/** Expanded plain-text roundup for answer engines. Facts match the HTML pages. */
export function GET() {
  const lines = [
    `# ${INDEX_TITLE}`,
    "",
    `> Free Claude Code skills for reels, paper-cut explainers, 3D films and talking-head edits. Facts come from each project's README or format page. Last updated ${UPDATED_LABEL}.`,
    "",
    `Index: ${SITE.url}${INDEX_PATH}`,
    "",
    "## Key takeaways",
    "",
    ...TAKEAWAYS.map((line) => line),
    "",
    "## Skills",
    "",
  ];
  for (const skill of SKILLS) {
    const install = skill.installs[0];
    lines.push(
      `### ${skill.name}`,
      "",
      skill.summary,
      "",
      `Page: ${SITE.url}${skillPath(skill.slug)}`,
      `Source: ${skill.url}`,
      `Style: ${skill.style}`,
      `Free vs paid: ${skill.cost}`,
      `Voice: ${skill.voice}`,
      `OS: ${skill.os}`,
      `Licence: ${skill.license}`,
      install ? `Install (${install.label}): ${install.command.replace(/\n/g, " && ")}` : "",
      "",
    );
  }
  lines.push("Not affiliated with Anthropic, OpenAI, or the skill authors.");
  return new Response(lines.filter((line) => line !== undefined).join("\n").replace(/\n{3,}/g, "\n\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
