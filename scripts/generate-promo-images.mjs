import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const outputDir = join(process.cwd(), 'public', 'promo-images');
const iconPath = join(process.cwd(), 'src', 'assets', 'edit-page-icon.svg');
const heroPath = join(process.cwd(), 'public', 'edit-page-direct-edit-demo.png');

await mkdir(outputDir, { recursive: true });

const rounded = async (path, width, height, radius) => {
  const mask = Buffer.from(`<svg width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${radius}" fill="#fff"/></svg>`);
  return sharp(path)
    .resize(width, height, { fit: 'cover' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
};

const shadow = (width, height, radius, opacity = 0.18) => Buffer.from(`
  <svg width="${width + 80}" height="${height + 80}">
    <defs><filter id="s" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#17366f" flood-opacity="${opacity}"/></filter></defs>
    <rect x="40" y="22" width="${width}" height="${height}" rx="${radius}" fill="#fff" filter="url(#s)"/>
  </svg>`);

const smallBackground = Buffer.from(`
  <svg width="440" height="280" viewBox="0 0 440 280" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fbff"/><stop offset=".55" stop-color="#eaf2ff"/><stop offset="1" stop-color="#eee8ff"/></linearGradient>
      <radialGradient id="glow"><stop stop-color="#1769ff" stop-opacity=".18"/><stop offset="1" stop-color="#1769ff" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="440" height="280" fill="url(#bg)"/>
    <circle cx="390" cy="25" r="190" fill="url(#glow)"/>
    <text x="70" y="39" fill="#10182b" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="17" font-weight="750">Edit Page</text>
    <text x="28" y="105" fill="#0b1224" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="34" font-weight="800" letter-spacing="-1.7">
      <tspan x="28">Edit any</tspan><tspan x="28" dy="40" fill="#1769ff">webpage.</tspan>
    </text>
    <text x="29" y="177" fill="#647089" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12.5" font-weight="550">Edit text · Replace images</text>
    <text x="29" y="196" fill="#647089" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12.5" font-weight="550">Remove elements · Capture pages</text>
    <rect x="28" y="220" width="128" height="31" rx="15.5" fill="#1769ff"/>
    <text x="92" y="240" text-anchor="middle" fill="#fff" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11.5" font-weight="750">Edit right on the page</text>
  </svg>`);

const marqueeBackground = Buffer.from(`
  <svg width="1400" height="560" viewBox="0 0 1400 560" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fbfdff"/><stop offset=".52" stop-color="#edf4ff"/><stop offset="1" stop-color="#eee8ff"/></linearGradient>
      <radialGradient id="glow"><stop stop-color="#1769ff" stop-opacity=".20"/><stop offset="1" stop-color="#1769ff" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1400" height="560" fill="url(#bg)"/>
    <circle cx="1190" cy="60" r="420" fill="url(#glow)"/>
    <circle cx="625" cy="535" r="250" fill="url(#glow)" opacity=".45"/>
    <text x="120" y="101" fill="#10182b" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="28" font-weight="760">Edit Page</text>
    <text x="78" y="222" fill="#0b1224" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="68" font-weight="820" letter-spacing="-3.2">
      <tspan x="78">Edit anything.</tspan><tspan x="78" dy="78" fill="#1769ff">On any webpage.</tspan>
    </text>
    <text x="82" y="354" fill="#5f6b83" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="520">
      <tspan x="82">Edit text, replace images, remove elements,</tspan><tspan x="82" dy="31">and capture full-page screenshots.</tspan>
    </text>
    <rect x="82" y="439" width="168" height="43" rx="21.5" fill="#1769ff"/>
    <text x="166" y="466" text-anchor="middle" fill="#fff" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="750">No account required</text>
    <rect x="262" y="439" width="157" height="43" rx="21.5" fill="#fff" stroke="#cdddf9"/>
    <text x="340.5" y="466" text-anchor="middle" fill="#3e526f" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700">Private by design</text>
  </svg>`);

const iconSmall = await sharp(iconPath).resize(32, 32).png().toBuffer();
const iconLarge = await sharp(iconPath).resize(48, 48).png().toBuffer();
const heroSmall = await rounded(heroPath, 292, 183, 12);
const heroLarge = await rounded(heroPath, 650, 406, 20);

await sharp(smallBackground)
  .composite([
    { input: iconSmall, left: 28, top: 17 },
    { input: shadow(292, 183, 12, 0.14), left: 184, top: 74 },
    { input: heroSmall, left: 224, top: 96 },
  ])
  .removeAlpha()
  .png({ compressionLevel: 9, palette: false })
  .toColourspace('srgb')
  .toFile(join(outputDir, 'Edit_Page_Small_Promo_Tile_440x280.png'));

await sharp(marqueeBackground)
  .composite([
    { input: iconLarge, left: 64, top: 68 },
    { input: shadow(650, 406, 20, 0.18), left: 650, top: 43 },
    { input: heroLarge, left: 690, top: 65 },
  ])
  .removeAlpha()
  .png({ compressionLevel: 9, palette: false })
  .toColourspace('srgb')
  .toFile(join(outputDir, 'Edit_Page_Marquee_Promo_Tile_1400x560.png'));

console.log(outputDir);
