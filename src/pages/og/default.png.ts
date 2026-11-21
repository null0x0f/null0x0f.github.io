import type { APIRoute } from "astro";
import sharp from "sharp";

export const prerender = true;

// Local share artwork follows the desktop window theme without external assets.
export const GET: APIRoute = async () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#bfd4da"/></pattern></defs>
    <rect width="1200" height="630" fill="#f1f6f7"/>
    <rect width="1200" height="630" fill="url(#grid)"/>
    <rect x="80" y="70" width="1040" height="500" rx="5" fill="#dcebee"/>
    <rect x="68" y="58" width="1040" height="500" rx="5" fill="#f7fbfc" stroke="#91bec9" stroke-width="2"/>
    <path d="M73 58h1030q5 0 5 5v43H68V63q0-5 5-5Z" fill="#d5ecf1"/>
    <path d="M68 106h1040" stroke="#91bec9"/>
    <text x="94" y="90" font-family="monospace" font-size="18" fill="#203b46">FD / PERSONAL SPACE</text>
    <text x="960" y="90" font-family="monospace" font-size="16" fill="#56717c">about.txt</text>
    <text x="110" y="262" font-family="monospace" font-size="85" font-weight="700" letter-spacing="-5" fill="#203b46">/felix.ding</text>
    <text x="116" y="329" font-family="sans-serif" font-size="34" fill="#56717c">Software &amp; Systems Engineer</text>
    <path d="M116 373h86" stroke="#237f95" stroke-width="5"/>
    <text x="116" y="440" font-family="monospace" font-size="23" fill="#203b46">C++ / Qt / Embedded / Fieldbus</text>
    <text x="116" y="503" font-family="monospace" font-size="16" letter-spacing="2" fill="#718994">BUILD. LEARN. LEAVE A TRACE.</text>
    <rect x="940" y="400" width="105" height="105" rx="3" fill="#d5ecf1" stroke="#91bec9"/>
    <text x="992" y="470" text-anchor="middle" font-family="monospace" font-size="50" fill="#237f95">FD</text>
  </svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
