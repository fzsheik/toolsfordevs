import type { Metadata } from "next";
import { getEvents, when } from "@/lib/events";
import { VENDORS } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Claude & Codex Limit Changes: Permanent Increases and Policy Updates" },
  description: "Permanent usage limit increases and policy changes for Claude and Codex, kept separate from resets, each with its source post.",
  alternates: { canonical: "/changes" },
};

export default async function Page() {
  const changes = (await getEvents()).filter((e) => e.kind === "policy");
  return (
    <article className="prose">
      <h1>Limit changes log</h1>
      <p>Permanent changes and policy news, separate from resets. Times are UTC.</p>
      {changes.length ? (
        <ul>
          {changes.map((e) => (
            <li key={e.id}>
              <b>{VENDORS[e.vendor].name}</b> · {when(e)}: {e.title}. {e.summary}{" "}
              {e.sources.map((s) => <a key={s.url} href={s.url} rel="nofollow noopener" target="_blank">[{s.label}] </a>)}
            </li>
          ))}
        </ul>
      ) : <p>None logged yet.</p>}
    </article>
  );
}
