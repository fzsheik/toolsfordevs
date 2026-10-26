"use client";

import { useCallback, useEffect, useState } from "react";

export type ShotVendor = { id: string; name: string; resetDates: string[] };
type Call = { day: string; madeOn: string };
type Result = { day: string; landed: string; diff: number };
type Saved = { call: Call | null; results: Result[] };

const DAY = 86_400_000;
const WINDOW = 21;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const t = (d: string) => Date.parse(`${d}T00:00:00Z`);
const parts = (d: string) => {
  const [wd, md] = new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short", timeZone: "UTC" }).split(", ");
  const [mon, num] = md.split(" ");
  return { wd, mon, num };
};
const label = (d: string) => {
  const p = parts(d);
  return `${p.wd} ${p.mon} ${p.num}`;
};

const read = (key: string): Saved => {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "null");
    if (v && Array.isArray(v.results)) return v;
  } catch {}
  return { call: null, results: [] };
};
const write = (key: string, v: Saved) => {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
};

function Panel({ v }: { v: ShotVendor }) {
  const key = `shot:${v.id}`;
  const [today, setToday] = useState<string | null>(null);
  const [saved, setSaved] = useState<Saved>({ call: null, results: [] });
  const [crowd, setCrowd] = useState<Record<string, number> | null>(null);

  const loadCrowd = useCallback(async () => {
    try {
      const j = await (await fetch(`/api/shot?vendor=${v.id}`)).json();
      setCrowd(j.enabled ? j.counts : null);
    } catch {
      setCrowd(null);
    }
  }, [v.id]);

  const dates = v.resetDates.join(",");
  useEffect(() => {
    let s = read(key);
    // Settle a pending call against the first reset logged after it was made.
    const landed = dates.split(",").sort().find((d) => s.call && d > s.call.madeOn);
    if (s.call && landed) {
      const r: Result = { day: s.call.day, landed, diff: Math.round(Math.abs(t(landed) - t(s.call.day)) / DAY) };
      s = { call: null, results: [r, ...s.results].slice(0, 20) };
      write(key, s);
    }
    // after mount only: localStorage and "today" don't exist on the server
    const now = iso(Date.now());
    Promise.resolve().then(() => {
      setSaved(s);
      setToday(now);
      loadCrowd();
    });
  }, [key, dates, loadCrowd]);

  if (!today) return <div className="shot-body" />;

  const days = Array.from({ length: WINDOW }, (_, i) => iso(t(today) + (i + 1) * DAY));
  const commit = (next: Saved) => {
    setSaved(next);
    write(key, next);
  };
  const pick = async (day: string) => {
    const prev = saved.call?.day;
    if (prev === day) return;
    commit({ ...saved, call: { day, madeOn: today } });
    try {
      await fetch("/api/shot", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ vendor: v.id, day, prev }) });
    } catch {}
    loadCrowd();
  };
  const last = saved.results[0];
  const hits = saved.results.filter((r) => r.diff === 0).length;
  const total = crowd ? Object.values(crowd).reduce((a, b) => a + b, 0) : 0;
  const top = crowd ? Math.max(1, ...Object.values(crowd)) : 1;
  const favorite = crowd && total > 0 ? Object.entries(crowd).sort((a, b) => b[1] - a[1])[0] : null;

  return (
    <div className="shot-body">
      {last ? (
        <p className={`shot-result ${last.diff === 0 ? "hit" : ""}`}>
          {last.diff === 0
            ? `Nailed it. You called ${label(last.day)} and ${v.name} reset that day.`
            : `Last call: ${label(last.day)}. Reset landed ${label(last.landed)}, ${last.diff} day${last.diff === 1 ? "" : "s"} off.`}
          {saved.results.length > 1 ? ` Record: ${hits}/${saved.results.length} exact.` : ""}
        </p>
      ) : null}
      <p className="shot-hint">
        {saved.call ? <>Locked in: <strong>{label(saved.call.day)}</strong>. Tap another day to change it.</> : `Tap the day you think ${v.name} resets next.`}
        {crowd && total > 0 && favorite ? <> {total} call{total === 1 ? "" : "s"} so far; crowd favorite is <strong>{label(favorite[0])}</strong>.</> : null}
      </p>
      <div className="shot-days" role="group" aria-label={`Pick a day for the next ${v.name} reset`}>
        {days.map((d) => {
          const p = parts(d);
          const n = crowd?.[d] ?? 0;
          return (
            <button key={d} type="button" className={saved.call?.day === d ? "on" : ""} aria-pressed={saved.call?.day === d} onClick={() => pick(d)}>
              <span>{p.wd}</span>
              <b>{p.num}</b>
              <span>{p.mon}</span>
              {crowd ? <i className="shot-bar" aria-label={`${n} calls`} style={{ height: `${Math.max(n ? 4 : 2, (n / top) * 22)}px` }} /> : null}
            </button>
          );
        })}
      </div>
      <p className="shot-note">{crowd ? "Bars = everyone's calls this round. Resets when a new reset lands." : "Your call stays in this browser."}</p>
    </div>
  );
}

/** Guess the day of the next reset. Scored against the real log on your next visit; crowd tally when a store is configured. */
export default function CallYourShot({ vendors }: { vendors: ShotVendor[] }) {
  const [active, setActive] = useState(vendors[0].id);
  const v = vendors.find((x) => x.id === active) ?? vendors[0];
  return (
    <section className={`shot v-${v.id}`} aria-label="Call your shot">
      <div className="shot-head">
        <h2>Call your shot</h2>
        <span className="eyebrow">{"// guess the next reset"}</span>
        {vendors.length > 1 ? (
          <div className="shot-tabs" role="tablist">
            {vendors.map((x) => (
              <button key={x.id} type="button" role="tab" aria-selected={x.id === active} className={`v-${x.id} ${x.id === active ? "on" : ""}`} onClick={() => setActive(x.id)}>
                {x.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <Panel key={v.id} v={v} />
    </section>
  );
}
