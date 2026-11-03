import Image from "next/image";
import type { Skill } from "@/lib/motion-skills";

const CARD_LIMIT = 4;

export default function SkillVisual({ skill, frame = "card" }: { skill: Skill; frame?: "card" | "detail" }) {
  if (!skill.shots.length) {
    return (
      <div className={`skill-visual skill-visual-empty cat-${skill.category}`}>
        <span>{skill.style}</span>
        <strong>{skill.name}</strong>
      </div>
    );
  }

  if (frame === "card") {
    const shown = skill.shots.slice(0, CARD_LIMIT);
    return (
      <div className="shot-strip" data-n={shown.length}>
        {shown.map((shot) => (
          <Image
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            loading="lazy"
            sizes="(max-width: 560px) 46vw, 120px"
            className="shot-thumb"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="shot-gallery">
      {skill.shots.map((shot, index) => (
        <figure key={shot.src}>
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="(max-width: 700px) 92vw, 280px"
            className="shot-full"
          />
        </figure>
      ))}
      {skill.shotsCredit ? <p className="checked shot-credit">{skill.shotsCredit}</p> : null}
    </div>
  );
}
