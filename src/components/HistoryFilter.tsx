"use client";

import { useState } from "react";

const OPTIONS = [
  ["all", "All"],
  ["claude", "Claude"],
  ["codex", "Codex"],
  ["banked", "Banked"],
] as const;

export default function HistoryFilter({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<string>("all");
  return (
    <>
      <div className="hist-filter" role="group" aria-label="Filter resets">
        {OPTIONS.map(([id, label]) => (
          <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
        ))}
      </div>
      <div className="hist" data-filter={filter}>{children}</div>
    </>
  );
}
