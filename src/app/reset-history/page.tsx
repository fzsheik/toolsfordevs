import type { Metadata } from "next";
import Link from "next/link";
import EventList from "@/components/EventList";
import HistoryFilter from "@/components/HistoryFilter";
import JsonLd from "@/components/JsonLd";
import AlertsBlock from "@/components/AlertsBlock";
import { getEvents } from "@/lib/events";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Claude & Codex Reset History: Every Usage Limit Reset Logged" },
  description: "Every Claude Code and OpenAI Codex usage limit reset by month, with date, time, scope, plan coverage and the original post. Download as JSON, RSS or ICS.",
  alternates: { canonical: "/reset-history" },
};

export const revalidate = 300;

const monthName = (date: string) =>
  new Date(`${date.slice(0, 7)}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

export default async function Page() {
  const events = await getEvents();
  const groups: { month: string; items: typeof events }[] = [];
  for (const e of events) {
    const m = monthName(e.date);
    const g = groups[groups.length - 1];
    if (g?.month === m) g.items.push(e);
    else groups.push({ month: m, items: [e] });
  }
  const first = events[events.length - 1]?.date;
  const last = events[0]?.date;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Claude and Codex usage limit reset history",
          description: "Every logged Claude Code and OpenAI Codex usage limit reset and banked reset, with date, announced time, scope and source links.",
          url: `${SITE.url}/reset-history`,
          creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
          ...(first && last ? { temporalCoverage: `${first}/${last}` } : {}),
          distribution: [
            { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${SITE.url}/resets.json` },
            { "@type": "DataDownload", encodingFormat: "text/calendar", contentUrl: `${SITE.url}/resets.ics` },
          ],
        }}
      />
      <h1>Claude and Codex reset history</h1>
      <p className="muted">Times are UTC. Download: <a href="/resets.json">JSON</a> · <a href="/resets.xml">RSS</a> · <a href="/resets.ics">ICS</a></p>
      <HistoryFilter>
        {groups.map((g) => (
          <section key={g.month}>
            <h2>{g.month}</h2>
            <EventList events={g.items} />
          </section>
        ))}
      </HistoryFilter>
      <AlertsBlock />
      <section id="how-we-verify">
        <h2>Why our times differ</h2>
        <p>We use the post timestamp for the announcement and, when there is a separate &ldquo;propagated&rdquo; or &ldquo;it&apos;s done&rdquo; post, its timestamp for the landing. We do not use the moment a tracker first noticed a reset, so our times can be earlier than codex-reset.com or claude-resets.com.</p>
        <h2>How we verify</h2>
        <ul>
          <li><b>Verified:</b> a human opened the primary post (X) and confirmed it announces a reset.</li>
          <li><b>Source-linked:</b> the primary post is cited by a tracker (<a href="https://codex-reset.com/" rel="nofollow noopener" target="_blank">codex-reset.com</a> or <a href="https://claude-resets.com/" rel="nofollow noopener" target="_blank">claude-resets.com</a>) or by us, but we have not opened it ourselves yet. Source-linked entries with no post text are kept out of search indexing until checked.</li>
          <li><b>What counts as a reset:</b> a post from the vendor&apos;s staff stating usage limits were reset. Banked resets (credits you redeem later) and policy changes are logged separately from full resets.</li>
          <li><b>How often we check:</b> the live feeds are re-read about every 5 minutes; the committed log is reviewed by hand.</li>
        </ul>
        <p><Link href="/changes">Limit changes log</Link> · <Link href="/claude-vs-codex-resets">Claude vs Codex reset counts</Link></p>
      </section>
    </>
  );
}
