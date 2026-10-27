import type { Metadata } from "next";
import Guide from "@/components/Guide";
import { getEvents, fmtUtc, fmtMDY, bankedStatus, postUrl } from "@/lib/events";

export const revalidate = 300;

const TITLE = "Claude Limit Reset: How to Use Reset for Free";
const DESC = "What a Claude limit reset is, how to use Reset for free in Settings > Usage, where it is unavailable, when it expires, plus every banked grant we have logged.";

export const metadata: Metadata = { title: { absolute: TITLE }, description: DESC, alternates: { canonical: "/claude-limit-reset" } };

export default async function Page() {
  const banked = (await getEvents("claude")).filter((e) => e.kind === "banked");
  return (
    <Guide
      vendor="claude" path="/claude-limit-reset" title={TITLE} h1="Claude limit reset: how to use Reset for free" description={DESC}
      sources={[{ label: "What is a limit reset? (Claude Help Center)", url: "https://support.claude.com/en/articles/17007452-what-is-a-limit-reset" }]}
    >
      <p>A limit reset sets your 5-hour or weekly usage limit back to full when you choose to use it. Your weekly limits still reset on their usual day. A reset cannot be undone once used.</p>
      <h2>How to use it</h2>
      <ol>
        <li>Open Settings &gt; Usage on the web or in Claude Desktop.</li>
        <li>Click Reset for free in the Resets section, then confirm.</li>
      </ol>
      <p>The button is not currently available on Claude Mobile or in Claude Code in the terminal or IDE.</p>
      <h2>Expiry and cancelling</h2>
      <p>If a reset has an expiry, it is shown in Settings &gt; Usage; an unused reset expires on the day and time listed on the offer. If you downgrade or cancel before using it, it is forfeited.</p>
      <h2>Banked grants we have logged</h2>
      {banked.length ? (
        <ul>
          {banked.map((e) => (
            <li key={e.id}>
              Granted <a href={`/claude-reset/${e.date}`}>{fmtUtc(e.announced_at ?? `${e.date}T00:00:00Z`)}</a>
              {e.announced_at ? "" : " (date only)"} ·{" "}
              {e.expires_at ? (bankedStatus(e) === "expired" ? `expired ${fmtUtc(e.expires_at)}` : `expires ${fmtUtc(e.expires_at)}`) : "expiry: see Settings > Usage"} · {e.scope}
              {postUrl(e) ? <> · <a href={postUrl(e)} rel="nofollow noopener" target="_blank">post</a></> : null}
            </li>
          ))}
        </ul>
      ) : <p>None logged yet.</p>}
      <p className="muted">Latest update to this list: {fmtMDY(banked[0]?.date ?? "2026-10-27")}.</p>
    </Guide>
  );
}
