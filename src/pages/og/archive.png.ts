import type { APIRoute } from "astro";
import sharp from "sharp";
import { siteInfo } from "@/lib/site";

export const prerender = true;
const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);
export const GET: APIRoute = async () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#F3F0E8"/>
    <text x="58" y="64" font-family="monospace" font-size="17" fill="#111110">THE UNFINISHED ARCHIVE</text>
    <path d="M58 90h1084" stroke="#111110" stroke-width="2"/>
    <text x="44" y="345" font-family="sans-serif" font-weight="900" font-size="276" letter-spacing="-19" fill="#111110">NULL</text>
    <text x="520" y="548" font-family="sans-serif" font-weight="900" font-size="208" letter-spacing="-12" fill="#111110">/ 0x0F</text>
    <rect x="58" y="397" width="21" height="116" fill="#FF4D00"/>
    <text x="101" y="439" font-family="sans-serif" font-size="24" fill="#111110">${escapeXml(siteInfo.author)}</text>
    <text x="101" y="479" font-family="monospace" font-size="15" fill="#666259">SOFTWARE / SYSTEMS / NOTES</text>
    <path d="M58 576h1084" stroke="#111110"/>
    <text x="58" y="608" font-family="monospace" font-size="14" fill="#666259">null0x0f.github.io</text>
  </svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
