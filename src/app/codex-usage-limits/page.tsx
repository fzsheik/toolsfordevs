import type { Metadata } from "next";
import Guide from "@/components/Guide";

const TITLE = "How Codex Usage Limits Work: 5-Hour and Weekly Limits by Plan";
const DESC = "How Codex usage limits work on ChatGPT plans: shared Work and Codex allowance, five-hour and weekly windows, and which Pro tiers have no five-hour limit.";

export const metadata: Metadata = { title: { absolute: TITLE }, description: DESC, alternates: { canonical: "/codex-usage-limits" } };

export default function Page() {
  return (
    <Guide
      vendor="codex" path="/codex-usage-limits" title={TITLE} h1="How Codex usage limits work" description={DESC}
      sources={[
        { label: "Managing usage with GPT-6 Astra in Work and Codex (OpenAI Help)", url: "https://help.openai.com/en/articles/20001516-managing-usage-with-gpt-6-astra-in-work-and-codex" },
        { label: "Using Codex with your ChatGPT plan (OpenAI Help)", url: "https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan" },
        { label: "Codex pricing and per-model usage (chatgpt.com)", url: "https://chatgpt.com/codex/pricing/" },
      ]}
    >
      <p>Per OpenAI&apos;s help center, Work and Codex share your plan&apos;s allowance. Allowance is not a fixed message count.</p>
      <h2>Five-hour and weekly windows</h2>
      <ul>
        <li><b>Plus and Business Standard:</b> a five-hour window and a weekly window. You need allowance left in both to keep going. A new five-hour window starts with your first message after the previous one ends.</li>
        <li><b>Pro 100, Pro 200 and Pro 500:</b> currently no five-hour limit, but a weekly allowance still applies.</li>
      </ul>
      <h2>How many messages?</h2>
      <p>Per-model message ranges change often, so we do not copy them. See <a href="https://chatgpt.com/codex/pricing/" rel="nofollow noopener" target="_blank">OpenAI&apos;s Codex pricing page</a> for current numbers.</p>
      <h2>Extra resets</h2>
      <p>OpenAI also resets limits early or grants banked resets. See <a href="/codex-banked-reset">Codex banked reset</a>.</p>
    </Guide>
  );
}
