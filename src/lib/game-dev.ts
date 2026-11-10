/**
 * Facts checked November 9, 2026 against the linked primary page.
 * Version floors and client names are maintainer-stated. Nothing here was installed.
 */

import { SITE } from "./site";

export const PATH = "/game-dev";
export const NAV_LABEL = "Game dev";
export const CHECKED = "2026-11-09";
export const CHECKED_LABEL = "November 9, 2026";
export const TITLE = "AI tools for Unity, Godot, and Unreal";
export const META_TITLE = "Unity, Godot, Unreal: MCP vs CLI";
export const DESCRIPTION =
  "Official and community AI paths for Unity, Godot, and Unreal: MCP or CLI, who publishes it, and the engine version each source states. Checked November 9, 2026.";

export const NAV: { id: string; label: string; short: string }[] = [
  { id: "answer", label: "Quick answer", short: "Answer" },
  { id: "tools", label: "Directory", short: "Tools" },
  { id: "unity", label: "Unity", short: "Unity" },
  { id: "unreal", label: "Unreal", short: "Unreal" },
  { id: "godot", label: "Godot", short: "Godot" },
  { id: "elsewhere", label: "Blender and Roblox", short: "Also" },
  { id: "sources", label: "Sources", short: "Sources" },
];

export type Engine = "Unity" | "Unreal" | "Godot";

export type Tool = {
  id: string;
  name: string;
  engine: Engine;
  maintainer: "Official" | "Community";
  badge?: "Deprecated" | "Experimental";
  interfaceLabel: string;
  clients: string;
  floor: string;
  fact: string;
  href: string;
  sourceLabel: string;
  /** Set only when the linked source says the tool is free or the repo license is MIT or Apache-2.0. */
  free?: boolean;
  license?: string;
};

