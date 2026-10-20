import type { APIRoute } from "astro";
import sharp from "sharp";

export const prerender = true;

// A local PNG is supported by sharing crawlers without relying on remote image services.
export const GET: APIRoute = async () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#eadfd0" stroke-width="1"/></pattern></defs>
    <rect width="1200" height="630" fill="#fff8f0"/>
    <rect width="1200" height="630" fill="url(#grid)"/>
    <rect x="72" y="64" width="1060" height="502" rx="24" fill="#1a1a1a"/>
    <rect x="64" y="56" width="1060" height="502" rx="24" fill="#fffdf9" stroke="#1a1a1a" stroke-width="3"/>
    <rect x="108" y="100" width="72" height="72" rx="16" fill="#ff8c5a" stroke="#1a1a1a" stroke-width="3"/>
    <text x="144" y="148" text-anchor="middle" font-family="sans-serif" font-size="34" font-weight="700" fill="#1a1a1a">JN</text>
    <text x="206" y="143" font-family="sans-serif" font-size="23" letter-spacing="3" fill="#66615d">ENGINEERING JOURNAL</text>
    <text x="106" y="290" font-family="sans-serif" font-size="86" font-weight="700" letter-spacing="-3" fill="#1a1a1a">Jackie Null</text>
    <text x="110" y="351" font-family="sans-serif" font-size="37" fill="#57534e">Software &amp; Systems</text>
    <path d="M110 389h128" stroke="#ff6b35" stroke-width="8" stroke-linecap="round"/>
    <text x="110" y="460" font-family="sans-serif" font-size="25" fill="#57534e">C++ / Qt / Embedded / Industrial Software</text>
    <text x="110" y="509" font-family="sans-serif" font-size="21" fill="#78716c">Technical writing &amp; weekly notes</text>
    <path d="m955 235-54 54 54 54m50-108 54 54-54 54" fill="none" stroke="#ff6b35" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="1034" cy="451" r="23" fill="#fbbf24" stroke="#1a1a1a" stroke-width="3"/>
  </svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
