# Self-hosted type

These files are unmodified Latin WOFF2 subsets from Fontsource packages pinned to **5.3.0**. Each family is licensed under the **SIL Open Font License 1.1**; the original copyright notices and full licenses are included beside the fonts. No runtime CDN requests or font package dependencies are required.

| Family | Role | Weight | File size | Package |
| --- | --- | --- | ---: | --- |
| Barlow Condensed | Large display text | 700 | 22,444 bytes | `@fontsource/barlow-condensed@5.3.0` |
| Space Grotesk | Latin interface and text | Variable 300–700 | 22,288 bytes | `@fontsource-variable/space-grotesk@5.3.0` |
| IBM Plex Mono | Metadata and code | 400 | 14,708 bytes | `@fontsource/ibm-plex-mono@5.3.0` |
| IBM Plex Mono | Emphasized metadata | 500 | 14,888 bytes | `@fontsource/ibm-plex-mono@5.3.0` |

The four font files total **74,328 bytes (72.6 KiB)**. Use `/fonts/fonts.css` once in the shared layout. Every face uses `font-display: swap`; preload only the display face used by the cover, rather than fetching every weight eagerly:

```html
<link rel="preload" href="/fonts/barlow-condensed-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin />
```

Recommended families:

```css
--font-display: 'Barlow Condensed', 'Arial Narrow', sans-serif;
--font-ui: 'Space Grotesk', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
--font-mono: 'IBM Plex Mono', Consolas, monospace;
```

## Chinese text

Phase 1 uses the installed Chinese fonts in the fallback stack. **Noto Sans SC is not bundled** in this directory. This avoids adding a large full CJK download or freezing a hand-picked character subset that would silently become incomplete as articles grow. Future CJK self-hosting should ship stable Unicode-range chunks with a reproducible subset process, retain its OFL license, and measure actual per-page transfer costs. Do not preload a full Chinese font.

## Source and provenance

Versions and OFL-1.1 metadata were checked against the npm registry; files and licenses were fetched from the versioned jsDelivr mirror of those exact Fontsource packages. No package installation or lifecycle script was run.

- [Barlow Condensed package, version 5.3.0](https://www.npmjs.com/package/@fontsource/barlow-condensed/v/5.3.0) · [Fontsource family](https://fontsource.org/fonts/barlow-condensed) · [Upstream project](https://github.com/jpt/barlow)
- [Space Grotesk package, version 5.3.0](https://www.npmjs.com/package/@fontsource-variable/space-grotesk/v/5.3.0) · [Fontsource family and license](https://fontsource.org/fonts/space-grotesk/about) · [Upstream project](https://github.com/floriankarsten/space-grotesk)
- [IBM Plex Mono package, version 5.3.0](https://www.npmjs.com/package/@fontsource/ibm-plex-mono/v/5.3.0) · [Fontsource family and license](https://fontsource.org/fonts/ibm-plex-mono/about) · [IBM typeface documentation](https://www.ibm.com/design/language/typography/typeface/)

Exact download URL pattern:

```text
https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-700-normal.woff2
https://cdn.jsdelivr.net/npm/@fontsource-variable/space-grotesk@5.3.0/files/space-grotesk-latin-wght-normal.woff2
https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-mono@5.3.0/files/ibm-plex-mono-latin-400-normal.woff2
https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-mono@5.3.0/files/ibm-plex-mono-latin-500-normal.woff2
```

The license source is `/LICENSE` in the corresponding versioned package; local filenames identify the family.

## Integrity

All font files have the `wOF2` file signature. SHA-256 checksums:

```text
3787a5a419171630e6890cfa47c4da067474d005cd0ff8dc11ec090fdc3ee2b8  barlow-condensed-latin-700-normal.woff2
0640890476fc1198ab4de571fb658de443c4d85b66466ec09534a8737ab1ce9d  space-grotesk-latin-wght-normal.woff2
08949f728dc52d528e69b1667d15c89a5686a4ee9a296ff90983985f99c380f7  ibm-plex-mono-latin-400-normal.woff2
01d285447409c8a588692162439a038b8cbd7871309ee20267b0d2d91c6e8e22  ibm-plex-mono-latin-500-normal.woff2
```
