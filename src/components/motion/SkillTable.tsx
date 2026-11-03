"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, skillPath, type CategoryId, type SkillRow } from "@/lib/motion-skills";

const COLS = [
  ["name", "Name"],
  ["style", "Style"],
  ["cost", "Free vs paid"],
  ["voice", "Voice"],
  ["os", "OS"],
  ["license", "Licence"],
] as const;

type Key = (typeof COLS)[number][0];

export default function SkillTable({ rows }: { rows: SkillRow[] }) {
  const [filter, setFilter] = useState<CategoryId | "all">("all");
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 } | null>(null);

  let view = rows.filter((row) => filter === "all" || row.category === filter);
  if (sort) {
    const { key, dir } = sort;
    view = view.slice().sort((a, b) => a[key].localeCompare(b[key], "en", { sensitivity: "base" }) * dir || a.name.localeCompare(b.name));
  }

  function toggle(key: Key) {
    setSort((current) => {
      if (current?.key !== key) return { key, dir: 1 };
      if (current.dir === 1) return { key, dir: -1 };
      return null;
    });
  }

  return (
    <div>
      <div className="hist-filter" role="group" aria-label="Filter by style">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All {rows.length}
        </button>
        {CATEGORIES.map((category) => (
          <button key={category.id} type="button" aria-pressed={filter === category.id} onClick={() => setFilter(category.id)}>
            {category.title}
          </button>
        ))}
      </div>
      <p className="swipe-hint checked">Swipe the table sideways on a small screen.</p>
      <div className="table-wrap">
      <div className="table-scroll">
        <table className="cmp">
          <caption className="sr-only">Free Claude Code skills for motion graphics and reels</caption>
          <thead>
            <tr>
              {COLS.map(([key, label]) => {
                const active = sort?.key === key;
                const ariaSort = active ? (sort.dir === 1 ? "ascending" : "descending") : "none";
                return (
                  <th key={key} aria-sort={ariaSort} scope="col">
                    <button type="button" onClick={() => toggle(key)}>
                      {label}
                      {active ? (sort.dir === 1 ? " ↑" : " ↓") : ""}
                    </button>
                  </th>
                );
              })}
              <th scope="col">Link</th>
            </tr>
          </thead>
          <tbody>
            {view.map((row) => (
              <tr key={row.slug}>
                <th scope="row">
                  <Link href={skillPath(row.slug)}>{row.name}</Link>
                </th>
                <td>{row.style}</td>
                <td>{row.cost}</td>
                <td>{row.voice}</td>
                <td>{row.os}</td>
                <td>{row.license}</td>
                <td>
                  <a href={row.url} target="_blank" rel="noopener">
                    {row.linkLabel}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
