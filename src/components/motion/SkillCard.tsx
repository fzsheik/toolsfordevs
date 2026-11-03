import Link from "next/link";
import type { Skill } from "@/lib/motion-skills";
import { skillPath } from "@/lib/motion-skills";
import CopyCommand from "./CopyCommand";
import SkillVisual from "./SkillVisual";

export default function SkillCard({ skill }: { skill: Skill }) {
  const install = skill.installs[0];
  return (
    <article className={`card skill-card cat-${skill.category}`} id={skill.slug}>
      <div className="titlebar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{skill.slug}.skill</span>
      </div>
      <SkillVisual skill={skill} />
      <div className="skill-body">
        <div className="skill-meta">
          {skill.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          <span className={skill.badgeOk ? "badge ok" : "badge pay"}>{skill.badge}</span>
        </div>
        <h3>
          <Link href={skillPath(skill.slug)}>{skill.name}</Link>
        </h3>
        <p>{skill.summary}</p>
        <CopyCommand command={install.command} label={install.label} />
        <p className="skill-links">
          <Link href={skillPath(skill.slug)}>
            Details <span aria-hidden="true">→</span>
          </Link>
          <a href={skill.url} target="_blank" rel="noopener">
            {skill.linkLabel} <span aria-hidden="true">↗</span>
          </a>
        </p>
      </div>
    </article>
  );
}
