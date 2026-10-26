import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "./site";
import { BRAND } from "./brand";
import BrandMark from "@/components/BrandMark";

export const ogSize = { width: 1200, height: 630 };
export const ogType = "image/png";

const sans = readFile(join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf"));

export async function renderOg({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  const size = title.length > 80 ? 54 : title.length > 48 ? 68 : 86;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 48, background: BRAND.paper, color: BRAND.ink, fontFamily: "Geist" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <BrandMark size={56} />
            <span style={{ fontSize: 32, letterSpacing: -1 }}>{SITE.name}</span>
          </div>
          <div style={{ display: "flex", background: BRAND.lime, border: `4px solid ${BRAND.ink}`, borderRadius: 14, padding: "6px 18px", fontSize: 22 }}>{kicker}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", background: "#fff", border: `5px solid ${BRAND.ink}`, borderRadius: 28, boxShadow: `14px 14px 0 ${BRAND.ink}`, padding: "36px 44px", margin: "0 14px 14px 0" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
            <div style={{ width: 20, height: 20, borderRadius: 20, background: BRAND.claude, border: `3px solid ${BRAND.ink}` }} />
            <div style={{ width: 20, height: 20, borderRadius: 20, background: BRAND.lime, border: `3px solid ${BRAND.ink}` }} />
            <div style={{ width: 20, height: 20, borderRadius: 20, background: BRAND.codex, border: `3px solid ${BRAND.ink}` }} />
          </div>
          <div style={{ display: "flex", fontSize: size, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
          {sub ? <div style={{ display: "flex", fontSize: 26, lineHeight: 1.4, color: BRAND.muted, marginTop: 18 }}>{sub}</div> : null}
        </div>
      </div>
    ),
    { ...ogSize, fonts: [{ name: "Geist", data: await sans, style: "normal", weight: 400 }] },
  );
}
