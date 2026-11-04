import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { SITE, VENDORS } from "@/lib/site";
import { answer } from "@/lib/seo";
import { daysSince, getEvents, when } from "@/lib/events";
import BankedBanner from "@/components/BankedBanner";
import JsonLd from "@/components/JsonLd";
import VendorLogo from "@/components/VendorLogo";
import { INDEX_PATH } from "@/lib/motion-skills";

export const revalidate = 300;

const TITLE = "toolsfordevs: Claude tools and skills";
const DESCRIPTION =
  "toolsfordevs.app is an independent directory of free tools for Claude Code and Codex: live usage-limit reset trackers, and free skills for motion graphics and reels.";

const SECTIONS = [
  { name: "Claude reset tracker", path: "/claude-reset", description: "Did Claude reset today? Last usage-limit reset, banked Reset for free, and the sourced history." },
  { name: "Codex reset tracker", path: "/codex-reset", description: "Did Codex reset today? Last OpenAI Codex usage-limit reset, banked resets, and the sourced history." },
  { name: "Motion graphics skills", path: INDEX_PATH, description: "Free Claude Code skills for paper-cut reels, 3D films, talking-head edits, and motion graphics." },
  { name: "Reset history", path: "/reset-history", description: "Every logged Claude and Codex usage-limit reset, with dates and sources." },
  { name: "Claude vs Codex resets", path: "/claude-vs-codex-resets", description: "Monthly counts of Claude and Codex usage-limit resets side by side." },
  { name: "Limit changes", path: "/changes", description: "Logged changes to Claude and Codex usage limits, separate from one-off resets." },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default async function Home() {
  const [claude, codex, events] = await Promise.all([answer("claude"), answer("codex"), getEvents()]);
  const pageUrl = SITE.url;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", name: SITE.name, url: SITE.url, description: DESCRIPTION },
            { "@type": "Organization", name: SITE.name, url: SITE.url, logo: `${SITE.url}/icon.svg` },
            {
              "@type": "CollectionPage",
              name: TITLE,
              description: DESCRIPTION,
              url: pageUrl,
              isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
            },
            {
              "@type": "ItemList",
              name: "toolsfordevs sections",
              itemListOrder: "https://schema.org/ItemListOrderAscending",
              numberOfItems: SECTIONS.length,
              itemListElement: SECTIONS.map((s, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: s.name,
                url: `${SITE.url}${s.path}`,
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [{ "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url }],
            },
          ],
        }}
      />
      <BankedBanner />
      <section className="home-intro" aria-labelledby="home-title">
        <p className="eyebrow">{"// toolsfordevs"}</p>
        <h1 id="home-title">Small tools for Claude Code and Codex.</h1>
        <p className="intro-copy">{DESCRIPTION}</p>
      </section>

      <div className="section-heading">
        <h2>What is on toolsfordevs?</h2>
        <span className="eyebrow">{"// pick a section"}</span>
      </div>
      <div className="hub-grid">
        <Link href="/claude-reset" className="card tracker-card tracker-claude v-claude hub-card">
          <div className="titlebar" aria-hidden="true"><i /><i /><i /><span>claude-reset.log</span></div>
          <div className="tracker-body">
            <div className="tracker-heading">
              <VendorLogo vendor="claude" size={44} />
              <div><h3>Claude reset tracker</h3><span className="muted">Usage limits</span></div>
              <span className="tracker-arrow" aria-hidden="true">↗</span>
            </div>
            <p className="metric-label">Last logged reset</p>
            <p className="hub-metric">{claude.last ? (daysSince(claude.last.date) === 0 ? "Today" : `${daysSince(claude.last.date)}d ago`) : "None logged"}</p>
            <p>{claude.text}</p>
            <p className="tracker-bottom"><span>{claude.last ? <time dateTime={claude.last.announced_at ?? claude.last.date}>{when(claude.last)}</time> : "Open the tracker"}</span><span>Open tracker →</span></p>
          </div>
        </Link>
        <Link href="/codex-reset" className="card tracker-card tracker-codex v-codex hub-card">
          <div className="titlebar" aria-hidden="true"><i /><i /><i /><span>codex-reset.log</span></div>
          <div className="tracker-body">
            <div className="tracker-heading">
              <VendorLogo vendor="codex" size={44} />
              <div><h3>Codex reset tracker</h3><span className="muted">Usage limits</span></div>
              <span className="tracker-arrow" aria-hidden="true">↗</span>
            </div>
            <p className="metric-label">Last logged reset</p>
            <p className="hub-metric">{codex.last ? (daysSince(codex.last.date) === 0 ? "Today" : `${daysSince(codex.last.date)}d ago`) : "None logged"}</p>
            <p>{codex.text}</p>
            <p className="tracker-bottom"><span>{codex.last ? <time dateTime={codex.last.announced_at ?? codex.last.date}>{when(codex.last)}</time> : "Open the tracker"}</span><span>Open tracker →</span></p>
          </div>
        </Link>
        <Link href={INDEX_PATH} className="card hub-skills">
          <div className="titlebar" aria-hidden="true"><i /><i /><i /><span>claude-skills/</span></div>
          <div className="hub-shots" aria-hidden="true">
            <Image src="/motion-graphics/papercut-explainer/1.webp" alt="" width={506} height={900} />
            <Image src="/motion-graphics/lowpoly-reel/1.webp" alt="" width={300} height={534} />
            <Image src="/motion-graphics/herk-edit-kit/1.webp" alt="" width={360} height={640} />
          </div>
          <div className="hub-skills-body">
            <p className="eyebrow">Claude Code skills</p>
            <h3>Motion graphics and reels</h3>
            <p>Free Claude Code skills for paper-cut explainers, 3D films, talking-head edits, and motion graphics. More skill categories can sit beside this one.</p>
            <p className="tracker-bottom"><span>15 skills, checked against each README</span><span>Open the roundup →</span></p>
          </div>
        </Link>
      </div>

      <div className="section-heading">
        <h2>What reset was logged last?</h2>
        <span className="eyebrow">{"// newest first"}</span>
      </div>
      <ul className="hub-links">
        {events.slice(0, 3).map((e) => (
          <li key={e.id}><Link href={`${VENDORS[e.vendor].path}/${e.date}`}>{e.title}</Link>. {e.summary}</li>
        ))}
      </ul>
      <div className="section-heading">
        <h2>Reset history and guides</h2>
        <span className="eyebrow">{"// same data, other doors"}</span>
      </div>
      <ul className="hub-links">
        {SECTIONS.slice(3).map((s) => (
          <li key={s.path}><Link href={s.path}>{s.name}</Link>. {s.description}</li>
        ))}
        <li><Link href="/claude-usage-limits">How Claude usage limits work</Link>. Session and weekly limits on paid Claude plans.</li>
        <li><Link href="/claude-limit-reset">Claude limit reset</Link>. How Reset for free is announced and logged.</li>
        <li><Link href="/codex-usage-limits">How Codex usage limits work</Link>. Codex plan windows and what counts.</li>
        <li><Link href="/codex-banked-reset">Codex banked reset</Link>. How a banked Codex reset is granted and redeemed.</li>
      </ul>
    </>
  );
}