export const TOOLS: Tool[] = [
  {
    id: "unity-cli",
    name: "Unity CLI",
    engine: "Unity",
    maintainer: "Official",
    interfaceLabel: "CLI, optional MCP",
    clients: "Claude, Cursor, VS Code, Windsurf (docs examples)",
    floor: "Any editor to install, build, and test. Unity 6.0 LTS+ to drive a running editor.",
    fact: "Free, and separate from a Unity AI subscription. unity command and unity eval are the shell path; unity mcp stays supported. The pipeline server accepts localhost only.",
    href: "https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli",
    sourceLabel: "Unity CLI docs",
    free: true,
  },
  {
    id: "unity-assistant-mcp",
    name: "Assistant package MCP",
    engine: "Unity",
    maintainer: "Official",
    badge: "Deprecated",
    interfaceLabel: "MCP",
    clients: "Not stated on the replacement page",
    floor: "In-editor server inside com.unity.ai.assistant.",
    fact: "Deprecated. The replacement page says package 2.13 or later fixes a conflict with the Unity CLI. Third-party GitHub MCP packages are unaffected.",
    href: "https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli",
    sourceLabel: "Unity deprecation docs",
  },
  {
    id: "coplay-unity-mcp",
    name: "MCP for Unity",
    engine: "Unity",
    maintainer: "Community",
    interfaceLabel: "MCP",
    clients: "Claude Code, Codex, Cursor",
    floor: "Unity 2021.3 LTS through 6.x. Python 3.10+ via uv.",
    fact: "README: scenes, assets, scripts, and tests. Also names Claude Desktop, VS Code, Windsurf, Cline, and Gemini CLI. MIT.",
    href: "https://github.com/CoplayDev/unity-mcp",
    sourceLabel: "CoplayDev/unity-mcp",
    free: true,
    license: "MIT",
  },
  {
    id: "ivanmurzak-unity-mcp",
    name: "IvanMurzak Unity MCP",
    engine: "Unity",
    maintainer: "Community",
    interfaceLabel: "MCP",
    clients: "Claude Code, Cursor",
    floor: "README does not give a Unity version number. Editor and a compiled game.",
    fact: "Apache-2.0. Client auth can be none, oauth, or token, and the README default is none. The README shows a Codex logo and names Claude Code and Cursor in the setup text. The repo description also names Gemini and Copilot.",
    href: "https://github.com/IvanMurzak/Unity-MCP",
    sourceLabel: "IvanMurzak/Unity-MCP",
    free: true,
    license: "Apache-2.0",
  },
  {
    id: "unreal-mcp",
    name: "Unreal MCP",
    engine: "Unreal",
    maintainer: "Official",
    badge: "Experimental",
    interfaceLabel: "MCP",
    clients: "Claude Code, Codex, Cursor",
    floor: "Experimental in recent UE5 releases. Docs title says 5.9. Treat 5.7 and earlier as outside this page.",
    fact: "HTTP and SSE only, default http://127.0.0.1:8000/mcp, auto-start on, no authentication. The docs say stdio and WebSocket are unsupported.",
    href: "https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor",
    sourceLabel: "Epic Unreal MCP docs",
  },
  {
    id: "vibeue",
    name: "VibeUE",
    engine: "Unreal",
    maintainer: "Community",
    interfaceLabel: "MCP add-on",
    clients: "Claude Code, Cursor, Copilot, Codex",
    floor: "Unreal Engine 5.8 or newer. Requires Epic’s Unreal MCP.",
    fact: "MIT tools registered on Epic’s server. The README says a free API key unlocks terrain tools and the other tools work without one.",
    href: "https://github.com/kevinpbuckley/VibeUE",
    sourceLabel: "kevinpbuckley/VibeUE",
    free: true,
    license: "MIT",
  },
  {
    id: "enginewire",
    name: "EngineWire",
    engine: "Unreal",
    maintainer: "Community",
    interfaceLabel: "MCP",
    clients: "Claude, Cursor, VS Code",
    floor: "README claims Unreal Engine 5.0 through 5.8.",
    fact: "MIT. Local and token-protected by default, over HTTP or stdio. Prebuilt binaries must match the engine minor and platform. Also listed on Fab; price not checked.",
    href: "https://github.com/ChiR24/Unreal_mcp",
    sourceLabel: "ChiR24/Unreal_mcp",
    free: true,
    license: "MIT",
  },
  {
    id: "godot-ai",
    name: "Godot AI",
    engine: "Godot",
    maintainer: "Community",
    interfaceLabel: "MCP",
    clients: "Claude Code, Codex, Cursor",
    floor: "Godot 4.7 or newer. uv and Python.",
    fact: "MIT editor server. Authenticated local HTTP, plus an authenticated WebSocket to the editor plugin. v4 clients attach over stdio; a bare localhost URL cannot authenticate.",
    href: "https://github.com/hi-godot/godot-ai",
    sourceLabel: "hi-godot/godot-ai",
    free: true,
    license: "MIT",
  },
  {
    id: "coding-solo-godot-mcp",
    name: "Godot MCP",
    engine: "Godot",
    maintainer: "Community",
    interfaceLabel: "MCP",
    clients: "Claude Code, Cursor",
    floor: "UID tools for Godot 4.4 or newer. No engine-wide minimum in the README. Node.js 18+.",
    fact: "MIT. Launches the editor, runs the project, and reads debug output, plus basic scene and node edits. Last GitHub push was April 16, 2026.",
    href: "https://github.com/Coding-Solo/godot-mcp",
    sourceLabel: "Coding-Solo/godot-mcp",
    free: true,
    license: "MIT",
  },
  {
    id: "godot-cli",
    name: "Godot CLI",
    engine: "Godot",
    maintainer: "Official",
    interfaceLabel: "CLI",
    clients: "Any agent with a shell",
    floor: "Documented on the current stable command-line page (Godot 4.7).",
    fact: "--headless runs without a display. --check-only parses one script for errors and quits, and the docs say to use it with --script.",
    href: "https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html",
    sourceLabel: "Godot command line docs",
  },
];

export const PICKS: { engine: Engine; href: string; q: string; a: string }[] = [
  {
    engine: "Unity",
    href: "#unity",
    q: "What should I use for Unity?",
    a: "On Unity 6.0 LTS or newer, with an agent that can run a shell, Unity’s docs say to use unity command or unity eval. The unity mcp command in the Unity CLI remains supported. The in-editor MCP server in com.unity.ai.assistant is deprecated.",
  },
  {
    engine: "Unreal",
    href: "#unreal",
    q: "What should I use for Unreal?",
    a: "Epic’s Unreal MCP is experimental in recent UE5 releases: localhost HTTP and SSE, no authentication, and the docs say stdio and WebSocket are unsupported. The public docs page is titled Unreal Engine 5.9. VibeUE’s README says the built-in server arrived in Unreal Engine 5.8.",
  },
  {
    engine: "Godot",
    href: "#godot",
    q: "What should I use for Godot?",
    a: "On Godot 4.7 or newer, Godot AI is the README’s live-editor path. Coding-Solo/godot-mcp covers launch, run, and debug output; its README states UID tools for Godot 4.4 or newer and gives no engine-wide minimum. A headless script check can use the Godot CLI and skip MCP.",
  },
];

