import Link from "next/link";
import type { Metadata } from "next";
import { VENDORS, SITE } from "@/lib/site";
import { getEvents, daysSince, fmtDate } from "@/lib/events";
import CallYourShot from "@/components/CallYourShot";
import Estimate from "@/components/Estimate";
import EventList from "@/components/EventList";
import JsonLd from "@/components/JsonLd";
import VendorLogo from "@/components/VendorLogo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Claude reset & Codex reset tracker: did limits reset today?" },
  description:
    "Live tracker for Claude and Codex usage limit resets. See the last reset, full history with sources, and a rough estimate of the next one.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const events = await getEvents();
  const checked = new Date();
  const lastOf = (id: string) => events.find((e) => e.vendor === id && e.kind === "reset");
  const phrase = (id: "claude" | "codex") => {
    const l = lastOf(id);
    const d = l ? daysSince(l.date) : null;
    return `${VENDORS[id].name} ${l ? (d === 0 ? "reset today" : d === 1 ? "last reset 1 day ago" : `last reset ${d} days ago`) : "has no logged reset"} (${l ? fmtDate(l.date) : "n/a"})`;
  };
  const answer = `${phrase("claude")}. ${phrase("codex")}. Full history, sources and a rough guess at the next reset below.`;
  const faq = [
    { q: "Did Claude reset today?", a: `${phrase("claude")}. Extra resets are announced by Anthropic staff on X; this page checks every few minutes.` },
    { q: "Did Codex reset today?", a: `${phrase("codex")}. Extra resets are announced by OpenAI staff on X; this page checks every few minutes.` },
    { q: "How often do Claude and Codex usage limits reset?", a: "Normal 5-hour and weekly windows roll on their own. Separate one-off resets are announced ad hoc, roughly every few weeks, with no published schedule. The rhythm cards on this page show the recent gaps." },
  ];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: SITE.url,
          description: SITE.tagline,
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
        <h1 id="home-title">Did Claude or Codex reset?</h1>
        <p className="intro-copy">{answer}</p>
        <p className="checked">Checked <time dateTime={checked.toISOString()}>{checked.toISOString().slice(0, 16).replace("T", " ")} UTC</time></p>
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
              <p className="big">{last ? daysSince(last.date) : "—"}{last && <span>days ago</span>}</p>
              <div className="tracker-bottom">
                <span>{last ? <time dateTime={last.date}>{fmtDate(last.date)}</time> : "None logged"}</span>
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
      <h2>Quick answers</h2>
      {faq.map((f) => (
        <details key={f.q} open>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
      <p className="history-link"><Link href="/reset-history">Explore the full reset history <span aria-hidden="true">→</span></Link></p>
    </>
  );
}
