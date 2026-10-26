import { readFile, writeFile, copyFile } from "node:fs/promises";
import sharp from "sharp";

// Run from the repository root: node scripts/generate-brand-assets.mjs
const logo = await readFile("public/brand/logo.svg");
await copyFile("public/brand/logo.svg", "src/app/icon.svg");
for (const size of [192, 512]) {
  await sharp(logo).resize(size, size).png().toFile(`public/brand/icon-${size}.png`);
}
await sharp(logo).resize(148, 148).extend({ top: 16, bottom: 16, left: 16, right: 16, background: "#eef0ff" }).png().toFile("src/app/apple-icon.png");

// ICO directory entries can contain PNG images. Include small and high-DPI sizes.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => sharp(logo).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((png, i) => {
  const entry = 6 + i * 16;
  header[entry] = sizes[i];
  header[entry + 1] = sizes[i];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(png.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += png.length;
});
await writeFile("src/app/favicon.ico", Buffer.concat([header, ...images]));
