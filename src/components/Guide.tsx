import Link from "next/link";
import JsonLd from "./JsonLd";
import GuideLinks from "./GuideLinks";
import { SITE, type VendorId } from "@/lib/site";

export const LAST_CHECKED = "Oct 27, 2026";

export type Source = { label: string; url: string };

export default function Guide({ vendor, path, title, h1, description, sources, children }: { vendor: VendorId; path: string; title: string; h1: string; description: string; sources: Source[]; children: React.ReactNode }) {
  return (
    <article className={`prose v-${vendor}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          mainEntityOfPage: `${SITE.url}${path}`,
          dateModified: "2026-10-27",
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` } },
          citation: sources.map((s) => s.url),
        }}
      />
      <h1>{h1}</h1>
      {children}
      <GuideLinks vendor={vendor} current={path} />
      <h2>Sources</h2>
      <ul>
        {sources.map((s) => (
          <li key={s.url}><a href={s.url} rel="nofollow noopener" target="_blank">{s.label}</a></li>
        ))}
      </ul>
      <p className="muted">Last checked {LAST_CHECKED}. Independent; not affiliated with Anthropic or OpenAI. See the live <Link href={vendor === "claude" ? "/claude-reset" : "/codex-reset"}>{vendor === "claude" ? "Claude" : "Codex"} reset tracker</Link>.</p>
    </article>
  );
}
