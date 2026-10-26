import { SITE, VENDORS } from "@/lib/site";
import { getEvents, daysSince, fmtDate } from "@/lib/events";

export const revalidate = 300;

/** Plain-text summary for LLM crawlers and answer engines (llmstxt.org convention). */
export async function GET() {
  const lines = [`# ${SITE.name}`, "", `> ${SITE.tagline}. Independent tracker of Claude Code and OpenAI Codex usage limit resets, with dates and links to the original announcements.`, "", "## Current status"];
  for (const v of Object.values(VENDORS)) {
    const events = await getEvents(v.id);
    const last = events.find((e) => e.kind === "reset");
    lines.push(`- [${v.name} reset tracker](${SITE.url}${v.path}): ${last ? `last logged reset ${fmtDate(last.date)} (${daysSince(last.date)} days ago); ${events.filter((e) => e.kind === "reset").length} resets logged` : "no resets logged"}`);
  }
  lines.push("", "## Data", `- [Reset history](${SITE.url}/reset-history): every logged reset`, `- [JSON](${SITE.url}/resets.json): machine-readable events`, `- [RSS: resets only](${SITE.url}/resets.xml)`, `- [Calendar (ICS)](${SITE.url}/resets.ics)`, "", "## Notes", "- Entries marked Source-linked cite the original X post but are not independently verified.", "- Not affiliated with Anthropic or OpenAI.", "- Reset data is merged from our own log plus claude-resets.com and codex-reset.com.");
  return new Response(lines.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
