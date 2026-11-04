/** Facts below are taken from each project's README or format page on Nov 3, 2026. */

export const UPDATED = "2026-11-03";
export const UPDATED_LABEL = "Nov 3, 2026";
export const INDEX_PATH = "/claude-skills/motion-graphics";
export const INDEX_TITLE = "Best Free Claude Code Skills for Motion Graphics & Reels (2026)";
/** Document title stays near 60 characters. The on-page H1 keeps the full phrase. */
export const INDEX_META_TITLE = "Free Claude Code skills for reels (2026)";
export const INDEX_DESCRIPTION =
  "Free Claude Code skills for reels, paper-cut explainers, 3D films and talking-head edits, with install commands, voice, OS and licence from each README.";

export const TAKEAWAYS = [
  "For a Mac cut-paper explainer with no API keys, paper-reel is the free Claude Code skill: local Kokoro voice, whisper.cpp word timing, and an MP4 rendered on the Mac.",
  "papercut-explainer is the free Remotion kit for layered construction-paper reels, with local Qwen3-TTS, a recording you supply, or a silent placeholder, and the README estimates about $14-19 in Claude API cost per 25-30 second reel at list prices.",
  "Appmorphy Paper, Appmorphy Voxel, and lowpoly-reel narrate with ElevenLabs. Pasteup needs a Gemini API key, and the README says the free tier works.",
  "video-edit-skill turns raw talking-head clips into an Instagram reel on a Mac, a Windows 10/11 PC, or Linux. Herk Edit Kit edits footage you bring in Codex or Claude Code and includes 15 skills and 406 draft motion-graphics cards.",
  "Charlie Hills' Motion Graphics Skill Pack makes launch videos and charts in code, and the README says there is no After Effects and no video generator. Remotion's own agent skills install with npx skills add remotion-dev/skills.",
];

export type CategoryId = "print" | "3d" | "talking" | "motion";

export const CATEGORIES: { id: CategoryId; title: string; question: string; lede: string }[] = [
  {
    id: "print",
    title: "Print and paper",
    question: "Which free Claude Code skills make paper-style reels?",
    lede: "Papercut Explainer, Pasteup, gbro-collage-info, paper-reel, and Appmorphy Paper make cut-paper, halftone, or papercraft videos.",
  },
  {
    id: "3d",
    title: "3D",
    question: "Which free Claude Code skills make 3D reels?",
    lede: "lowpoly-reel, Promptfilm, and Appmorphy Voxel make low-poly dialogue, researched Three.js films, and voxel desk reels.",
  },
  {
    id: "talking",
    title: "Talking head",
    question: "Which free Claude Code skills edit talking-head footage?",
    lede: "Herk Edit Kit and video-edit-skill start from footage you already filmed.",
  },
  {
    id: "motion",
    title: "Motion graphics",
    question: "Which free Claude Code skills make motion graphics?",
    lede: "The Charlie Hills pack, iart-ai's packs, Reelkit, Remotion's official skills, and Claude Remotion Skill cover code-drawn motion graphics.",
  },
];

/** SPDX-style name only when the source states MIT. Other wording stays on the page, not in JSON-LD. */
export function structuredLicense(license: string) {
  return /^MIT\b/.test(license) ? "MIT" : undefined;
}

export type Shot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type SkillInstall = { label: string; command: string; note?: string };

export type Skill = {
  slug: string;
  name: string;
  category: CategoryId;
  style: string;
  tags: string[];
  badge: string;
  badgeOk: boolean;
  cost: string;
  voice: string;
  os: string;
  license: string;
  url: string;
  linkLabel: string;
  /** Real frames published by the project. Empty when none exist. */
  shots: Shot[];
  shotsCredit?: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  makes: string[];
  installs: SkillInstall[];
  needs: string[];
  gotchas: string[];
  files?: { label: string; url: string }[];
  catalog?: { title: string; items: string[] };
};

