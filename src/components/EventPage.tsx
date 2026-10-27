import { notFound } from "next/navigation";
import { VENDORS, SITE, type VendorId } from "@/lib/site";
import { getEvent, fmtDate, daysSince, ago, when, fmtUtc, fmtPacific, fmtMDY, gapDays, eventType, isExpired, plural, postHandle } from "@/lib/events";
import { neighbours, eventH1 } from "@/lib/seo";
import Badge from "./Badge";
import JsonLd from "./JsonLd";
import Message from "./Message";
import GuideLinks, { GUIDES } from "./GuideLinks";
import Link from "next/link";

const ord = (n: number) => (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10 > 3 ? 0 : n % 10]);

const TYPE_LABEL = { global: "Global reset", banked: "Banked reset", "max-only": "Max-only reset" } as const;

const CLAUDE_HELP = "https://support.claude.com/en/articles/17007452-what-is-a-limit-reset";
const CODEX_HELP = "https://help.openai.com/en/articles/20001498-how-resets-work-in-codex";

export default async function EventPage({ vendor, date }: { vendor: VendorId; date: string }) {
  const e = await getEvent(vendor, date);
  if (!e) notFound();
  const v = VENDORS[vendor];
  const { n, prev, next } = await neighbours(e);
  const noun = e.kind === "banked" ? "banked reset" : e.kind === "reset" ? "limit reset" : "update";
  const type = eventType(e);
  const url = `${SITE.url}${v.path}/${e.date}`;
  const handle = postHandle(e);
  const expired = isExpired(e);
  const published = e.announced_at ?? `${e.date}T00:00:00Z`;
  const guide = GUIDES[vendor][e.kind === "banked" ? 2 : 1];
  return (
    <article className={`v-${vendor}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: eventH1(e),
          datePublished: published,
          dateModified: published,
          image: [`${url}/opengraph-image`],
          mainEntityOfPage: url,
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` } },
          author: { "@type": "Organization", name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` } },
          citation: e.sources.map((s) => s.url),
        }}
      />
      <p><Link href={v.path}>← {v.name} reset tracker</Link></p>
      <h1>{eventH1(e)}</h1>
      <p className="muted">
        <time dateTime={published}>{when(e)}</time> · {ago(daysSince(e.date))} · <Badge status={e.status} />
      </p>
      <p>{e.title}. {e.summary}</p>
      <Message e={e} link={false} />
      <h2>Details</h2>
      <ul>
        {e.announced_at ? (
          <>
            <li><strong>Announced (UTC):</strong> {fmtUtc(e.announced_at)}</li>
            <li><strong>Announced (Pacific):</strong> {fmtPacific(e.announced_at)}</li>
          </>
        ) : <li><strong>Date:</strong> {fmtDate(e.date)} (UTC; exact time not recorded)</li>}
        <li><strong>Posted by:</strong> {handle ? `@${handle}` : v.owner}</li>
        <li><strong>Type:</strong> {TYPE_LABEL[type]}</li>
        <li><strong>Scope and plans covered:</strong> {e.scope}</li>
        {e.expires_at ? <li><strong>{expired ? "Expired" : "Expires"}:</strong> {fmtUtc(e.expires_at)} ({fmtPacific(e.expires_at)})</li> : null}
      </ul>
      <p className="ctx">
        This is the {n}{ord(n)} {v.name} {noun} in our log.{" "}
        {prev ? <>The one before it was <Link href={`${v.path}/${prev.date}`}>{fmtMDY(prev.date)}</Link>, {plural(gapDays(e.date, prev.date), "day")} earlier. </> : null}
        {next ? <>The next one was <Link href={`${v.path}/${next.date}`}>{fmtMDY(next.date)}</Link>, {plural(gapDays(next.date, e.date), "day")} later. </> : <>It is the most recent so far. </>}
        See the full <Link href={v.path}>{v.name} reset tracker</Link> for the current count and rhythm.
      </p>
      <h2>What this means for you</h2>
      <p>
        {e.kind === "banked" ? (
          <>
            {expired ? `This banked reset expired on ${fmtMDY(e.expires_at!)} and can no longer be redeemed. ` : ""}
            A banked reset is a credit you redeem yourself{vendor === "claude" ? " in Settings > Usage" : " in Settings > Usage (or /usage in Codex CLI)"}. Official help:{" "}
            <a href={vendor === "claude" ? CLAUDE_HELP : CODEX_HELP} rel="nofollow noopener" target="_blank">{vendor === "claude" ? "What is a limit reset?" : "How resets work in Codex"}</a>.
          </>
        ) : type === "max-only" ? "This reset applied to Max plans only. It is applied automatically; there is nothing to redeem." : "This was a global reset: it applies automatically to covered accounts and there is nothing to redeem."}
      </p>
      <GuideLinks vendor={vendor} current={v.path} />
      <p>Guide: <Link href={guide.href}>{guide.label}</Link></p>
      <h2>Sources</h2>
      <ul>
        {e.sources.map((s) => (
          <li key={s.url}><a href={s.url} rel="nofollow noopener" target="_blank">{s.label}</a></li>
        ))}
      </ul>
    </article>
  );
}
