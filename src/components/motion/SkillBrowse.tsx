import { BROWSE_GROUPS, getSkill, skillPath } from "@/lib/motion-skills";

function BrowseList({ current }: { current: string }) {
  return (
    <div className="browse-groups">
      {BROWSE_GROUPS.map((group) => (
        <div key={group.id}>
          <p className="eyebrow">{group.title}</p>
          <ul>
            {group.slugs.map((slug) => {
              const skill = getSkill(slug);
              if (!skill) return null;
              const on = slug === current;
              return (
                <li key={slug}>
                  <a href={skillPath(slug)} aria-current={on ? "page" : undefined} className={on ? "is-current" : undefined}>
                    {skill.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Desktop sticky nav plus a mobile details drawer. Both are plain anchors in the HTML. */
export default function SkillBrowse({ current }: { current: string }) {
  return (
    <>
      <nav className="skill-browse-desktop" aria-label="Skills by type">
        <p className="eyebrow">{"// browse by type"}</p>
        <BrowseList current={current} />
      </nav>
      <details className="skill-browse-mobile">
        <summary>Browse skills by type</summary>
        <nav aria-label="Skills by type">
          <BrowseList current={current} />
        </nav>
      </details>
    </>
  );
}
