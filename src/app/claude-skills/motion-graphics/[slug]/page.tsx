import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import CopyCommand from "@/components/motion/CopyCommand";
import SkillVisual from "@/components/motion/SkillVisual";
import { INDEX_PATH, INDEX_TITLE, SKILLS, UPDATED, UPDATED_LABEL, categoryLabel, getSkill, skillPath } from "@/lib/motion-skills";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return SKILLS.map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) return { title: "Skill" };
  const path = skillPath(skill.slug);
  return {
    title: { absolute: skill.metaTitle },
    description: skill.metaDescription,
    alternates: { canonical: path },
    openGraph: { title: skill.metaTitle, description: skill.metaDescription, url: path, type: "article" },
    twitter: { card: "summary_large_image", title: skill.metaTitle, description: skill.metaDescription },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();
  const path = skillPath(skill.slug);
  const pageUrl = `${SITE.url}${path}`;
  const related = SKILLS.filter((item) => item.category === skill.category && item.slug !== skill.slug).slice(0, 3);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
            { "@type": "ListItem", position: 2, name: "Motion graphics skills", item: `${SITE.url}${INDEX_PATH}` },
            { "@type": "ListItem", position: 3, name: skill.name, item: pageUrl },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: skill.metaTitle,
          description: skill.metaDescription,
          dateModified: UPDATED,
          mainEntityOfPage: pageUrl,
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` } },
          isBasedOn: skill.url,
          about: skill.style,
        }}
      />
      <article className={`skills-page skill-detail cat-${skill.category}`}>
        <p className="eyebrow">
          <Link href={INDEX_PATH}>{INDEX_TITLE.replace(" (2026)", "")}</Link>
          {" / "}
          {categoryLabel(skill.category)}
        </p>
        <h1>{skill.name}</h1>
        <p className="intro-copy">{skill.summary}</p>
        <div className="skill-meta">
          {skill.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          <span className={skill.badgeOk ? "badge ok" : "badge pay"}>{skill.badge}</span>
        </div>
        <p className="checked">
          Last updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>. Checked against the {skill.linkLabel === "GitHub" ? "README" : "format page"}.
        </p>
        {skill.shots.length ? (
          <SkillVisual skill={skill} frame="detail" />
        ) : (
          <div className="card skill-frame">
            <div className="titlebar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>{skill.slug}</span>
            </div>
            <SkillVisual skill={skill} frame="detail" />
          </div>
        )}

        <h2>What it makes</h2>
        <ul>
          {skill.makes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>Install</h2>
        {skill.installs.map((install) => (
          <div key={install.label} className="install-block">
            <CopyCommand command={install.command} label={install.label} />
            {install.note ? <p className="checked">{install.note}</p> : null}
          </div>
        ))}

        <h2>What it needs</h2>
        <ul>
          {skill.needs.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>Gotchas</h2>
        <ul>
          {skill.gotchas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>At a glance</h2>
        <dl className="glance">
          <div>
            <dt>Style</dt>
            <dd>{skill.style}</dd>
          </div>
          <div>
            <dt>Free vs paid</dt>
            <dd>{skill.cost}</dd>
          </div>
          <div>
            <dt>Voice</dt>
            <dd>{skill.voice}</dd>
          </div>
          <div>
            <dt>OS</dt>
            <dd>{skill.os}</dd>
          </div>
          <div>
            <dt>Licence</dt>
            <dd>{skill.license}</dd>
          </div>
        </dl>

        {skill.catalog ? (
          <>
            <h2>{skill.catalog.title}</h2>
            <ul>
              {skill.catalog.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}

        <h2>Links</h2>
        <ul>
          <li>
            <a href={skill.url} target="_blank" rel="noopener">
              {skill.name} on {skill.linkLabel === "GitHub" ? "GitHub" : "the project page"}
            </a>
          </li>
          {skill.files?.map((file) => (
            <li key={file.url}>
              <a href={file.url} target="_blank" rel="noopener">
                {file.label}
              </a>
            </li>
          ))}
        </ul>

        <h2>More in {categoryLabel(skill.category).toLowerCase()}</h2>
        <ul>
          {related.map((item) => (
            <li key={item.slug}>
              <Link href={skillPath(item.slug)}>{item.name}</Link>. {item.summary}
            </li>
          ))}
        </ul>
        <p className="history-link">
          <Link href={INDEX_PATH}>
            All motion graphics skills <span aria-hidden="true">→</span>
          </Link>
        </p>
      </article>
    </>
  );
}
