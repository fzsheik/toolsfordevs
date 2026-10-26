import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Search and AI answer-engine crawlers are welcome: the whole point is to be cited.
const AI = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...AI.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
