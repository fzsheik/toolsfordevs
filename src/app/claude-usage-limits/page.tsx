import type { Metadata } from "next";
import Guide from "@/components/Guide";

const TITLE = "How Claude Usage Limits Work: 5-Hour and Weekly Limits";
const DESC = "How Claude's session and weekly usage limits work on paid plans, what counts toward them, usage credits, and the exact limit messages you may see.";

export const metadata: Metadata = { title: { absolute: TITLE }, description: DESC, alternates: { canonical: "/claude-usage-limits" } };

export default function Page() {
  return (
    <Guide
      vendor="claude" path="/claude-usage-limits" title={TITLE} h1="How Claude usage limits work" description={DESC}
      sources={[
        { label: "How do usage and length limits work? (Claude Help Center)", url: "https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work" },
        { label: "What is the Pro plan? (Claude Help Center)", url: "https://support.claude.com/en/articles/8325606-what-is-the-pro-plan" },
        { label: "Manage usage credits for paid Claude plans (Claude Help Center)", url: "https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans" },
        { label: "Troubleshoot Claude error messages (Claude Help Center)", url: "https://support.claude.com/en/articles/12466728-troubleshoot-claude-error-messages" },
      ]}
    >
      <p>Per Anthropic&apos;s help center, paid Claude plans have two kinds of usage limit.</p>
      <ul>
        <li><b>Session limit:</b> resets every five hours.</li>
        <li><b>Weekly limits:</b> reset once a week. The weekly reset day and time are fixed per account and shown in Settings &gt; Usage.</li>
      </ul>
      <h2>What counts toward the limit</h2>
      <p>Usage on claude.ai, Claude Code and Claude Desktop counts toward the same limit. How fast you use it up depends on conversation length, the features you use, the model and the effort setting.</p>
      <h2>Usage credits</h2>
      <p>Usage credits let Pro, Max 5x and Max 20x plans keep working at API rates after a plan limit is reached.</p>
      <h2>Limit messages you may see</h2>
      <p>Exact wording from Anthropic&apos;s error message article:</p>
      <ul>
        <li>&ldquo;5-hour limit reached - resets [time]&rdquo;</li>
        <li>&ldquo;You&apos;ve reached your weekly limit. It resets [day] at [time].&rdquo;</li>
        <li>With usage credits on: &ldquo;5-hour limit resets [time] - continuing with usage credits&rdquo; and &ldquo;Now using credits. Your plan limit resets [day] at [time].&rdquo;</li>
        <li>Warnings: &ldquo;Approaching session limit&rdquo;, &ldquo;Approaching weekly limit.&rdquo;, &ldquo;You&apos;ve used X% of your weekly limit.&rdquo;</li>
        <li>Capacity, not your limit: &ldquo;Due to unexpected capacity constraints, Claude is unable to respond to your message. Please try again soon.&rdquo;</li>
      </ul>
      <h2>Extra resets</h2>
      <p>Separately from these windows, Anthropic occasionally resets limits early or grants a reset you can use. We log both: see <a href="/claude-limit-reset">Claude limit reset</a>.</p>
    </Guide>
  );
}
