import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import SectionNav from "@/components/game-dev/SectionNav";
import JsonLd from "@/components/JsonLd";
import {
  CHECKED,
  CHECKED_LABEL,
  DESCRIPTION,
  EXTRAS,
  FAQS,
  META_TITLE,
  NAV,
  PATH,
  PICKS,
  TITLE,
  TOOLS,
  type Tool,
} from "@/lib/game-dev";
import { SITE } from "@/lib/site";

const PAGE_TITLE = `${META_TITLE} | ${SITE.name}`;

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: PAGE_TITLE,
    description: DESCRIPTION,
    url: PATH,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: DESCRIPTION },
};

function Out({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener">
      {children}
    </a>
  );
}

function Kind({ tool }: { tool: Tool }) {
  return (
    <span className="gdev-kinds">
      <span className={tool.maintainer === "Official" ? "badge ok" : "badge"}>{tool.maintainer}</span>
      {tool.badge === "Deprecated" ? <span className="badge warn">Deprecated</span> : null}
      {tool.badge === "Experimental" ? <span className="badge pay">Experimental</span> : null}
    </span>
  );
}

function ToolCards() {
  return (
    <div className="gdev-cards">
      {TOOLS.map((tool) => (
        <article key={tool.id} className="card gdev-card">
          <Kind tool={tool} />
          <h3>{tool.name}</h3>
          <p className="muted">
            {tool.engine} · {tool.interfaceLabel}
          </p>
          <dl>
            <dt>Version</dt>
            <dd>{tool.floor}</dd>
            <dt>Clients named</dt>
            <dd>{tool.clients}</dd>
          </dl>
          <p>{tool.fact}</p>
          <p className="checked">
            Checked <time dateTime={CHECKED}>{CHECKED_LABEL}</time>.{" "}
            <Out href={tool.href}>{tool.sourceLabel}</Out>
          </p>
        </article>
      ))}
    </div>
  );
}

