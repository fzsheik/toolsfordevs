import { SITE, VENDORS } from "@/lib/site";
import { getEvents } from "@/lib/events";
import { answer } from "@/lib/seo";

export const revalidate = 300;

/** Plain-text summary for LLM crawlers and answer engines (llmstxt.org convention). */
export async function GET() {
  const lines = [`# ${SITE.name}`, "", `> ${SITE.tagline}. Independent tracker of Claude Code and OpenAI Codex usage limit resets, with dates, UTC times and links to the original announcements. "Today" is decided in UTC.`, "", "## Current status"];
  for (const v of Object.values(VENDORS)) {
    const events = await getEvents(v.id);
    const { last, text } = await answer(v.id);
    lines.push(`- [${v.name} reset tracker](${SITE.url}${v.path}): ${text}${last ? ` ${events.filter((e) => e.kind === "reset").length} resets logged.` : ""}`);
  }
  lines.push(
    "",
    "## Guides",
    `- [How Claude usage limits work](${SITE.url}/claude-usage-limits)`,
    `- [Claude limit reset: Reset for free](${SITE.url}/claude-limit-reset)`,
    `- [How Codex usage limits work](${SITE.url}/codex-usage-limits)`,
    `- [Codex banked reset](${SITE.url}/codex-banked-reset)`,
    `- [Claude vs Codex resets: monthly counts](${SITE.url}/claude-vs-codex-resets)`,
    `- [Limit changes log](${SITE.url}/changes)`,
    "",
    "## Data",
    `- [Reset history](${SITE.url}/reset-history): every logged reset`,
    `- [JSON](${SITE.url}/resets.json): machine-readable events`,
    `- [RSS: resets only](${SITE.url}/resets.xml)`,
    `- [Calendar (ICS)](${SITE.url}/resets.ics)`,
    "",
    "## Notes",
    "- Entries marked Source-linked cite the original X post but are not independently verified.",
    "- Not affiliated with Anthropic or OpenAI.",
    "- Data: codex-reset.com and claude-resets.com, merged with our own log.",
  );
  return new Response(lines.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
