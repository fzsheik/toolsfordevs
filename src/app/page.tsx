import Link from "next/link";
import type { Metadata } from "next";
import { VENDORS, SITE } from "@/lib/site";
import { getEvents, daysSince, when } from "@/lib/events";
import { answer } from "@/lib/seo";
import AlertsBlock from "@/components/AlertsBlock";
import CallYourShot from "@/components/CallYourShotLazy";
import Estimate from "@/components/Estimate";
import EventList from "@/components/EventList";
import JsonLd from "@/components/JsonLd";
import VendorLogo from "@/components/VendorLogo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Did Claude or Codex Reset Today? Live Limit Reset Tracker" },
  description:
    "Live answer for Claude Code and OpenAI Codex usage limit resets: last reset date and time, sourced history, banked resets, and free RSS and calendar alerts.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const events = await getEvents();
  const checked = new Date();
  const [claude, codex] = await Promise.all([answer("claude"), answer("codex")]);
  const answerText = `${claude.text} ${codex.text}`;
  const faq = [
    { q: "Did Claude reset today?", a: `${claude.text} Extra resets are announced by Anthropic staff on X; this page checks every few minutes. See how Claude usage limits work and how to use Reset for free.` },
    { q: "Did Codex reset today?", a: `${codex.text} Extra resets are announced by OpenAI staff on X; this page checks every few minutes. See how Codex usage limits work and how to redeem a banked reset.` },
    { q: "How often do Claude and Codex usage limits reset?", a: "Normal 5-hour and weekly windows roll on their own. Separate one-off resets are announced ad hoc, with no published schedule. The rhythm cards on this page show the median gap and recent counts." },
  ];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", name: SITE.name, url: SITE.url, description: SITE.tagline },
            { "@type": "Organization", name: SITE.name, url: SITE.url, logo: `${SITE.url}/icon.svg` },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <section className="home-intro" aria-labelledby="home-title">
        <p className="eyebrow">$ did-it-reset --claude --codex</p>
        <h1 id="home-title">Did Claude or Codex reset today?</h1>
        <p className="intro-copy">{answerText}</p>
        <p className="checked">Checked <time dateTime={checked.toISOString()}>{checked.toISOString().slice(0, 16).replace("T", " ")} UTC</time>. &ldquo;Today&rdquo; is the UTC day.</p>
      </section>
      <div className="section-heading">
        <h2>The reset log</h2>
        <span className="eyebrow">{"// at a glance"}</span>
      </div>
      <div className="grid tracker-grid">
        {Object.values(VENDORS).map((v) => {
          const last = events.find((e) => e.vendor === v.id && e.kind === "reset");
          return (
            <Link key={v.id} href={v.path} className={`card tracker-card tracker-${v.id} v-${v.id}`}>
              <div className="titlebar" aria-hidden="true"><i /><i /><i /><span>{v.id}-reset.log</span></div>
              <div className="tracker-body">
              <div className="tracker-heading">
                <VendorLogo vendor={v.id} size={44} />
                <div><h3>{v.product}</h3><span className="muted">{v.owner}</span></div>
                <span className="tracker-arrow" aria-hidden="true">↗</span>
              </div>
              <p className="metric-label">Last logged reset</p>
              <p className="big">{last ? (daysSince(last.date) === 0 ? "Today" : daysSince(last.date)) : "—"}{last && daysSince(last.date) > 0 && <span>{daysSince(last.date) === 1 ? "day ago" : "days ago"}</span>}</p>
              <div className="tracker-bottom">
                <span>{last ? <time dateTime={last.announced_at ?? last.date}>{when(last)}</time> : "None logged"}</span>
                <span>View history <span aria-hidden="true">→</span></span>
              </div>
              </div>
            </Link>
          );
        })}
      </div>
      <CallYourShot
        vendors={Object.values(VENDORS).map((v) => ({
          id: v.id,
          name: v.name,
          resetDates: events.filter((e) => e.vendor === v.id && e.kind === "reset").map((e) => e.date),
        }))}
      />
      <div className="estimate-group">
        <p className="eyebrow">{"// next up"}</p>
        <Estimate vendor="claude" />
        <Estimate vendor="codex" />
      </div>
      <div className="section-heading news-heading">
        <h2>From the changelog</h2>
        <span className="eyebrow">{"// latest news"}</span>
      </div>
      <EventList events={events.slice(0, 5)} />
      <AlertsBlock />
      <h2>Quick answers</h2>
      {faq.map((f) => (
        <details key={f.q} open>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
      <p className="history-link">Guides: <Link href="/claude-usage-limits">Claude usage limits</Link> · <Link href="/claude-limit-reset">Claude limit reset</Link> · <Link href="/codex-usage-limits">Codex usage limits</Link> · <Link href="/codex-banked-reset">Codex banked reset</Link></p>
      <p className="history-link"><Link href="/reset-history">Explore the full reset history <span aria-hidden="true">→</span></Link></p>
    </>
  );
}
