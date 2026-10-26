import { notFound } from "next/navigation";
import { VENDORS, SITE, type VendorId } from "@/lib/site";
import { getEvent, getEvents, fmtDate, daysSince } from "@/lib/events";
import Badge from "./Badge";
import JsonLd from "./JsonLd";
import Message from "./Message";
import Link from "next/link";

const ord = (n: number) => (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10 > 3 ? 0 : n % 10]);

export default async function EventPage({ vendor, date }: { vendor: VendorId; date: string }) {
  const e = await getEvent(vendor, date);
  if (!e) notFound();
  const v = VENDORS[vendor];
  const same = (await getEvents(vendor)).filter((x) => x.kind === e.kind);
  const i = same.findIndex((x) => x.id === e.id);
  const prev = same[i + 1];
  const next = same[i - 1];
  const gap = (a: string, b: string) => Math.round((Date.parse(a) - Date.parse(b)) / 86_400_000);
  const noun = e.kind === "banked" ? "banked reset" : e.kind === "reset" ? "limit reset" : "update";
  return (
    <article className={`v-${vendor}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: e.title,
          datePublished: e.date,
          dateModified: e.date,
          mainEntityOfPage: `${SITE.url}${v.path}/${e.date}`,
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          author: { "@type": "Organization", name: SITE.name },
          citation: e.sources.map((s) => s.url),
        }}
      />
      <p><Link href={v.path}>← {v.name} reset tracker</Link></p>
      <h1>{e.title}</h1>
      <p className="muted">
        <time dateTime={e.date}>{fmtDate(e.date)}</time> · {daysSince(e.date)} days ago · <Badge status={e.status} />
      </p>
      <p>{e.summary}</p>
      <Message e={e} link={false} />
      <p className="ctx">
        This is the {same.length - i}{ord(same.length - i)} {v.name} {noun} in our log.{" "}
        {prev ? <>The one before it was <Link href={`${v.path}/${prev.date}`}>{fmtDate(prev.date)}</Link>, {gap(e.date, prev.date)} days earlier. </> : null}
        {next ? <>The next one was <Link href={`${v.path}/${next.date}`}>{fmtDate(next.date)}</Link>, {gap(next.date, e.date)} days later. </> : <>It is the most recent so far. </>}
        See the full <Link href={v.path}>{v.name} reset tracker</Link> for the current count and rhythm.
      </p>
      <p><strong>Scope:</strong> {e.scope}</p>
      <h2>Sources</h2>
      <ul>
        {e.sources.map((s) => (
          <li key={s.url}><a href={s.url} rel="nofollow noopener" target="_blank">{s.label}</a></li>
        ))}
      </ul>
    </article>
  );
}
