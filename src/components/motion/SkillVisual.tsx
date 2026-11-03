import Image from "next/image";
import type { Skill } from "@/lib/motion-skills";

export default function SkillVisual({ skill, frame = "card" }: { skill: Skill; frame?: "card" | "detail" }) {
  if (!skill.image) {
    return (
      <div className={`skill-visual skill-visual-empty cat-${skill.category}`}>
        <span>{skill.style}</span>
        <strong>{skill.name}</strong>
      </div>
    );
  }
  return (
    <figure className={`skill-visual cat-${skill.category}${frame === "detail" ? " is-detail" : ""}`}>
      <Image
        src={skill.image.src}
        alt={skill.image.alt}
        width={skill.image.width}
        height={skill.image.height}
        loading="eager"
        sizes={frame === "detail" ? "(max-width: 900px) 100vw, 860px" : "(max-width: 700px) 100vw, 420px"}
        style={{ objectPosition: skill.image.focus ?? "center" }}
      />
      {frame === "detail" ? <figcaption>{skill.image.credit}</figcaption> : null}
    </figure>
  );
}
