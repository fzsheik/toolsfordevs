import { notFound } from "next/navigation";
import { VENDORS, SITE, type VendorId } from "@/lib/site";
import { getEvent, fmtDate, daysSince } from "@/lib/events";
import Badge from "./Badge";
import JsonLd from "./JsonLd";
import Message from "./Message";
import Link from "next/link";

export default async function EventPage({ vendor, date }: { vendor: VendorId; date: string }) {
  const e = await getEvent(vendor, date);
  if (!e) notFound();
  const v = VENDORS[vendor];
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
