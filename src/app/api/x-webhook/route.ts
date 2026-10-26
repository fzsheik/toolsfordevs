import { createHmac, timingSafeEqual } from "node:crypto";
import { dateFromPostId } from "@/lib/events";

// Receives X Activity API `post.create` events, filters for reset language, and pings Discord.
// Nothing is published automatically: a human adds the event to src/data/events.json.

const SECRET = process.env.X_CLIENT_SECRET ?? "";
type XEvent = {
  data?: {
    event_type?: string;
    payload?: { id: string; text?: string; author_id?: string };
    includes?: { users?: { id: string; username: string }[] };
  };
};

const HIT = /\bresets?\b/i;

const sign = (body: string) => "sha256=" + createHmac("sha256", SECRET).update(body).digest("base64");

/** CRC handshake: X calls this on registration and periodically after. */
export function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("crc_token");
  if (!token || !SECRET) return new Response("bad request", { status: 400 });
  return Response.json({ response_token: sign(token) });
}

export async function POST(req: Request) {
  const raw = await req.text();
  const got = req.headers.get("x-twitter-webhooks-signature-oauth2") ?? "";
  const want = sign(raw);
  if (!SECRET || got.length !== want.length || !timingSafeEqual(Buffer.from(got), Buffer.from(want))) {
    return new Response("invalid signature", { status: 401 });
  }

  let evt: XEvent;
  try {
    evt = JSON.parse(raw);
  } catch {
    return new Response("bad json", { status: 400 });
  }
  const d = evt?.data;
  if (d?.event_type === "post.create" && d.payload?.text && HIT.test(d.payload.text)) {
    const p = d.payload;
    const user = d.includes?.users?.find((u) => u.id === p.author_id)?.username ?? p.author_id ?? "unknown";
    const url = `https://x.com/${user}/status/${p.id}`;
    const hook = process.env.DISCORD_WEBHOOK_URL;
    if (hook) {
      await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          content:
            `**Possible reset** from @${user} (${dateFromPostId(p.id)} UTC)\n> ${(p.text ?? "").slice(0, 500)}\n${url}\n` +
            `Add to events.json with \`"postId": "${p.id}"\` if real.`,
        }),
      }).catch(() => {});
    }
  }
  return new Response("ok"); // always ack within 10s
}