export const SKILLS: Skill[] = [
  {
    slug: "papercut-explainer",
    name: "Papercut Explainer",
    category: "print",
    style: "Cut-paper diorama",
    tags: ["Remotion", "9:16", "Local voice"],
    badge: "Free",
    badgeOk: true,
    cost: "Free MIT kit. README estimates $14-19 Claude API per 25-30s reel",
    voice: "Local Qwen3-TTS, your recording, or silent / macOS say",
    os: "macOS tested. Linux not run end to end. Windows via WSL",
    license: "MIT, except where its THIRD_PARTY.md says otherwise",
    url: "https://github.com/0xS4N4TG/papercut-explainer",
    linkLabel: "GitHub",
    shotsCredit: "Frames from the hello-reel GIF and the hook still in the README.",
    shots: [
      { src: "/motion-graphics/papercut-explainer/1.webp", alt: "Example reel frame: a paper character under a banner that reads all cut paper.", width: 506, height: 900 },
      { src: "/motion-graphics/papercut-explainer/2.webp", alt: "Example reel frame: a taped banner reading every prop is paper, with torn word scraps.", width: 252, height: 448 },
      { src: "/motion-graphics/papercut-explainer/3.webp", alt: "Example reel frame: a paper phone and envelope on a desk diorama.", width: 252, height: 448 },
      { src: "/motion-graphics/papercut-explainer/4.webp", alt: "Example reel frame: paper props in a darker street set.", width: 252, height: 448 },
    ],
    summary: "Papercut Explainer is a free kit of nine agent skills plus a Remotion library for short vertical cut-paper explainer reels.",
    metaTitle: "Papercut Explainer: free cut-paper reel skill",
    metaDescription:
      "Papercut Explainer is a free MIT skill kit for vertical cut-paper reels in Remotion, with local Qwen3-TTS or a placeholder voice. Install from the README.",
    makes: [
      "Short vertical explainers that look like layered construction paper.",
      "Nine skills: strategy, hook, script, storyboard, voice, build, QA, setup, and a router. A scene-builder subagent is included.",
      "A Remotion kit with 24 backdrops, 17 camera moves, 10 scene transitions, 79 synthesized sound effects and 8 music beds.",
      "You describe the video. The skills research it, write a script on a fixed spoken spine, plan cuts, make or fake the voiceover, and build scenes. You review stills and the final cut.",
    ],
    installs: [
      {
        label: "Skills only",
        command: "npx skills add 0xS4N4TG/papercut-explainer",
        note: "The README says this does not fetch the Remotion library or the scripts. Then tell the agent to set up papercut-explainer.",
      },
      {
        label: "Repo and library",
        command: "git clone https://github.com/0xS4N4TG/papercut-explainer\ncd papercut-explainer\n./install.sh",
        note: "The installer asks for Minimal, Standard, Full or Custom. Standard can render with a placeholder voice. Full adds local Qwen3-TTS.",
      },
    ],
    needs: [
      "Node 20+, npm, ffmpeg 4.4+, rsync and Python 3.",
      "A coding agent. The installer knows Claude Code, OpenCode, Codex CLI, Gemini CLI and others.",
      "Chrome or Chromium only for the sound-effects and music render. Video renders use Remotion's headless browser.",
      "Full voice install: about 4-6 GB more, and Python 3.10-3.12.",
    ],
    gotchas: [
      "Written and run end to end on macOS (Apple Silicon). Linux scripts were not run end to end. On Windows the README says to use WSL.",
      "Standard install is a placeholder voice (silent, or macOS say). Word-timed voiceover from text needs the Full install.",
      "The README's cost yardstick is about $14-19 in Claude API per 25-30 second reel at list prices. Local voice and the shipped backdrops are not metered.",
      "Remotion has its own licence: the README says it is free for individuals and small teams, and paid above a size threshold.",
      "npx skills add installs skills only. Rendering needs the library from the git install.",
    ],
  },
  {
    slug: "pasteup",
    name: "Pasteup",
    category: "print",
    style: "Halftone collage",
    tags: ["Stop-motion", "Gemini", "Claude Code"],
    badge: "Free + Gemini key",
    badgeOk: false,
    cost: "MIT. No paid video model. Needs a Gemini API key (free tier works)",
    voice: "No narration voice in the README",
    os: "Not stated in the README",
    license: "MIT",
    url: "https://github.com/tmoody1973/pasteup",
    linkLabel: "GitHub",
    shotsCredit: "Frames from the jazz-history demo GIF in the README.",
    shots: [
      { src: "/motion-graphics/pasteup/1.webp", alt: "Jazz history collage: a blue halftone drum on a yellow paper field.", width: 360, height: 360 },
      { src: "/motion-graphics/pasteup/2.webp", alt: "Jazz history collage: a poster that reads 1917, jazz on record.", width: 360, height: 360 },
      { src: "/motion-graphics/pasteup/3.webp", alt: "Jazz history collage: a blue halftone saxophonist.", width: 360, height: 360 },
      { src: "/motion-graphics/pasteup/4.webp", alt: "Jazz history collage: a red burst on a speckled paper field.", width: 360, height: 360 },
    ],
    summary: "Pasteup is a free Claude Code skill for halftone paper-collage stop-motion, with Gemini cut-outs and a local compositor.",
    metaTitle: "Pasteup: free halftone collage skill for Claude Code",
    metaDescription:
      "Pasteup is an MIT Claude Code skill for halftone paper-collage stop-motion. It needs Python, ffmpeg and a Gemini API key. The README says the free tier works.",
    makes: [
      "Halftone paper-collage clips: one flat color field, black-and-white cut-outs, pieces that slide in and snap.",
      "A reference image is decoded into an editable spec. Cut-outs and painted backgrounds come from the Gemini image API.",
      "Motion is a deterministic local compositor on twos, with seeded position and rotation jitter. The README's jazz demo is seven scenes and 30 seconds, with no video model.",
    ],
    installs: [
      {
        label: "Claude Code plugin",
        command: "/plugin marketplace add tmoody1973/pasteup\n/plugin install pasteup@pasteup",
        note: "Then run /pasteup:setup, which installs Python packages, checks ffmpeg and configures the key. The README also shows /pasteup:setup YOUR_KEY_HERE.",
      },
    ],
    needs: ["Claude Code.", "Python 3.10+ with pip.", "ffmpeg on PATH.", "A Gemini API key. The README says the free tier works, and links https://aistudio.google.com/apikey."],
    gotchas: [
      "Images come from the Gemini image API. The README says there is no paid video model, and that iteration in the compositor is free and instant.",
      "The key is written to a project .env. The README says not to commit it.",
      "The README does not name an operating system or a narration voice.",
    ],
  },
  {
    slug: "gbro-collage-info",
    name: "gbro-collage-info",
    category: "print",
    style: "Halftone info-graphic",
    tags: ["HyperFrames", "9:16", "No image model"],
    badge: "Free",
    badgeOk: true,
    cost: "MIT. Local HTML/CSS/GSAP render. No image-generation model",
    voice: "You bring the voiceover script. Built-in foley, not TTS",
    os: "Not stated in the README",
    license: "MIT",
    url: "https://github.com/pyang5166/gbro-collage-info",
    linkLabel: "GitHub",
    shotsCredit: "Frames from the four demo GIFs in the README.",
    shots: [
      { src: "/motion-graphics/gbro-collage-info/1.webp", alt: "Halftone paper info-graphic: a drawer of cards with the numbers 7 and 10.", width: 400, height: 712 },
      { src: "/motion-graphics/gbro-collage-info/2.webp", alt: "Halftone paper info-graphic: a numbered list on a cut-paper card.", width: 400, height: 712 },
      { src: "/motion-graphics/gbro-collage-info/3.webp", alt: "Halftone paper info-graphic: a focus-pull card of document blocks.", width: 400, height: 712 },
      { src: "/motion-graphics/gbro-collage-info/4.webp", alt: "Halftone paper info-graphic: a card asking how do you unlock it.", width: 400, height: 712 },
    ],
    summary: "gbro-collage-info is a free Claude Code skill that turns a voiceover script into 1080×1920 halftone paper info-graphics, rendered locally with no image model.",
    metaTitle: "gbro-collage-info: free paper info-graphic skill",
    metaDescription:
      "gbro-collage-info is a free MIT Claude Code skill that animates a voiceover script as halftone paper cards in HyperFrames, with no image model.",
    makes: [
      "Editorial halftone paper-collage info-graphics from a voiceover script: beige paper, cut-paper cards, one accent color, halftone screenshots, stop-motion easing.",
      "Output is a 1080×1920 mp4 at 30fps with foley (paper clicks, flips, whooshes).",
      "Three gates: pick segments, approve static frames from headless Chrome, then HyperFrames animation plus QA.",
      "Screen text may only quote facts in the script. The README says it will not draw a fake UI when a screenshot is missing.",
    ],
    installs: [
      {
        label: "Clone into Claude skills",
        command: "git clone https://github.com/pyang5166/gbro-collage-info.git ~/.claude/skills/gbro-collage-info",
        note: "Then run ~/.claude/skills/gbro-collage-info/scripts/check_setup.sh. hyperframes@0.7.56 downloads on first npx.",
      },
    ],
    needs: ["Claude Code. The README says the skill format works there.", "Node 22 or newer.", "Chrome for headless sample frames.", "ffmpeg and ffprobe."],
    gotchas: [
      "Trigger phrases in the skill are written in Chinese. The English section says the visual system works for any language, and that layouts are tuned for CJK-density text.",
      "It expects a script you already have. It is not a text-to-speech tool.",
      "The README does not name an operating system.",
      "Sound effects are from Mixkit. The README says they are royalty-free and OK for commercial use.",
    ],
  },
  {
    slug: "paper-reel",
    name: "paper-reel",
    category: "print",
    style: "Cut-paper explainer",
    tags: ["macOS", "Kokoro", "9:16"],
    badge: "Free",
    badgeOk: true,
    cost: "MIT. No API keys, no accounts",
    voice: "Local Kokoro, timed with whisper.cpp",
    os: "macOS",
    license: "MIT",
    url: "https://github.com/haiderfarooq3/paper-reel",
    linkLabel: "GitHub",
    shotsCredit: "Frames from the example MP4 linked in the README.",
    shots: [
      { src: "/motion-graphics/paper-reel/1.webp", alt: "paper-reel example: a paper mascot at a chalkboard asking why the sky is blue.", width: 720, height: 1280 },
      { src: "/motion-graphics/paper-reel/2.webp", alt: "paper-reel example: a waveform scene titled the pen waits for the voice.", width: 720, height: 1280 },
      { src: "/motion-graphics/paper-reel/3.webp", alt: "paper-reel example: a paper mascot beside a no-faces warning.", width: 720, height: 1280 },
      { src: "/motion-graphics/paper-reel/4.webp", alt: "paper-reel example: a free and open-source card with a star count.", width: 720, height: 1280 },
    ],
    summary: "paper-reel is a free Claude Code skill for faceless 9:16 cut-paper explainers on a Mac, with flat paper shapes, a box mascot, word-by-word captions and a local voice.",
    metaTitle: "paper-reel: free Mac cut-paper explainer skill",
    metaDescription:
      "paper-reel is a free MIT Claude Code skill for faceless 9:16 cut-paper reels on macOS, with local Kokoro voice and whisper.cpp. No API keys.",
    makes: [
      "Faceless 9:16 explainers: textured paper shapes, a box mascot in a different hat each scene, a headline sign, rubber stamps, counters, and one paper scrap per spoken word.",
      "You give Claude a topic. It writes six or seven lines. One command renders the MP4.",
      "The voice is the clock. whisper.cpp times each word and props cue off those words.",
      "Export is 1080×1920 at 30fps, with a ducked lo-fi bed at about -14 LUFS. The README says about 30 seconds to export on an M-series Mac.",
    ],
    installs: [
      {
        label: "Clone and doctor",
        command:
          "git clone https://github.com/haiderfarooq3/paper-reel ~/.claude/skills/paper-reel\ncd ~/.claude/skills/paper-reel && npm install && npx playwright install chromium\nbrew install ffmpeg whisper-cpp\n~/.claude/skills/paper-reel/bin/reel doctor",
        note: "doctor checks the whisper model, a Python with kokoro-onnx, and the Kokoro model files, and prints the command for anything missing.",
      },
    ],
    needs: ["macOS.", "Node 18 or newer.", "ffmpeg and whisper.cpp.", "Kokoro model files, which doctor tells you how to get."],
    gotchas: [
      "Mac only. The README says everything runs on your Mac.",
      "The renderer is vendored from cth9191/animate (MIT). See NOTICE.md in that repo.",
      "The README says it is not affiliated with Anthropic.",
    ],
  },
  {
    slug: "paper",
    name: "Paper",
    category: "print",
    style: "Papercraft diorama",
    tags: ["three.js", "ElevenLabs", "9:16"],
    badge: "Free + ElevenLabs",
    badgeOk: false,
    cost: "Skill file free. ElevenLabs voice: free plan to try; commercial licence from $6/month",
    voice: "ElevenLabs, one narrator",
    os: "Not stated on the page",
    license: "Not stated on the page",
    url: "https://www.appmorphy.com/formats/paper",
    linkLabel: "Page",
    shotsCredit: "Frames cropped from the reference sheet on the Paper format page.",
    shots: [
      { src: "/motion-graphics/paper/1.webp", alt: "Paper reel frame: orange paper characters and a shark in a lit studio.", width: 360, height: 640 },
      { src: "/motion-graphics/paper/2.webp", alt: "Paper reel frame: a sign reading skill.md for zero dollars.", width: 360, height: 640 },
      { src: "/motion-graphics/paper/3.webp", alt: "Paper reel frame: a comment bubble that says paper.", width: 360, height: 640 },
      { src: "/motion-graphics/paper/4.webp", alt: "Paper reel frame: a paper library set with a free sign.", width: 360, height: 640 },
      { src: "/motion-graphics/paper/5.webp", alt: "Paper reel frame: a counter and a thirty-dollar price.", width: 360, height: 640 },
      { src: "/motion-graphics/paper/6.webp", alt: "Paper reel frame: the end card asking viewers to comment paper.", width: 360, height: 640 },
    ],
    summary: "Paper is a free SKILL.md for 25-40 second papercraft diorama reels, with a paper TV studio, orange characters, taped banners and ElevenLabs narration.",
    metaTitle: "Paper: free papercraft diorama skill (Library.md)",
    metaDescription:
      "Paper is a free Claude skill from Library.md for papercraft diorama reels in three.js. The skill file is free. Narration is ElevenLabs.",
    makes: [
      "A papercraft TV studio, a corridor and three flat paper dioramas, built in three.js.",
      "Orange paper characters, a taped paper banner per beat, word-by-word captions on orange paper tags, a blue news chyron, speech bubbles, and a COMMENT bubble at the end.",
      "25-40 second vertical reels for TikTok, Instagram Reels and YouTube Shorts.",
      "The page says it is best for stories with characters and a twist.",
    ],
    installs: [
      {
        label: "Claude Code, from the page",
        command: "save the file as ~/.claude/skills/paper/SKILL.md, with the reference frames beside it as reference.jpg, then ask for a video or run /paper",
        note: "The page has no shell one-liner. In Morphy: Settings, Community, Playground, Skills, kind Content, and add Paper. Codex or another agent: add it as a skill, or attach the file.",
      },
    ],
    needs: [
      "Node 22 or newer.",
      "Chrome or Edge.",
      "ffmpeg.",
      "An ElevenLabs API key. The page says the free plan works to try it.",
      "A graphics card. three.js is installed by the agent.",
    ],
    gotchas: [
      "Voice is ElevenLabs. The page says the free plan is about 10,000 credits a month, roughly one per character, and that videos promoting anything need a paid plan for the commercial licence, from $6 a month.",
      "One fast narrator, tightened to about 265 words a minute. A 30-second reel renders on your graphics card in about 3 minutes, the page says.",
      "The page does not name an operating system or a software licence.",
      "On Instagram, the page says a reel narrated by a realistic AI voice needs Meta's AI info label.",
    ],
    files: [
      { label: "SKILL.md", url: "https://www.appmorphy.com/formats/paper/SKILL.md" },
      { label: "reference.jpg", url: "https://www.appmorphy.com/formats/paper/reference.jpg" },
    ],
  },
  {
    slug: "lowpoly-reel",
    name: "lowpoly-reel",
    category: "3d",
    style: "Low-poly 3D",
    tags: ["Three.js", "ElevenLabs", "9:16"],
    badge: "Free + ElevenLabs",
    badgeOk: false,
    cost: "MIT code. Voices use ElevenLabs credits",
    voice: "ElevenLabs, via Claude in Chrome",
    os: "Not stated in the README",
    license: "MIT",
    url: "https://github.com/stochosfrance/lowpoly-reel",
    linkLabel: "GitHub",
    shotsCredit: "Frames from the demo GIF in the README.",
    shots: [
      { src: "/motion-graphics/lowpoly-reel/1.webp", alt: "Low-poly reel: a person at a laptop at night, with a small orange companion.", width: 300, height: 534 },
      { src: "/motion-graphics/lowpoly-reel/2.webp", alt: "Low-poly reel: a hologram interface above the desk.", width: 300, height: 534 },
      { src: "/motion-graphics/lowpoly-reel/3.webp", alt: "Low-poly reel: a close-up of the low-poly face.", width: 300, height: 534 },
      { src: "/motion-graphics/lowpoly-reel/4.webp", alt: "Low-poly reel: a close-up of the orange block companion.", width: 300, height: 534 },
    ],
    summary: "lowpoly-reel is a free Claude Code skill that turns a script into a 1080×1920 low-poly reel with Three.js, ElevenLabs voices, synthesized sound, subtitles and an end card.",
    metaTitle: "lowpoly-reel: free low-poly 3D reel skill",
    metaDescription:
      "lowpoly-reel is an MIT Claude Code skill that turns a dialogue script into a low-poly 3D reel with ElevenLabs voices, subtitles and a branded end card.",
    makes: [
      "Hand-coded low-poly 3D (Three.js), rendered frame by frame at 1080×1920 in headless Chrome. The README says no AI-generated images or video.",
      "A default scene: a person at a desk at night, rain on the glass, a city, and a small orange AI companion on a hologram.",
      "Varied shots, mouth shapes on the voice, synthesized rain and UI sounds, subtitles, and an end card with your logo and a platform CTA.",
      "Exports H.264 for Instagram Reels and TikTok at -14 LUFS, with a safe-zone check.",
    ],
    installs: [
      {
        label: "Clone into Claude skills",
        command: "git clone https://github.com/stochosfrance/lowpoly-reel.git ~/.claude/skills/lowpoly-reel",
        note: "In Claude Code, paste a script or run /lowpoly-reel.",
      },
    ],
    needs: [
      "Claude Code.",
      "Node 18+.",
      "Python 3 with numpy and scipy.",
      "ffmpeg on PATH.",
      "Google Chrome or Chromium.",
      "An ElevenLabs account and the Claude in Chrome extension, for voices.",
    ],
    gotchas: [
      "Generating voices spends ElevenLabs credits.",
      "The README says Claude cannot listen to the result. It measures levels. You check the voices by ear.",
      "A full 25 second render takes a few minutes, depending on the machine.",
      "The README does not name an operating system. It says the project is not affiliated with Anthropic or ElevenLabs.",
    ],
  },
  {
    slug: "promptfilm",
    name: "Promptfilm",
    category: "3d",
    style: "Real-time 3D film",
    tags: ["Three.js", "HTML loop", "MP4"],
    badge: "Free",
    badgeOk: true,
    cost: "MIT. No paid API named in the README",
    voice: "No narration engine named",
    os: "macOS tested. Linux should work. Windows untested (WSL safer)",
    license: "MIT",
    url: "https://github.com/Seokwoooo/promptfilm",
    linkLabel: "GitHub",
    shotsCredit: "Three panels from the product-film still in the README, plus a test frame shipped in the repo.",
    shots: [
      { src: "/motion-graphics/promptfilm/1.webp", alt: "Product film frame: a dark cylindrical speaker on a gray set.", width: 304, height: 533 },
      { src: "/motion-graphics/promptfilm/2.webp", alt: "Product film frame: the speaker's glowing top, labeled touch the light.", width: 304, height: 533 },
      { src: "/motion-graphics/promptfilm/3.webp", alt: "Product film frame: an exploded view of the speaker's parts.", width: 304, height: 533 },
      { src: "/motion-graphics/promptfilm/4.webp", alt: "Promptfilm test frame: a labeled cross-section of a memory cell.", width: 540, height: 540 },
    ],
    summary: "Promptfilm is a free Claude Code skill that turns one sentence into a researched 3D motion graphic: a looping HTML film in Three.js and a frame-exact MP4.",
    metaTitle: "Promptfilm: free 3D motion-graphic skill",
    metaDescription:
      "Promptfilm is an MIT Claude Code skill that turns one sentence into a researched Three.js film and a 1080p MP4. Node 20+. Tested on macOS.",
    makes: [
      "A real-time Three.js film in one HTML file: studio light, physically based materials, one continuous camera, a seamless loop.",
      "Journeys through scale, product ads, explainers, logo stings, data stories. 9:16, 16:9, 1:1 or 4:5. Captions in one or two languages.",
      "Researched facts. The README says every number on screen has a source, and anything that is not public is marked illustrative.",
      "A local Studio on 127.0.0.1 to scrub, comment, change pace and export a 1080p 60fps MP4.",
    ],
    installs: [
      {
        label: "Claude Code plugin",
        command: "/plugin marketplace add Seokwoooo/promptfilm\n/plugin install promptfilm@promptfilm",
        note: "Restart Claude Code or run /reload-plugins. The skill is also /promptfilm.",
      },
      {
        label: "Personal skill",
        command: "git clone https://github.com/Seokwoooo/promptfilm.git\ncp -R promptfilm/skills/promptfilm ~/.claude/skills/",
        note: "The first run installs packages.",
      },
    ],
    needs: [
      "Claude Code. The README recommends Opus 5.5, Sonnet 5.5 or Fable 5.1, or newer, at effort medium or above.",
      "Node.js 20 or newer, installed by you.",
      "A headless Chrome and ffmpeg. The first run can install Playwright's Chromium and a private ffmpeg if you do not have them.",
      "Optional yt-dlp for frames from reference videos.",
    ],
    gotchas: [
      "The README says a film takes hours of agent work and a lot of tokens.",
      "Developed and tested on macOS (Apple Silicon). Linux should work. Windows is untested; WSL is the safer route.",
      "Without a GPU, Chrome falls back to software rendering, which the README calls slow.",
      "Memory notes in the README: 8 GB is enough, with fewer parallel export browsers on an 8 GB machine.",
      "Not affiliated with Anthropic, the README says.",
    ],
  },
  {
    slug: "voxel",
    name: "Voxel",
    category: "3d",
    style: "Voxel 3D",
    tags: ["three.js", "ElevenLabs", "9:16"],
    badge: "Free + ElevenLabs",
    badgeOk: false,
    cost: "Skill file free. ElevenLabs voice: free plan to try; commercial licence from $6/month",
    voice: "ElevenLabs, one narrator",
    os: "Not stated on the page",
    license: "Not stated on the page",
    url: "https://www.appmorphy.com/formats/voxel",
    linkLabel: "Page",
    shotsCredit: "Frames cropped from the reference sheet on the Voxel format page.",
    shots: [
      { src: "/motion-graphics/voxel/1.webp", alt: "Voxel reel frame: an orange block character with a dollar sign.", width: 360, height: 640 },
      { src: "/motion-graphics/voxel/2.webp", alt: "Voxel reel frame: a skill.md document stamped free.", width: 360, height: 640 },
      { src: "/motion-graphics/voxel/3.webp", alt: "Voxel reel frame: a wooden crate with a thirty-dollar tag.", width: 360, height: 640 },
      { src: "/motion-graphics/voxel/4.webp", alt: "Voxel reel frame: a stack of markdown file cards.", width: 360, height: 640 },
      { src: "/motion-graphics/voxel/5.webp", alt: "Voxel reel frame: a skill.md page with a thirty-dollar tag.", width: 360, height: 640 },
      { src: "/motion-graphics/voxel/6.webp", alt: "Voxel reel frame: an end card that says comment voxel.", width: 360, height: 640 },
    ],
    summary: "Voxel is a free SKILL.md for 40-55 second voxel reels, with a blocky night desk, two characters, torn-paper captions and ElevenLabs narration.",
    metaTitle: "Voxel: free voxel 3D explainer skill",
    metaDescription:
      "Voxel is a free Claude skill for narrated voxel 3D reels in three.js. The skill file is free. The voice is ElevenLabs, with a preview before you spend credits.",
    makes: [
      "A voxel desk at night by a city window, built in three.js. An orange block and a creator in a blue cap act out each sentence.",
      "A torn paper banner, a price or counter badge, a terminal bar, orange torn-paper word captions, one narrator and a music bed.",
      "40-55 second vertical reels for TikTok, Instagram Reels and YouTube Shorts.",
      "The page says a preview mode builds the whole video before you spend voice credits.",
    ],
    installs: [
      {
        label: "Claude Code, from the page",
        command: "save the file as ~/.claude/skills/voxel/SKILL.md, with the reference frames beside it as reference.jpg, then ask for a video or run /voxel",
        note: "The page has no shell one-liner. Morphy: Settings, Community, Playground, Skills, kind Content, and add Voxel. Other agents: add the skill or attach the file.",
      },
    ],
    needs: [
      "Node 22 or newer.",
      "Chrome or Edge.",
      "ffmpeg.",
      "An ElevenLabs API key. The page says the free plan works to try it.",
      "A graphics card. three.js is installed by the agent.",
    ],
    gotchas: [
      "Same voice terms as Paper: ElevenLabs free plan to try (about 10,000 credits a month). Promoting anything needs a paid plan for the commercial licence, from $6 a month.",
      "About 1,650 frames for a 55-second reel, the page says.",
      "The page does not name an operating system or a software licence.",
      "On Instagram, the page says a realistic AI voice needs Meta's AI info label.",
    ],
    files: [
      { label: "SKILL.md", url: "https://www.appmorphy.com/formats/voxel/SKILL.md" },
      { label: "reference.jpg", url: "https://www.appmorphy.com/formats/voxel/reference.jpg" },
    ],
  },
  {
    slug: "herk-edit-kit",
    name: "Herk Edit Kit",
    category: "talking",
    style: "Footage edit + motion cards",
    tags: ["HyperFrames", "Codex", "Claude Code"],
    badge: "Free, optional APIs",
    badgeOk: true,
    cost: "Free to clone. Local starter needs no paid API. ElevenLabs Scribe and Kie.ai are optional",
    voice: "Your footage. Transcription: ElevenLabs Scribe, or Whisper",
    os: "PowerShell, macOS Terminal, or a Linux shell",
    license: "Not stated in the README",
    url: "https://github.com/nateherkai/herk-edit-kit",
    linkLabel: "GitHub",
    shotsCredit: "Stills published in docs/images: two curiosity reels, the AIS live ad, and the YouTube showreel.",
    shots: [
      { src: "/motion-graphics/herk-edit-kit/1.webp", alt: "Edited reel still: a motion graphic above Nate Herk, with the line work with AI.", width: 360, height: 640 },
      { src: "/motion-graphics/herk-edit-kit/2.webp", alt: "Edited reel still: a second curiosity reel, with Nate Herk and an on-screen card.", width: 360, height: 640 },
      { src: "/motion-graphics/herk-edit-kit/3.webp", alt: "AIS live ad still: Nate Herk at a microphone in front of an AIS sign.", width: 360, height: 640 },
      { src: "/motion-graphics/herk-edit-kit/4.webp", alt: "YouTube showreel still: a red lacquer play button with a look-dev readout.", width: 900, height: 506 },
    ],
    summary: "Herk Edit Kit is Nate Herk's free kit for editing footage you bring in Codex or Claude Code, with cuts, captions, 15 skills, 406 motion-graphics cards and HyperFrames.",
    metaTitle: "Herk Edit Kit: free talking-head edit skills",
    metaDescription:
      "Herk Edit Kit is a free-to-clone video kit for Codex and Claude Code: silence cuts, storytelling, 406 motion cards and HyperFrames. Licence is not in the README.",
    makes: [
      "Edits of footage you bring: dead air, mistake review, story planning, captions, B-roll and motion graphics.",
      "15 skills, mirrored for Codex and Claude Code, plus helper scripts.",
      "406 draft motion-graphics cards in two styles, and two scene templates (dark graph paper and a left glass popout).",
      "Short-form reels and YouTube Shorts, and a motion-showreel skill. The README's showreel example is 15 seconds, 1920×1080, 60fps.",
      "A synthetic starter composition that needs no footage or API key.",
    ],
    installs: [
      {
        label: "Clone and setup",
        command: "git clone https://github.com/nateherkai/herk-edit-kit.git\ncd herk-edit-kit\nnpm ci\nnpm run setup\nnpm test",
        note: "Setup checks tools and creates .env only if it is absent. Add keys only for services you choose.",
      },
    ],
    needs: [
      "Node.js 22 or newer, Git, FFmpeg including ffprobe, and Chrome or Chromium.",
      "node, ffmpeg and ffprobe on PATH.",
      "Codex or Claude Code, opened in this repo, for an edit. The demo render uses HyperFrames and does not need a voiceover.",
    ],
    gotchas: [
      "The README does not state a licence.",
      "Nate uses ElevenLabs Scribe to transcribe and Kie.ai to generate video and images. Both need your own keys. You can ask for OpenAI Whisper or local Whisper, or bring a word-level transcript.",
      "Cards are draft assets. The README says library templates may load GSAP and Google Fonts from public CDNs.",
      "The included transcription helper uses ElevenLabs. Whisper and Kie.ai need the tools guide.",
    ],
  },
  {
    slug: "video-edit",
    name: "Video Edit",
    category: "talking",
    style: "Talking-head reel",
    tags: ["HyperFrames", "Instagram", "Your clips"],
    badge: "Free",
    badgeOk: true,
    cost: "Free to clone. Optional Apify account; the README says the free tier works",
    voice: "Your clips. Word timing with faster-whisper. No TTS named",
    os: "Mac, Windows 10/11, or Linux",
    license: "Not stated in the README",
    url: "https://github.com/tenfoldmarc/video-edit-skill",
    linkLabel: "GitHub",
    shots: [],
    summary: "video-edit-skill is a free Claude Code skill that turns raw talking-head clips into a finished Instagram reel with captions and one of three looks.",
    metaTitle: "Video Edit: free talking-head reel skill",
    metaDescription:
      "Video Edit is a Claude Code skill that turns raw talking-head clips into an Instagram reel with captions and three looks. Mac, Windows or Linux. No licence in the README.",
    makes: [
      "A finished Instagram reel from phone clips: best take of each line, dead air cut, punch-ins, background cutout so words can sit behind you.",
      "Three looks: Bold (kinetic words), Cool girl (warm grade, yellow serif italic), Cool dude (dark editorial grade, spaced capitals).",
      "Animated inserts via sub-agents, an Instagram safe-zone check, and a phone-ready copy.",
      "The README says a note-and-rerender pass takes about two minutes.",
    ],
    installs: [
      {
        label: "Tell Claude Code",
        command: "Install this skill for me: https://github.com/tenfoldmarc/video-edit-skill",
        note: "The README's no-terminal path. Paste that line into Claude Code, then run /video-edit.",
      },
      {
        label: "Manual clone",
        command: 'git clone https://github.com/tenfoldmarc/video-edit-skill "$HOME/.claude/skills/video-edit"',
        note: "Needs git. Then open Claude Code and run /video-edit.",
      },
    ],
    needs: [
      "Claude Code. The README says a regular chat cannot run it, because rendering happens on your computer.",
      "ffmpeg, Node.js 22 or newer, Python 3.10 or newer.",
      "Optional Apify account to pull your reels and profile stats. The README says the free tier works.",
    ],
    gotchas: [
      "The README does not state a licence.",
      "Built and tested on a Mac. Windows support is described as new and less tested. Apple Silicon is fastest for the background cutout. On Windows and Linux that step runs on the CPU.",
      "First run asks your name, Instagram handle and favorite look, then sets up tools. The README says about two minutes, once.",
      "Fonts are Google Fonts (SIL Open Font License). Sound effects come from Pixabay on setup. Built on HyperFrames and faster-whisper.",
    ],
  },
  {
    slug: "motion-graphics-skills",
    name: "Motion Graphics Skill Pack",
    category: "motion",
    style: "Launch motion graphics",
    tags: ["Claude Code", "Codex", "HyperFrames"],
    badge: "Free",
    badgeOk: true,
    cost: "MIT. README says nothing here needs an API key. HyperFrames is called free and open source",
    voice: "One example adds a voice. Engine not named",
    os: "Not stated in the README",
    license: "MIT",
    url: "https://github.com/charlie947/motion-graphics-skills",
    linkLabel: "GitHub",
    shotsCredit: "Frames from the launch and milestone demo GIFs in the README.",
    shots: [
      { src: "/motion-graphics/motion-graphics-skills/1.webp", alt: "Launch film frame: a blue button that reads LinkedIn AI OS.", width: 800, height: 450 },
      { src: "/motion-graphics/motion-graphics-skills/2.webp", alt: "Launch film frame: the line you need Claude Code on a dark field.", width: 800, height: 450 },
      { src: "/motion-graphics/motion-graphics-skills/3.webp", alt: "Milestone loop frame: points forming 250,000 LinkedIn followers.", width: 540, height: 676 },
    ],
    summary: "Charlie Hills' Motion Graphics Skill Pack is a free Claude Code pack for launch-grade motion graphics, and the README says every frame is code, with no After Effects and no video generator.",
    metaTitle: "Motion Graphics Skill Pack: free Claude Code skills",
    metaDescription:
      "Charlie Hills' MIT skill pack for launch videos, explainers and charts in Claude Code. Install with npx skills add. No API key, the README says.",
    makes: [
      "Launch videos, animated charts, documentary explainers, 3D openers, milestone loops, newsletter promos and reel exports. Every frame is code.",
      "The skill table names brand-intake, motion-brief-writer, reference-to-motion, motion-prompt-writer, launch-video, apple-launch-film, vox-explainer, animated-chart, milestone-reveal, motion-effects, title-sequence-3d, model-showdown, newsletter-promo, loop-cover and reel-export.",
      "brand-intake writes brand.md and MOTION.md. Other skills read those first.",
      "MP4 export is HyperFrames, added separately. Without it you get HTML with window.seek(), the README says.",
    ],
    installs: [
      {
        label: "Skills CLI",
        command: "npx skills add charlie947/motion-graphics-skills",
        note: "The README then says to open Claude Code, pick Opus 5.5 with /model, and run brand-intake first. MP4 export: npx skills add heygen-com/hyperframes.",
      },
    ],
    needs: [
      "Claude Code on Opus 5.5, for a build. Codex install instructions are also in the README (copy skills into .agents/skills).",
      "brand.md and MOTION.md from brand-intake, or the skill asks for hex codes, a font and a logo.",
      "HyperFrames, or ffmpeg plus Chrome, for an MP4.",
      "ffmpeg and Python 3 for loop-cover measuring. ffmpeg and ffprobe for reel-export and model-showdown stacking.",
    ],
    gotchas: [
      "The heading says 15 skills and the table names 15. One sentence says fourteen. The hero graphic says 13.",
      "A photoreal human face is called out as a limit: code draws motion, type and UI, and a lifelike person still needs an image model.",
      "The README says logos and screenshots must be your files. It will not redraw a logo from memory.",
      "The README does not name an operating system or a narration vendor.",
    ],
    catalog: {
      title: "Skills in the table",
      items: [
        "brand-intake: brand.md and MOTION.md",
        "motion-brief-writer: a build brief",
        "reference-to-motion: a reference video turned into a prompt",
        "motion-prompt-writer: an 8-part Motion prompt",
        "launch-video: a 30 to 45 second launch",
        "apple-launch-film: a Mac-style launch, in code",
        "vox-explainer: a 30 to 60 second documentary explainer",
        "animated-chart: a looping chart with your numbers",
        "milestone-reveal: points that pull into a real number",
        "motion-effects: 16 effects as 8-second loops",
        "title-sequence-3d: an 8 to 15 second 3D opener",
        "model-showdown: one brief, three models, one video",
        "newsletter-promo: a 12 to 20 second promo",
        "loop-cover: a newsletter cover as a looping GIF",
        "reel-export: a 1080×1920 Reel or TikTok",
      ],
    },
  },
  {
    slug: "motion-skills",
    name: "Motion Skills",
    category: "motion",
    style: "Motion skill catalog",
    tags: ["Remotion", "Manim", "Many agents"],
    badge: "Free",
    badgeOk: true,
    cost: "MIT. The README says to use them freely",
    voice: "Not named in the README",
    os: "Not stated in the README",
    license: "MIT",
    url: "https://github.com/iart-ai/motion-skills",
    linkLabel: "GitHub",
    shotsCredit: "Frames from the showcase GIF in the README.",
    shots: [
      { src: "/motion-graphics/motion-skills/1.webp", alt: "Showcase frame: the word motion in large type on a dark gradient.", width: 720, height: 406 },
      { src: "/motion-graphics/motion-skills/2.webp", alt: "Showcase frame: kinetic type reading create, in cyan and magenta.", width: 720, height: 406 },
      { src: "/motion-graphics/motion-skills/3.webp", alt: "Showcase frame: a title card that reads motion skills.", width: 720, height: 406 },
      { src: "/motion-graphics/motion-skills/4.webp", alt: "Showcase frame: the iart.ai logo lockup.", width: 720, height: 406 },
    ],
    summary: "Motion Skills is a free index of open-source agent skills for kinetic type, charts, explainers, WebGL, Manim, TikTok and Reels, installed one pack at a time.",
    metaTitle: "Motion Skills: free motion-graphics packs for agents",
    metaDescription:
      "iart-ai/motion-skills is an MIT index of agent skills for motion graphics and video. The README says 56 skills in 19 packs. Install a pack with npx skills add.",
    makes: [
      "The README says 56 skills that teach an agent motion graphics, animation and video: kinetic type, data charts, explainers, TikTok and Reels, 3D and WebGL, Manim, and more.",
      "19 packs, each its own repo. Install only what you need.",
      "Video skills render via Remotion or Manim. Web skills render standalone HTML. Skills that make a picture ship a render, screenshot, check loop.",
      "The README says skills are auto-discovered by Claude Code, Cursor, Codex and 40+ agents.",
    ],
    installs: [
      {
        label: "One pack at a time",
        command: "npx skills add iart-ai/tiktok-video-skills\nnpx skills add iart-ai/data-animation-skills",
        note: "Those two lines are the README's example. Swap in any pack repo. A Claude Code plugin example: /plugin marketplace add iart-ai/web-animation-skills.",
      },
    ],
    needs: ["An agent that reads skills. The README names Claude Code, Cursor and Codex.", "Whatever the pack you install needs. This index README does not list ffmpeg, Node or a voice vendor."],
    gotchas: [
      "This repo is the catalog. You install a pack, not the index, to get the skills.",
      "The README does not name an operating system, a narration vendor, or a price beyond MIT and “use them freely.”",
      "iart.ai is described as a separate hosted motion agent. The skills themselves are the open-source part.",
    ],
    catalog: {
      title: "Packs in the README table",
      items: [
        "tiktok-video-skills: 4 skills, TikTok / Reels / Shorts",
        "text-message-video-skills: 1, text-message stories",
        "youtube-video-skills: 2, podcasters and YouTubers",
        "ecommerce-video-skills: 3, e-commerce",
        "ad-video-skills: 3, brand ads",
        "data-animation-skills: 3, analysts and PMs",
        "explainer-video-skills: 5, educators",
        "map-animation-skills: 1, editorial maps",
        "web-animation-skills: 9, frontend",
        "motion-design-skills: 9, motion designers",
        "kinetic-typography-skills: 1, kinetic type",
        "freelance-motion-skills: 5, freelancers and studios",
        "webgl-animation-skills: 3, 3D / WebGL",
        "manim-skills: 1, math animation",
        "generative-illustration-skills: 1",
        "javascript-animation-skills: 2, canvas films",
        "lower-thirds-skills: 1, transparent lower thirds",
        "b-roll-skills: 1, b-roll for talking-head videos",
        "talking-head-skills: 1, talking-head footage from photos and a voice",
      ],
    },
  },
  {
    slug: "reelkit",
    name: "Reelkit",
    category: "motion",
    style: "Agent short-form video",
    tags: ["HyperFrames", "CLI", "Quota"],
    badge: "Free, quota",
    badgeOk: true,
    cost: "Free for now, with a monthly quota. CLI, skills and prompts are open source. Library and the image/voice API are not",
    voice: "Reelkit voiceover command. Vendor not named",
    os: "Node 22+ and ffmpeg. A Windows Studio build is mentioned",
    license: "CLI, skills and prompts open source. No SPDX name on the page",
    url: "https://reelkit.cc/en",
    linkLabel: "Page",
    shotsCredit: "Frames from the launch film and narrated explainer published on reelkit.cc.",
    shots: [
      { src: "/motion-graphics/reelkit/1.webp", alt: "Launch film frame: a laptop under a headline that says overbooked.", width: 720, height: 1280 },
      { src: "/motion-graphics/reelkit/2.webp", alt: "Launch film frame: a phone UI on a dark background.", width: 720, height: 1280 },
      { src: "/motion-graphics/reelkit/3.webp", alt: "Narrated explainer frame: a task list with tasks, deadlines and energy.", width: 720, height: 1280 },
      { src: "/motion-graphics/reelkit/4.webp", alt: "Narrated explainer frame: a week calendar with the line tempo reshuffles everything.", width: 720, height: 1280 },
    ],
    summary: "Reelkit is a free CLI and skill for Claude Code, Codex, Cursor and Gemini CLI that plans a short video in HyperFrames and handles assets, voiceover and render.",
    metaTitle: "Reelkit: free agent CLI for short-form video",
    metaDescription:
      "Reelkit is a CLI and skill that plans short-form video in HyperFrames. The site says it is free for now, with a monthly quota. Needs Node 22 and ffmpeg.",
    makes: [
      "Short-form video from a coding agent: plan, voiceover, images or clips, HyperFrames composition, preview frames, then out/video.mp4.",
      "Thirteen ready looks, or your own. Captions none, one word at a time, or a phrase at a time.",
      "The page says it is strongest at animated text, motion graphics, and 2D and 3D animation with sound. It also edits talking-to-camera footage. It is not made for cinematic realistic AI video.",
      "Examples on the page: a 22 second launch film with no narrator, and a 30 second narrated explainer.",
    ],
    installs: [
      {
        label: "From the install block",
        command: "npm install -g reelkit-cli\nreelkit init my-video",
        note: "Needs Node 22 or newer and ffmpeg. The page says init also puts the skill into your agents. Sign in with reelkit auth login. reelkit install can reinstall the skill.",
      },
    ],
    needs: ["Node 22 or newer.", "ffmpeg.", "A coding agent: Claude Code, Codex, Cursor, Gemini CLI, or another. The page says you do not need a Claude subscription specifically.", "A free account, from reelkit auth login, to pull library items."],
    gotchas: [
      "Free for now, with a monthly quota for voiceover, images, clips, background removal and transcription. reelkit whoami shows what is left.",
      "The CLI, the skills and the prompts are open source. The shared library and the API that makes images and voiceovers are not.",
      "New components your agent writes are sent for review after a render, unless you use reelkit init --private, reelkit render --no-share, or REELKIT_NO_SHARE=1. The first render on a machine only warns.",
      "Reference transcription sends the reference audio, not the video, unless --no-transcript is set.",
      "The page says Windows may warn that Reelkit Studio is an unrecognized app while its signing certificate is still being approved.",
      "The page does not name the voice vendor. You ask the agent to change voice by character.",
    ],
  },
  {
    slug: "remotion-skills",
    name: "Remotion Agent Skills",
    category: "motion",
    style: "Remotion best practices",
    tags: ["Official", "Remotion", "Claude Code"],
    badge: "Free to install",
    badgeOk: true,
    cost: "No price in the README",
    voice: "Not a voice tool. Includes a captions skill",
    os: "Not stated in the README",
    license: "Not stated in the README",
    url: "https://github.com/remotion-dev/skills",
    linkLabel: "GitHub",
    shots: [],
    summary: "Remotion Agent Skills are Remotion's own free agent skills for best practices in Claude Code, Codex, Cursor and other agents that work in Remotion projects.",
    metaTitle: "Remotion Agent Skills: official free install",
    metaDescription:
      "Remotion's official agent skills teach Claude Code, Codex and Cursor how to create, mark up and render Remotion videos. Install with npx skills add remotion-dev/skills.",
    makes: [
      "Skills for working in Remotion projects, not a finished visual theme.",
      "The README lists /remotion-best-practices (it encompasses the others), /remotion-create, /remotion-markup, /remotion-studio, /remotion-render, /remotion-maps, /remotion-captions, /remotion-saas, /remotion-interactivity, /remotion-docs, /remotion-license, /remotion-upgrade and /remotion-multimedia.",
      "/remotion-maps covers map animations, including 3D flyovers with CesiumJS. /remotion-captions is guidance for captions and subtitles.",
    ],
    installs: [
      {
        label: "Skills CLI",
        command: "npx skills add remotion-dev/skills",
        note: "The README also shows gh skill install remotion-dev/skills, and says a new Remotion project from bun create video can offer the skills.",
      },
    ],
    needs: ["An agent that can load skills. The README names Claude Code, Codex, Kimi Code and Cursor.", "A Remotion project when you are ready to render. This README does not list Node or ffmpeg."],
    gotchas: [
      "This is the official how-to for Remotion. It does not ship a paper, 3D or talking-head template.",
      "The README does not state a price, an operating system, or a licence for the skills. /remotion-license is the skill it points at for Remotion licence information. The README marks that skill available from v4.0.540.",
      "Another repo on this page, papercut-explainer, says Remotion is free for individuals and small teams and paid above a size threshold. That sentence is in papercut's README, not in this one.",
    ],
  },
  {
    slug: "claude-remotion-skill",
    name: "Claude Remotion Skill",
    category: "motion",
    style: "Remotion motion craft",
    tags: ["Remotion", "MIT", "Captions"],
    badge: "Free",
    badgeOk: true,
    cost: "MIT. README says you need Remotion, which it calls free and open source, plus a Claude subscription or API",
    voice: "No TTS vendor named. Word-synced captions are in the skill",
    os: "Not stated in the README",
    license: "MIT",
    url: "https://github.com/haidrrrry/claude-remotion-skill",
    linkLabel: "GitHub",
    shotsCredit: "Frames from the demo GIF and the Focus Cat promo GIF in the README.",
    shots: [
      { src: "/motion-graphics/claude-remotion-skill/1.webp", alt: "Demo frame: kinetic type that reads your phone won't stop.", width: 480, height: 270 },
      { src: "/motion-graphics/claude-remotion-skill/2.webp", alt: "Focus Cat promo frame: an app icon and the words Focus Cat.", width: 480, height: 270 },
      { src: "/motion-graphics/claude-remotion-skill/3.webp", alt: "Demo frame: a small sunburst mark on a light background.", width: 800, height: 450 },
      { src: "/motion-graphics/claude-remotion-skill/4.webp", alt: "Demo frame: a logo sting that reads Claude Design.", width: 800, height: 450 },
    ],
    summary: "Claude Remotion Skill is a free MIT skill that tells Claude to design Remotion motion, including springs, stagger, grain, Ken Burns and captions, and to inspect frames before delivery.",
    metaTitle: "Claude Remotion Skill: free motion-design rules",
    metaDescription:
      "Claude Remotion Skill is a free MIT agent skill for Remotion motion graphics: springs, captions, grain and a render-and-inspect loop. Clone it into ~/.claude/skills.",
    makes: [
      "Motion-design rules for Remotion: springs and bezier curves, staggered entrances, a five-layer look (mesh, assets, graphics, grade, grain and vignette), Ken Burns on stills, word-synced captions, sound design.",
      "The README lists logo animations, brand intros, vertical Reels, Shorts and TikToks, faceless videos, product explainers, lower thirds, kinetic type and B-roll edits.",
      "A mandatory loop: render, extract frames with ffmpeg, inspect, fix, re-render.",
      "An examples project with four compositions. The README says the Focus Cat promo is 15.5 seconds.",
    ],
    installs: [
      {
        label: "Per user",
        command: "git clone https://github.com/haidrrrry/claude-remotion-skill.git\nmkdir -p ~/.claude/skills\ncp -r claude-remotion-skill/remotion-motion-graphics ~/.claude/skills/",
        note: "Per project, copy into .claude/skills/ instead. Claude Desktop or Claude.ai: upload remotion-motion-graphics.skill under Settings, Capabilities, Skills.",
      },
    ],
    needs: [
      "Claude Code or Claude Desktop on Sonnet or Opus. The README says any Claude that supports agent skills can use it.",
      "Remotion. The README calls it free and open source.",
      "A Claude subscription or API access, the README says.",
    ],
    gotchas: [
      "The README says you do not need After Effects or Premiere.",
      "It calls Remotion free and open source. It does not mention a company-size threshold. papercut-explainer's README does.",
      "The README does not name an operating system or a text-to-speech vendor.",
      "Verify by asking for a 3 second logo sting. The README says a render shipped without frame checks means the skill is not loaded.",
    ],
  },
];

