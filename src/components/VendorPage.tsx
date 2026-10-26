import { VENDORS, SITE, type VendorId } from "@/lib/site";
import { getEvents, daysSince, fmtDate } from "@/lib/events";
import EventList from "./EventList";
import Estimate from "./Estimate";
import JsonLd from "./JsonLd";
import CallYourShot from "./CallYourShot";
import VendorLogo from "./VendorLogo";

const FAQ = (v: (typeof VENDORS)[VendorId], lastDate?: string) => [
  {
    q: `Did ${v.name} reset today?`,
    a: lastDate
      ? `The last ${v.name} limit reset we have logged was on ${fmtDate(lastDate)} (${daysSince(lastDate)} days ago). This page is updated whenever a new reset is announced.`
      : `We have not logged any ${v.name} reset yet.`,
  },
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
  const last = events.find((e) => e.kind === "reset");
  const banked = events.find((e) => e.kind === "banked" && last && e.date > last.date);
  const faq = FAQ(v, last?.date);
  const checked = new Date();
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
              ...(last ? { datePublished: last.date } : {}),
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
      <h1>{v.name} reset tracker: did {v.product} limits reset?</h1>
      {last ? (
        <div className="card answer">
          <div className="titlebar" aria-hidden="true"><i /><i /><i /><span>{vendor}-reset.log</span></div>
          <div className="answer-body">
            <p className="kicker"><VendorLogo vendor={vendor} size={26} /> {daysSince(last.date) <= 1 ? "> yes, it just reset" : "> not lately. last reset was"}</p>
            <p className="big">{daysSince(last.date) === 0 ? "Today" : `${daysSince(last.date)} days ago`}</p>
            {banked ? <p className="banked-note">+ banked reset granted {daysSince(banked.date)} days ago ({fmtDate(banked.date)}), redeemable later</p> : null}
            <p>
              Last {v.name} limit reset: <time dateTime={last.date}>{fmtDate(last.date)}</time>. {last.title}.
            </p>
          </div>
        </div>
      ) : (
        <p>No resets logged yet.</p>
      )}
      <CallYourShot vendors={[{ id: vendor, name: v.name, resetDates: events.filter((e) => e.kind === "reset").map((e) => e.date) }]} />
      <p className="checked">Checked <time dateTime={checked.toISOString()}>{checked.toISOString().slice(0, 16).replace("T", " ")} UTC</time></p>
      <Estimate vendor={vendor} />
      <h2>Every {v.name} reset so far</h2>
      <EventList events={events} />
      <h2>Quick answers</h2>
      {faq.map((f) => (
        <details key={f.q} open>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
