import { SITE } from "@/lib/site";
import { PATH as GAME_DEV_PATH, plainTextLines } from "@/lib/game-dev";
import { INDEX_PATH, INDEX_TITLE, SKILLS, TAKEAWAYS, UPDATED_LABEL, skillPath } from "@/lib/motion-skills";

export const revalidate = 300;

/** Expanded plain-text roundup for answer engines. Facts match the HTML pages. */
export function GET() {
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.tagline}`,
    "",
    "## Categories",
    "",
    `- Home: ${SITE.url}/`,
    `- Claude reset tracker: ${SITE.url}/claude-reset. Did Claude reset today, plus banked Reset for free and the sourced history.`,
    `- Codex reset tracker: ${SITE.url}/codex-reset. Did Codex reset today, plus banked resets and the sourced history.`,
    `- Reset history: ${SITE.url}/reset-history`,
    `- Claude vs Codex resets: ${SITE.url}/claude-vs-codex-resets`,
    `- Limit changes: ${SITE.url}/changes`,
    `- Motion graphics skills: ${SITE.url}${INDEX_PATH}`,
    `- AI tools for Unity, Godot, and Unreal: ${SITE.url}${GAME_DEV_PATH}`,
    "",
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
  lines.push("Not affiliated with Anthropic, OpenAI, or the skill authors.", "", ...plainTextLines());
  return new Response(lines.filter((line) => line !== undefined).join("\n").replace(/\n{3,}/g, "\n\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