export const categoryLabel = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.title ?? id;

export const skillPath = (slug: string) => `${INDEX_PATH}/${slug}`;

export const getSkill = (slug: string) => SKILLS.find((s) => s.slug === slug);

const slugsIn = (id: CategoryId) => SKILLS.filter((s) => s.category === id).map((s) => s.slug);
const REMOTION = new Set(["remotion-skills", "claude-remotion-skill"]);

/** Sidebar groups. Paper, 3D, and editing follow the page categories. Motion is split into design versus Remotion. */
export const BROWSE_GROUPS: { id: string; title: string; slugs: string[] }[] = [
  { id: "paper", title: "Paper, cut-out, collage", slugs: slugsIn("print") },
  { id: "3d", title: "3D, low-poly, voxel", slugs: slugsIn("3d") },
  { id: "edit", title: "Video editing", slugs: slugsIn("talking") },
  { id: "motion", title: "Motion design and explainers", slugs: slugsIn("motion").filter((s) => !REMOTION.has(s)) },
  { id: "remotion", title: "Remotion and code-based", slugs: slugsIn("motion").filter((s) => REMOTION.has(s)) },
];

export type SkillRow = {
  slug: string;
  name: string;
  category: CategoryId;
  style: string;
  cost: string;
  voice: string;
  os: string;
  license: string;
  url: string;
  linkLabel: string;
};

