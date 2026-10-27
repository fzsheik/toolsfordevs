import Link from "next/link";
import { VENDORS, SITE, type VendorId } from "@/lib/site";
import { getEvents, daysSince, ago, fmtMDY, bankedStatus, when } from "@/lib/events";
import { answer } from "@/lib/seo";
import EventList from "./EventList";
import Estimate from "./Estimate";
import JsonLd from "./JsonLd";
import CallYourShot from "./CallYourShotLazy";
import VendorLogo from "./VendorLogo";
import BankedBanner from "./BankedBanner";
import AlertsBlock from "./AlertsBlock";
import GuideLinks, { GUIDES } from "./GuideLinks";

const FAQ = (v: (typeof VENDORS)[VendorId], status: string) => [
  { q: `Did ${v.name} reset today?`, a: `${status} "Today" is decided in UTC. This page is updated whenever a new reset is announced.` },
  {
    q: `How often does ${v.name} reset usage limits?`,
    a: `${v.owner} does not publish a schedule for ad hoc resets. Normal 5-hour and weekly windows roll on their own; the events listed here are extra resets announced by ${v.owner} staff or leadership.`,
  },
  {
    q: `Where are ${v.name} resets announced?`,
    a: `Mostly on official X accounts and changelogs. Every entry here links to its source and shows a Verified or Source-linked badge.`,
  },
];

export default async function VendorPage({ vendor }: { vendor: VendorId }) {
  const v = VENDORS[vendor];
  const events = await getEvents(vendor);
  const { last, banked, text } = await answer(vendor);
  const faq = FAQ(v, text);
  const checked = new Date();
  const guides = GUIDES[vendor];
  return (
    <div className={`v-${vendor}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "WebPage",
              name: `${v.name} reset tracker`,
              url: `${SITE.url}${v.path}`,
              dateModified: checked.toISOString(),
              ...(last ? { datePublished: last.announced_at ?? last.date } : {}),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
                { "@type": "ListItem", position: 2, name: `${v.name} reset`, item: `${SITE.url}${v.path}` },
              ],
            },
          ],
        }}
      />
      <BankedBanner vendor={vendor} />
      <h1>Did {v.name} reset today?</h1>
      <p className="intro-copy">{text}</p>
      {last ? (
        <div className="card answer">
          <div className="titlebar" aria-hidden="true"><i /><i /><i /><span>{vendor}-reset.log</span></div>
          <div className="answer-body">
            <p className="kicker"><VendorLogo vendor={vendor} size={26} /> {daysSince(last.date) <= 1 ? "> yes, it just reset" : "> not lately. last reset was"}</p>
            <p className="big">{daysSince(last.date) === 0 ? "Today" : ago(daysSince(last.date))}</p>
            {banked ? <p className="banked-note">+ banked reset granted {ago(daysSince(banked.date))} ({fmtMDY(banked.date)}), {bankedStatus(banked) === "expired" ? `expired ${fmtMDY(banked.expires_at!)}` : "redeemable later"}</p> : null}
            <p>
              Last {v.name} limit reset: <time dateTime={last.announced_at ?? last.date}>{when(last)}</time>. {last.title}.
            </p>
          </div>
        </div>
      ) : (
        <p>No resets logged yet.</p>
      )}
      <p className="checked">Checked <time dateTime={checked.toISOString()}>{checked.toISOString().slice(0, 16).replace("T", " ")} UTC</time>. &ldquo;Today&rdquo; is the UTC day.</p>
      <CallYourShot vendors={[{ id: vendor, name: v.name, resetDates: events.filter((e) => e.kind === "reset").map((e) => e.date) }]} />
      <Estimate vendor={vendor} />
      <AlertsBlock />
      <GuideLinks vendor={vendor} current={v.path} />
      <h2>Every {v.name} reset so far</h2>
      <EventList events={events} />
      <h2>Quick answers</h2>
      {faq.map((f) => (
        <details key={f.q} open>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
      <p>Read more: <Link href={guides[1].href}>{guides[1].label}</Link>, <Link href={guides[2].href}>{guides[2].label}</Link>.</p>
    </div>
  );
}
