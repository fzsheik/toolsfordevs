"use client";

import { useEffect, useId, useState } from "react";

type Item = { id: string; label: string; short: string };

function Links({ items, active, onPick, className, compact }: { items: Item[]; active: string; onPick: (id: string) => void; className?: string; compact?: boolean }) {
  return (
    <ul className={className}>
      {items.map((item) => {
        const on = item.id === active;
        return (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={on ? "location" : undefined} className={on ? "is-current" : undefined} onClick={() => onPick(item.id)}>
              {compact ? item.short : item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Desktop sticky contents, or the compact sticky disclosure used inside the article on small screens. */
export default function SectionNav({ items, variant }: { items: Item[]; variant: "desktop" | "mobile" }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const labelId = useId();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 180;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  if (variant === "mobile") {
    return (
      <div className="gdev-toc-mobile">
        <details open>
          <summary>On this page</summary>
          <nav aria-label="On this page">
            <Links items={items} active={active} onPick={setActive} className="gdev-toc-row" compact />
          </nav>
        </details>
      </div>
    );
  }

  return (
    <nav className="skill-browse-desktop" aria-labelledby={labelId}>
      <p className="eyebrow" id={labelId}>
        {"// on this page"}
      </p>
      <div className="browse-groups">
        <Links items={items} active={active} onPick={setActive} />
      </div>
    </nav>
  );
}