export const SKILL_ROWS: SkillRow[] = SKILLS.map((s) => ({
  slug: s.slug,
  name: s.name,
  category: s.category,
  style: s.style,
  cost: s.cost,
  voice: s.voice,
  os: s.os,
  license: s.license,
  url: s.url,
  linkLabel: s.linkLabel,
}));

export const PICKS: { goal: string; slug: string; also?: string; why: string }[] = [
  {
    goal: "Cut-paper reel on a Mac, no API keys",
    slug: "paper-reel",
    why: "paper-reel uses local Kokoro voice, whisper.cpp word timing, and a single export command. The README says paper-reel runs on a Mac.",
  },
  {
    goal: "A full paper-diorama kit",
    slug: "papercut-explainer",
    why: "papercut-explainer ships 24 backdrops, camera moves and cuts in Remotion. The placeholder voice works, or the Full install adds local Qwen3-TTS.",
  },
  {
    goal: "Match a poster or collage reference",
    slug: "pasteup",
    why: "Pasteup makes halftone cut-outs with Gemini, then deterministic stop-motion. The README says the free Gemini tier works.",
  },
  {
    goal: "Animate a script you already voiced",
    slug: "gbro-collage-info",
    why: "gbro-collage-info turns a voiceover script into info-graphic cards, rendered locally, with no image model. Trigger phrases in the skill are in Chinese.",
  },
  {
    goal: "Papercraft or voxel characters, with ElevenLabs",
    slug: "paper",
    also: "voxel",
    why: "Appmorphy Paper and Voxel are free skill files that narrate with ElevenLabs. Paper is a 25-40 second TV-studio diorama. Voxel is a 40-55 second night desk and can preview before voice credits are spent.",
  },
  {
    goal: "A low-poly character reel",
    slug: "lowpoly-reel",
    why: "lowpoly-reel builds a hand-coded Three.js scene, ElevenLabs dialogue, subtitles and an end card at 1080×1920.",
  },
  {
    goal: "One sentence into a researched 3D film",
    slug: "promptfilm",
    why: "Promptfilm turns one sentence into a looping HTML film and a frame-exact MP4. The README says a film takes hours of agent time.",
  },
  {
    goal: "Edit talking-head clips into an Instagram reel",
    slug: "video-edit",
    why: "video-edit-skill picks the best take, cuts dead air, and applies one of three looks. The voice is the recording, not a text-to-speech vendor.",
  },
  {
    goal: "Cut footage and add motion-graphics cards",
    slug: "herk-edit-kit",
    why: "Herk Edit Kit includes 15 edit skills and 406 draft cards on HyperFrames. The local starter needs no paid API. ElevenLabs Scribe and Kie.ai are optional.",
  },
  {
    goal: "Launch films, charts and reels as code",
    slug: "motion-graphics-skills",
    why: "The Motion Graphics Skill Pack starts with brand-intake, then a launch, explainer or chart skill. The README says no API key is required.",
  },
  {
    goal: "Pick one motion workflow from a catalog",
    slug: "motion-skills",
    why: "Motion Skills lists 19 packs. Install the pack that matches the job, such as explainers, kinetic type or WebGL.",
  },
  {
    goal: "Let the agent handle voice, music and assets",
    slug: "reelkit",
    why: "Reelkit plans the video, records a voiceover, pulls library assets and renders with HyperFrames. Reelkit is free for now, with a monthly quota.",
  },
  {
    goal: "Official Remotion rules",
    slug: "remotion-skills",
    why: "Remotion Agent Skills are Remotion's own skills for create, markup, captions, maps and render.",
  },
  {
    goal: "Stricter motion craft on top of Remotion",
    slug: "claude-remotion-skill",
    why: "Claude Remotion Skill encodes springs, stagger, grain, Ken Burns, and a rule that Claude inspects frames before delivery.",
  },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Are these Claude Code motion skills free?",
    a: "Every Claude Code motion skill in this roundup is free to download. A finished video can still spend money. Appmorphy Paper and Voxel use ElevenLabs: the pages say the free plan is enough to try, and that videos promoting anything need a paid plan for the commercial licence, from $6 a month. lowpoly-reel spends ElevenLabs credits on voices. Pasteup needs a Gemini API key and says the free tier works. Reelkit says it is free for now, with a monthly quota for voiceover, images, clips, background removal and transcription. papercut-explainer estimates about $14-19 in Claude API cost per 25-30 second reel at list prices if you pay the API, and says local voice is not metered. paper-reel, gbro-collage-info, Promptfilm, the Charlie Hills pack, iart-ai's packs and Claude Remotion Skill do not ask for a paid voice or image key in their READMEs. Herk Edit Kit's local starter needs no paid API. ElevenLabs Scribe and Kie.ai are optional. The official Remotion skills README does not list a price.",
  },
  {
    q: "What is the best free Claude skill for a paper-cut explainer?",
    a: "No single free Claude Code skill is the best paper-cut explainer for every setup. paper-reel is the Mac path with local Kokoro voice, whisper.cpp timing and no API keys. papercut-explainer is the larger Remotion diorama kit, with local Qwen3-TTS, your own recording, or a silent placeholder. Pasteup is halftone collage stop-motion and needs a Gemini key. gbro-collage-info turns parts of a voiceover script into info-graphics and does not call an image model. Appmorphy Paper is a papercraft TV-studio reel and uses ElevenLabs.",
  },
  {
    q: "Do I need ElevenLabs for Claude reel skills?",
    a: "A Claude reel skill needs ElevenLabs only when that skill's README or format page names ElevenLabs. Appmorphy Paper, Appmorphy Voxel and lowpoly-reel use ElevenLabs. paper-reel uses local Kokoro. papercut-explainer uses local Qwen3-TTS, a recording you supply, or a placeholder (silent, or macOS say). Reelkit records narration with its voiceover command and does not name the vendor. Herk Edit Kit can transcribe with ElevenLabs Scribe or with Whisper. The other READMEs on this page do not name ElevenLabs.",
  },
  {
    q: "Which Claude video skills work on Windows?",
    a: "video-edit-skill documents Mac, Windows 10/11 and Linux, and says it was built and tested on a Mac. Herk Edit Kit's install commands are for PowerShell, macOS Terminal or a Linux shell. papercut-explainer says Windows should use WSL, and that its Linux scripts were not run end to end. Promptfilm was developed on macOS, says Linux should work, and says Windows is untested. paper-reel says it runs on your Mac. Several other READMEs never name an operating system.",
  },
  {
    q: "Can Claude Code make motion graphics without After Effects?",
    a: "Claude Code can make motion graphics without After Effects, according to these READMEs. The Charlie Hills pack says every frame is code, with no After Effects and no video generator. Claude Remotion Skill says you do not need After Effects or Premiere, and that it renders with Remotion. iart-ai's README says video skills render via Remotion or Manim, and web skills render HTML. papercut-explainer, paper-reel, lowpoly-reel, Promptfilm, Appmorphy Paper, Appmorphy Voxel, gbro-collage-info, Herk Edit Kit and Reelkit describe Remotion, canvas, Three.js or HyperFrames, not a timeline editor.",
  },
  {
    q: "How do I install a Claude Code video skill?",
    a: "Each Claude Code video skill in this roundup installs with the command printed on that skill's card. These READMEs use three patterns: npx skills add owner/repo, git clone into ~/.claude/skills/name, or a Claude Code plugin command such as /plugin marketplace add. Appmorphy Paper and Voxel have no shell command. Their pages say to save SKILL.md as ~/.claude/skills/paper/SKILL.md or ~/.claude/skills/voxel/SKILL.md, with reference.jpg beside it. Reelkit's page says npm install -g reelkit-cli, then reelkit init my-video.",
  },
];
