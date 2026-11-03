import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SkillCard from "@/components/motion/SkillCard";
import SkillTable from "@/components/motion/SkillTable";
import {
  CATEGORIES,
  FAQS,
  INDEX_DESCRIPTION,
  INDEX_PATH,
  INDEX_TITLE,
  PICKS,
  SKILL_ROWS,
  SKILLS,
  UPDATED,
  UPDATED_LABEL,
  getSkill,
  skillPath,
} from "@/lib/motion-skills";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: INDEX_TITLE },
  description: INDEX_DESCRIPTION,
  alternates: { canonical: INDEX_PATH },
  openGraph: {
    title: INDEX_TITLE,
    description: INDEX_DESCRIPTION,
    url: INDEX_PATH,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: INDEX_TITLE, description: INDEX_DESCRIPTION },
};

export default function Page() {
  const pageUrl = `${SITE.url}${INDEX_PATH}`;
  return (
    <>
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
        <nav className="skill-jump" aria-label="On this page">
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
          <h2>Compare them</h2>
          <span className="eyebrow">{"// sort or filter"}</span>
        </div>
        <SkillTable rows={SKILL_ROWS} />
        <p className="checked">Name opens the notes on this site. The last column opens the README or format page. “Not stated” means that page did not say.</p>

        {CATEGORIES.map((category) => (
          <section key={category.id} id={category.id} aria-labelledby={`${category.id}-title`}>
            <div className="section-heading">
              <h2 id={`${category.id}-title`}>{category.title}</h2>
              <span className="eyebrow">{`// ${category.lede}`}</span>
            </div>
            <div className="grid skill-grid">
              {SKILLS.filter((skill) => skill.category === category.id).map((skill) => (
                <SkillCard key={skill.slug} skill={skill} />
              ))}
            </div>
          </section>
        ))}

        <div className="section-heading" id="pick">
          <h2>Which one should I pick?</h2>
          <span className="eyebrow">{"// by the job"}</span>
        </div>
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

        <h2 id="faq">FAQ</h2>
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
