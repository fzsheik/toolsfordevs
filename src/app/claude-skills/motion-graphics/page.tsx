import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SkillCard from "@/components/motion/SkillCard";
import SkillTable from "@/components/motion/SkillTable";
import {
  CATEGORIES,
  FAQS,
  INDEX_DESCRIPTION,
  INDEX_META_TITLE,
  INDEX_PATH,
  INDEX_TITLE,
  PICKS,
  SKILL_ROWS,
  SKILLS,
  TAKEAWAYS,
  UPDATED,
  UPDATED_LABEL,
  getSkill,
  skillPath,
} from "@/lib/motion-skills";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: INDEX_META_TITLE },
  description: INDEX_DESCRIPTION,
  alternates: { canonical: INDEX_PATH },
  openGraph: {
    title: INDEX_META_TITLE,
    description: INDEX_DESCRIPTION,
    url: INDEX_PATH,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: INDEX_META_TITLE, description: INDEX_DESCRIPTION },
};

export default function Page() {
  const pageUrl = `${SITE.url}${INDEX_PATH}`;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
            { "@type": "ListItem", position: 2, name: "Motion graphics skills", item: pageUrl },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: INDEX_TITLE,
          description: INDEX_DESCRIPTION,
          url: pageUrl,
          dateModified: UPDATED,
          isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: INDEX_TITLE,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: SKILLS.length,
          itemListElement: SKILLS.map((skill, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: skill.name,
            url: `${SITE.url}${skillPath(skill.slug)}`,
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <article className="skills-page">
        <p className="eyebrow">{"// claude skills --motion --reels"}</p>
        <h1>{INDEX_TITLE}</h1>
        <p className="intro-copy">
          A field guide to free Claude Code skills and repos for reels, paper-cut explainers, 3D films and talking-head edits. Every install line, voice note and limit here is taken from that project&apos;s README or format page.
        </p>
        <p className="checked">
          Last updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>. {SKILLS.length} skills. Facts left out when a page did not state them.
        </p>
        <section className="card tldr" id="tldr" aria-labelledby="tldr-title">
          <div className="titlebar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>tldr.txt</span>
          </div>
          <div className="tldr-body">
            <h2 id="tldr-title">Which free Claude Code skill should I use?</h2>
            {TAKEAWAYS.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>
        <nav className="skill-jump" aria-label="On this page">
          <a href="#tldr">Takeaways</a>
          <a href="#compare">Compare</a>
          {CATEGORIES.map((category) => (
            <a key={category.id} href={`#${category.id}`}>
              {category.title}
            </a>
          ))}
          <a href="#pick">Which one</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="section-heading" id="compare">
          <h2>How do these free Claude Code skills compare?</h2>
          <span className="eyebrow">{"// sort or filter"}</span>
        </div>
        <p>The comparison lists every skill&apos;s name, style, what is free, voice, operating system, and licence. The full table is in the page HTML. Filters only hide rows after a click.</p>
        <SkillTable rows={SKILL_ROWS} />
        <p className="checked">The name opens the notes on this site. The last column opens the README or format page. “Not stated” means that page did not say.</p>

        {CATEGORIES.map((category) => (
          <section key={category.id} id={category.id} aria-labelledby={`${category.id}-title`}>
            <div className="section-heading">
              <h2 id={`${category.id}-title`}>{category.question}</h2>
            </div>
            <p>{category.lede}</p>
            <div className="grid skill-grid">
              {SKILLS.filter((skill) => skill.category === category.id).map((skill) => (
                <SkillCard key={skill.slug} skill={skill} />
              ))}
            </div>
          </section>
        ))}

        <div className="section-heading" id="pick">
          <h2>Which Claude Code skill should I pick?</h2>
          <span className="eyebrow">{"// by the job"}</span>
        </div>
        <p>Pick a Claude Code motion skill by the job. Each recommendation uses only what that project&apos;s README or format page states.</p>
        <div className="pick-grid">
          {PICKS.map((pick) => {
            const skill = getSkill(pick.slug);
            const extra = pick.also ? getSkill(pick.also) : undefined;
            if (!skill) return null;
            return (
              <article key={pick.goal} className="card pick-card">
                <p className="eyebrow">{pick.goal}</p>
                <h3>
                  <Link href={skillPath(skill.slug)}>{skill.name}</Link>
                  {extra ? (
                    <>
                      {" "}
                      or <Link href={skillPath(extra.slug)}>{extra.name}</Link>
                    </>
                  ) : null}
                </h3>
                <p>{pick.why}</p>
              </article>
            );
          })}
        </div>

        <h2 id="faq">What do people ask about Claude Code video skills?</h2>
        {FAQS.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
        <p className="history-link">
          <Link href="/">
            Back to the reset tracker <span aria-hidden="true">→</span>
          </Link>
        </p>
      </article>
    </>
  );
}
