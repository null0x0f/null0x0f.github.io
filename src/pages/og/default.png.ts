import type { APIRoute } from "astro";
import sharp from "sharp";

export const prerender = true;

// Local share artwork uses the same restrained typography as the site.
export const GET: APIRoute = async () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#fafbfc"/>
    <text x="88" y="145" font-family="sans-serif" font-size="24" fill="#3e6d7a">Software &amp; Systems Engineer</text>
    <text x="80" y="292" font-family="sans-serif" font-size="108" font-weight="600" letter-spacing="-4" fill="#202a31">Felix Ding.</text>
    <text x="88" y="366" font-family="sans-serif" font-size="26" fill="#3e6d7a">C++ / Qt / Embedded / Fieldbus</text>
    <path d="M88 508h1024" stroke="#3e6d7a" stroke-opacity=".24" stroke-width="1"/>
    <text x="88" y="556" font-family="sans-serif" font-size="20" fill="#3e6d7a">null0x0f.github.io</text>
  </svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
