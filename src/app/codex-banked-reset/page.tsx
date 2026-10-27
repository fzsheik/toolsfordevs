import type { Metadata } from "next";
import Guide from "@/components/Guide";
import { getEvents, fmtUtc, when } from "@/lib/events";

export const revalidate = 300;

const TITLE = "Codex Banked Reset: What It Is and How to Redeem It";
const DESC = "The three Codex reset types, how to redeem a banked reset in Settings > Usage or the Codex CLI, the 80% rule, and what a full banked reset restores.";

export const metadata: Metadata = { title: { absolute: TITLE }, description: DESC, alternates: { canonical: "/codex-banked-reset" } };

export default async function Page() {
  const banked = (await getEvents("codex")).filter((e) => e.kind === "banked");
  return (
    <Guide
      vendor="codex" path="/codex-banked-reset" title={TITLE} h1="Codex banked reset: what it is and how to redeem it" description={DESC}
      sources={[{ label: "How resets work in Codex (OpenAI Help)", url: "https://help.openai.com/en/articles/20001498-how-resets-work-in-codex" }]}
    >
      <h2>Three reset types</h2>
      <ul>
        <li><b>Banked:</b> a credit you redeem yourself.</li>
        <li><b>Automatic or global:</b> applied to everyone covered.</li>
        <li><b>Purchased instant:</b> bought and applied right away.</li>
      </ul>
      <h2>How to redeem a banked reset</h2>
      <ul>
        <li>Desktop or web: Settings &gt; Usage.</li>
        <li>Codex CLI: /usage &gt; Redeem reset.</li>
      </ul>
      <p>The allowance it covers must be under 80% remaining.</p>
      <h2>What it restores</h2>
      <p>A full banked reset restores the 5-hour and weekly allowance on Plus and Business Standard, and the weekly allowance on Pro tiers. It changes your weekly reset date. Global and paid resets do not appear in History.</p>
      <h2>Banked grants we have logged</h2>
      {banked.length ? (
        <ul>
          {banked.map((e) => (
            <li key={e.id}><a href={`/codex-reset/${e.date}`}>{when(e)}</a> · {e.scope}{e.expires_at ? ` · expires ${fmtUtc(e.expires_at)}` : ""}</li>
          ))}
        </ul>
      ) : <p>None logged yet.</p>}
    </Guide>
  );
}