export const FAQS: { id: string; q: string; a: string }[] = [
  {
    id: "answer",
    q: "Which path should I pick?",
    a: "Use the official tool when your engine version sits in the range that source states. Use a community server when you need a version or a job outside that range. On Unity and Godot, a shell can be enough: Unity’s CLI, or Godot’s own binary. Unreal’s official path is the experimental MCP server.",
  },
  {
    id: "unity",
    q: "What are the three things called Unity MCP?",
    a: "Unity MCP is three tools. The deprecated one is the MCP server inside com.unity.ai.assistant. The supported official one is the Unity CLI, including unity mcp. The third group is community MCP servers on GitHub, which Unity’s replacement page says are unaffected.",
  },
  {
    id: "unreal",
    q: "Which Unreal server matches the engine version?",
    a: "On a recent UE5 editor, Epic’s experimental Unreal MCP is the official server, and the docs page is titled Unreal Engine 5.9. VibeUE’s README says that built-in server arrived in 5.8 and that VibeUE itself requires 5.8 or newer. EngineWire’s README claims a separate bridge for Unreal Engine 5.0 through 5.8.",
  },
  {
    id: "godot",
    q: "When is Godot’s CLI enough?",
    a: "Use the Godot binary when the job is a headless run or a one-script error check. Use an MCP server when the agent should open the editor or edit a live scene. Godot AI states Godot 4.7 or newer. Coding-Solo’s only stated engine floor is Godot 4.4 or newer, for UID tools.",
  },
  {
    id: "elsewhere",
    q: "Where do Blender and Roblox fit?",
    a: "Blender is an asset tool, not one of these three editor bridges. mcp-for-blender is a community MIT addon; the README calls it a third-party integration and says it is not made by the Blender Foundation. Roblox Studio is out of scope here and is listed on gamedevtool.com.",
  },
];

export const EXTRAS: { label: string; href: string; note: string }[] = [
  {
    label: "Unity agent skills plugin",
    href: "https://github.com/Unity-Technologies/unity-agent-plugin",
    note: "Official skills for coding agents. Unity Companion License. Not an MCP server. plugin.json on main said 0.1.9-beta, with Claude and Codex plugin manifests.",
  },
  {
    label: "Unity Companion License",
    href: "https://unity.com/legal/licenses/unity-companion-license",
    note: "License named by the agent skills plugin.",
  },
  {
    label: "Unity Discussions: how to get the MCP server back",
    href: "https://discussions.unity.com/t/how-to-get-mcp-server-back/1732606",
    note: "A poster cancelled an AI Assistant subscription and thought the local MCP server was paywalled.",
  },
  {
    label: "Epic Developer Community: Unreal MCP and Codex",
    href: "https://forums.unrealengine.com/t/unreal-mcp-codex-issue-analysis-report/2730883",
    note: "June 23, 2026 field report: Codex can connect before toolsets finish registering, some handshakes time out, and some Blueprint tool failures come back as successful text.",
  },
  {
    label: "mcp-for-blender",
    href: "https://github.com/ahujasid/mcp-for-blender",
    note: "Community Blender addon, MIT. Formerly blender-mcp. README names Claude Desktop, Claude Code, Codex, and Cursor.",
  },
  {
    label: "AI tools for Roblox Studio",
    href: "https://gamedevtool.com/ai-tools-for-roblox-studio",
    note: "Roblox is out of scope on toolsfordevs. This link leaves the site.",
  },
];

export function toolsFor(engine: Engine) {
  return TOOLS.filter((tool) => tool.engine === engine);
}

/** Plain-text block for the llms.txt companion. Matches the HTML facts. */
export function plainTextLines() {
  const lines = [
    `# ${TITLE}`,
    "",
    DESCRIPTION,
    "",
    `Page: ${SITE.url}${PATH}`,
    `Last checked: ${CHECKED_LABEL}. Tools were not installed for this page.`,
    "",
    "## Answers",
    "",
  ];
  for (const item of FAQS) lines.push(item.q, "", item.a, "");
  lines.push("## Quick picks", "");
  for (const pick of PICKS) lines.push(pick.q, "", pick.a, "");
  lines.push("## Tools", "");
  for (const tool of TOOLS) {
    lines.push(
      `### ${tool.name}`,
      "",
      `${tool.engine}. ${tool.maintainer}${tool.badge ? `, ${tool.badge}` : ""}. ${tool.interfaceLabel}.`,
      `Version: ${tool.floor}`,
      `Clients named by the source: ${tool.clients}`,
      tool.license ? `License: ${tool.license}.` : "",
      tool.fact,
      `Source: ${tool.href}`,
      `Checked: ${CHECKED_LABEL}`,
      "",
    );
  }
  lines.push("## Other sources", "");
  for (const extra of EXTRAS) lines.push(`- ${extra.label}: ${extra.href}. ${extra.note}`);
  lines.push("", "Not affiliated with Unity Technologies, Epic Games, or the Godot project.");
  return lines;
}
