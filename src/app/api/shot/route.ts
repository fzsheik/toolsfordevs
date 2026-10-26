import { getEvents } from "@/lib/events";
import { VENDORS, type VendorId } from "@/lib/site";

export const dynamic = "force-dynamic";

// Shared "call your shot" tally. Needs an Upstash Redis (REST) database; without the env vars the
// UI quietly stays local-only. One hash per vendor per round (round = last logged reset), so the
// crowd's picks start fresh whenever a reset lands.
// Vercel's Upstash integration injects <PREFIX>KV_REST_API_* (prefix is chosen at connect time, e.g. DT_);
// a direct Upstash setup uses UPSTASH_REDIS_REST_*. Match any of them.
const envBy = (suffix: string) => {
  const k = Object.keys(process.env).find((n) => n === `UPSTASH_REDIS_${suffix}` || n.endsWith(`KV_${suffix}`));
  return k ? process.env[k] : undefined;
};
const URL_ = envBy("REST_URL") ?? envBy("REST_API_URL");
const TOKEN = envBy("REST_TOKEN") ?? envBy("REST_API_TOKEN");
const WINDOW = 21;
const DAY = 86_400_000;

async function redis(...cmd: (string | number)[]) {
  const res = await fetch(URL_!, {
    method: "POST",
    headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  return (await res.json()).result;
}

const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const validDay = (d: unknown): d is string => {
  if (typeof d !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const diff = (Date.parse(`${d}T00:00:00Z`) - Date.parse(`${iso(Date.now())}T00:00:00Z`)) / DAY;
  return diff >= 1 && diff <= WINDOW;
};

async function roundKey(vendor: VendorId) {
  const last = (await getEvents(vendor)).find((e) => e.kind === "reset");
  return `shot:${vendor}:${last?.date ?? "none"}`;
}

const isVendor = (v: unknown): v is VendorId => typeof v === "string" && v in VENDORS;

export async function GET(req: Request) {
  const vendor = new URL(req.url).searchParams.get("vendor");
  if (!URL_ || !TOKEN || !isVendor(vendor)) return Response.json({ enabled: false, counts: {} });
  try {
    const flat: string[] = (await redis("HGETALL", await roundKey(vendor))) ?? [];
    const counts: Record<string, number> = {};
    for (let i = 0; i < flat.length; i += 2) counts[flat[i]] = Math.max(0, Number(flat[i + 1]));
    return Response.json({ enabled: true, counts });
  } catch {
    return Response.json({ enabled: false, counts: {} });
  }
}

export async function POST(req: Request) {
  if (!URL_ || !TOKEN) return Response.json({ enabled: false }, { status: 503 });
  const body = await req.json().catch(() => null);
  const vendor = body?.vendor;
  if (!isVendor(vendor) || !validDay(body?.day)) return Response.json({ error: "bad request" }, { status: 400 });
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    const hits = await redis("INCR", `shot:rl:${ip}`);
    if (hits === 1) await redis("EXPIRE", `shot:rl:${ip}`, 60);
    if (hits > 20) return Response.json({ error: "slow down" }, { status: 429 });
    const key = await roundKey(vendor);
    // moving a pick: take the old one back (only if it is still a plausible day)
    if (body.prev && body.prev !== body.day && /^\d{4}-\d{2}-\d{2}$/.test(body.prev)) {
      const left = await redis("HINCRBY", key, body.prev, -1);
      if (Number(left) < 0) await redis("HSET", key, body.prev, 0);
    }
    if (body.prev !== body.day) await redis("HINCRBY", key, body.day, 1);
    await redis("EXPIRE", key, 60 * 60 * 24 * 60);
    return Response.json({ enabled: true });
  } catch {
    return Response.json({ enabled: false }, { status: 502 });
  }
}