function ToolTable() {
  return (
    <div className="gdev-table">
      <table className="gdev">
        <caption>
          Checked <time dateTime={CHECKED}>{CHECKED_LABEL}</time>. Client names are the ones that source uses.
        </caption>
        <thead>
          <tr>
            <th scope="col">Tool</th>
            <th scope="col">Engine</th>
            <th scope="col">Type</th>
            <th scope="col">Interface</th>
            <th scope="col">Clients named</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          {TOOLS.map((tool) => (
            <tr key={tool.id}>
              <th scope="row">
                {tool.name}
                <span className="gdev-floor">{tool.floor}</span>
                <span className="gdev-floor">{tool.fact}</span>
              </th>
              <td>{tool.engine}</td>
              <td>
                <Kind tool={tool} />
              </td>
              <td>{tool.interfaceLabel}</td>
              <td>{tool.clients}</td>
              <td>
                <Out href={tool.href}>{tool.sourceLabel}</Out>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function faq(id: string) {
  const item = FAQS.find((entry) => entry.id === id);
  if (!item) throw new Error(`Missing FAQ ${id}`);
  return item;
}

const answer = faq("answer");
const unity = faq("unity");
const unreal = faq("unreal");
const godot = faq("godot");
const elsewhere = faq("elsewhere");

export default function Page() {
  const pageUrl = `${SITE.url}${PATH}`;
  const faqEntities = [answer, ...PICKS.map((pick) => ({ q: pick.q, a: pick.a })), unity, unreal, godot, elsewhere];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: TITLE,
              description: DESCRIPTION,
              url: pageUrl,
              dateModified: CHECKED,
              inLanguage: "en",
              isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
              author: { "@type": "Organization", name: SITE.name, url: SITE.url },
            },
            {
              "@type": "ItemList",
              name: TITLE,
              itemListOrder: "https://schema.org/ItemListOrderAscending",
              numberOfItems: TOOLS.length,
              itemListElement: TOOLS.map((tool, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "SoftwareApplication",
                  name: tool.name,
                  description: tool.fact,
                  url: tool.href,
                  applicationCategory: "DeveloperApplication",
                  isAccessibleForFree: tool.free,
                  license: tool.license,
                },
              })),
            },
            {
              "@type": "FAQPage",
              mainEntity: faqEntities.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
                { "@type": "ListItem", position: 2, name: TITLE, item: pageUrl },
              ],
            },
          ],
        }}
      />
      <div className="skill-shell gdev-page">
        <SectionNav items={NAV} variant="desktop" />
        <article className="skills-page">
          <p className="eyebrow">{"// unity --godot --unreal"}</p>
          <h1>{TITLE}</h1>
          <p className="intro-copy">
            Official and community ways to connect an agent to Unity, Godot, or Unreal. Version floors and client names come from the linked source. This page did not install the tools, and it has no setup steps.
          </p>
          <p className="checked">
            Last checked <time dateTime={CHECKED}>{CHECKED_LABEL}</time>. {TOOLS.length} tools.
          </p>
          <SectionNav items={NAV} variant="mobile" />

          <section id="answer" aria-labelledby="answer-title">
            <div className="card tldr">
              <div className="titlebar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>answer.txt</span>
              </div>
              <div className="tldr-body">
                <h2 id="answer-title">{answer.q}</h2>
                <p>{answer.a}</p>
              </div>
            </div>
            <div className="pick-grid">
              {PICKS.map((pick) => (
                <article key={pick.engine} className="card pick-card">
                  <p className="eyebrow">{pick.engine}</p>
                  <h3>{pick.q}</h3>
                  <p>{pick.a}</p>
                  <p className="skill-links">
                    <a href={pick.href}>Read the {pick.engine} section</a>
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="tools" aria-labelledby="tools-title">
            <div className="section-heading">
              <h2 id="tools-title">Which tools were checked?</h2>
              <span className="eyebrow">{"// maintainer-stated"}</span>
            </div>
            <p>
              Ten tools. Official means the engine maker publishes it. A client appears only when that source names it. The same rows are a table on a wide screen and cards on a phone.
            </p>
            <ToolTable />
            <ToolCards />
            <p>
              Auth is per tool. Epic&apos;s server has none. IvanMurzak&apos;s README defaults client auth to none and also offers oauth and token. Godot AI and EngineWire document local authentication. A localhost port is not a sandbox, and this page did not audit any of them.
            </p>
          </section>

          <section id="unity" aria-labelledby="unity-title">
            <div className="section-heading">
              <h2 id="unity-title">{unity.q}</h2>
            </div>
            <p>{unity.a}</p>
            <ol>
              <li>
                Shell on Unity 6.0 LTS or newer: <code>unity command</code> or <code>unity eval</code>. The docs say these are faster and use fewer tokens than MCP, and they publish no numbers for that claim.
              </li>
              <li>
                MCP mode: <code>unity mcp</code> in the Unity CLI stays supported, including for an agent that cannot run a shell. The docs&apos; examples are claude, cursor, vscode, and windsurf. <code>unity mcp configure --list</code> is how that page says to see the full client list.
              </li>
              <li>Older than that editor floor, or you want a GitHub package: MCP for Unity states 2021.3 LTS through 6.x. IvanMurzak Unity MCP states an editor plus a compiled game, and does not state a version number.</li>
            </ol>
            <p>
              The CLI can still install and manage other editor versions, run headless builds, and run tests. Driving a running editor through the Pipeline package needs Unity 6.0 LTS or later. The CLI is free and separate from a Unity AI subscription. Assistant package 2.13 or later is what the docs say fixes a conflict with the CLI.
            </p>
            <p>
              Unity also publishes an official skills plugin for coding agents. It is the{" "}
              <Out href="https://github.com/Unity-Technologies/unity-agent-plugin">Unity agent plugin</Out>, under the{" "}
              <Out href="https://unity.com/legal/licenses/unity-companion-license">Unity Companion License</Out>, and it is not an MCP server. On {CHECKED_LABEL} the main-branch plugin.json version was 0.1.9-beta, with Claude and Codex plugin manifests.
            </p>
            <p>
              A <Out href="https://discussions.unity.com/t/how-to-get-mcp-server-back/1732606">Unity Discussions thread</Out> records the same mix-up: someone cancelled an AI Assistant subscription and thought the local server had been paywalled.
            </p>
          </section>

          <section id="unreal" aria-labelledby="unreal-title">
            <div className="section-heading">
              <h2 id="unreal-title">{unreal.q}</h2>
            </div>
            <p>{unreal.a}</p>
            <p>
              Epic&apos;s page says to learn the feature with caution when shipping. Auto-start is on by default and binds <code>http://127.0.0.1:8000/mcp</code>. The server has no authentication layer, so the docs say to keep it on the local machine. That warning is about Epic&apos;s plugin. EngineWire&apos;s README says its own bridge is token-protected by default.
            </p>
            <p>
              Codex gets a write-once file. If <code>.codex/config.toml</code> already exists, Epic&apos;s generator logs an error instead of merging, and the <code>unreal-mcp</code> entry has to be edited by hand. JSON configs for Claude Code, Cursor, VS Code, and Gemini are merged. The docs also name an in-editor Unreal Assistant panel for Claude Code, Codex, Cursor, and OpenCode.
            </p>
            <p>
              A <Out href="https://forums.unrealengine.com/t/unreal-mcp-codex-issue-analysis-report/2730883">June 23, 2026 Epic Developer Community report</Out> describes Codex connecting before every toolset is registered, some handshake timeouts, and Blueprint tool failures returned as successful text. This page did not reproduce that report, and it did not test an engine binary. VibeUE is the expansion path on 5.8 or newer. EngineWire is the community bridge whose README claims 5.0 through 5.8.
            </p>
          </section>

          <section id="godot" aria-labelledby="godot-title">
            <div className="section-heading">
              <h2 id="godot-title">{godot.q}</h2>
            </div>
            <p>{godot.a}</p>
            <p>
              Godot AI&apos;s README requires Godot 4.7 or newer and names Claude Code, Codex, and Cursor. Connections are authenticated: local HTTP for the Python server, and a WebSocket to the editor plugin. v4 clients use a stdio attach command. The README says a bare <code>http://127.0.0.1:8000/mcp</code> entry cannot authenticate.
            </p>
            <p>
              Godot MCP (Coding-Solo) documents Claude Code and Cursor. Its README says Cursor runs the tools from the Agent chat profile on Cursor Pro or Business. The last GitHub push was April 16, 2026. The repo still publishes an MIT license and those client notes.
            </p>
            <p>
              The <Out href="https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html">Godot command-line tutorial</Out> on the current stable docs (Godot 4.7) defines <code>--headless</code> as headless mode and <code>--check-only</code> as parse one script for errors and quit, used with <code>--script</code>. Install steps stay on that page and on the two READMEs.
            </p>
          </section>

          <section id="elsewhere" aria-labelledby="elsewhere-title">
            <div className="section-heading">
              <h2 id="elsewhere-title">{elsewhere.q}</h2>
            </div>
            <p>{elsewhere.a}</p>
            <p>
              <Out href="https://github.com/ahujasid/mcp-for-blender">mcp-for-blender</Out> names Claude Desktop, Claude Code, Codex, and Cursor. The Roblox directory is{" "}
              <Out href="https://gamedevtool.com/ai-tools-for-roblox-studio">AI tools for Roblox Studio</Out> on gamedevtool.com.
            </p>
          </section>

          <section id="sources" aria-labelledby="sources-title">
            <div className="section-heading">
              <h2 id="sources-title">Which primary sources were checked?</h2>
              <span className="eyebrow">{"// " + CHECKED_LABEL}</span>
            </div>
            <p>Every tool row links its doc or README. These are the same URLs, plus the notes that are not a tool row.</p>
            <ul>
              {TOOLS.map((tool) => (
                <li key={tool.id}>
                  <Out href={tool.href}>
                    {tool.name}: {tool.sourceLabel}
                  </Out>
                </li>
              ))}
              {EXTRAS.map((extra) => (
                <li key={extra.href}>
                  <Out href={extra.href}>{extra.label}</Out>. {extra.note}
                </li>
              ))}
            </ul>
            <p>Not affiliated with Unity Technologies, Epic Games, or the Godot project.</p>
          </section>

          <p className="history-link">
            <Link href="/">
              Back to toolsfordevs <span aria-hidden="true">→</span>
            </Link>
          </p>
        </article>
      </div>
    </>
  );
}
