export const normalizeSearchText = (value = "") => value.normalize("NFKC").toLowerCase();

// Split on whitespace only: C++, std::vector and driver_function stay intact.
export const getSearchTokens = (query = "") => [...new Set(normalizeSearchText(query).trim().split(/\s+/).filter(Boolean))];

export const prepareSearchItems = (items) => items.map((item) => ({
  ...item,
  search: {
    title: normalizeSearchText(item.title),
    meta: normalizeSearchText(`${item.type} ${item.meta}`),
    description: normalizeSearchText(item.description),
    body: normalizeSearchText(item.body)
  }
}));

export const scoreSearchItem = (item, tokens) => {
  const fields = item.search;
  let score = 0;
  for (const token of tokens) {
    if (fields.title.startsWith(token)) score += 80;
    else if (fields.title.includes(token)) score += 48;
    else if (fields.meta.includes(token)) score += 22;
    else if (fields.description.includes(token)) score += 10;
    else if (fields.body.includes(token)) score += 4;
    else return -1;
  }
  return score;
};

export const getSearchPreview = (item, tokens) => {
  if (!tokens.length || tokens.every((token) => item.search.description.includes(token))) {
    return { text: item.description, bodyMatch: false };
  }

  const bodyTokens = tokens.filter((token) => item.search.body.includes(token));
  if (!bodyTokens.length) return { text: item.description, bodyMatch: false };

  // Prefer terms that explain why a result was found only inside the article.
  const bodyOnly = bodyTokens.filter((token) => ![item.search.title, item.search.meta, item.search.description].some((field) => field.includes(token)));
  const focusTokens = bodyOnly.length ? bodyOnly : bodyTokens;
  const candidates = focusTokens.map((token) => ({ position: item.search.body.indexOf(token), length: token.length }));
  const windowSize = Math.max(180, ...focusTokens.map((token) => token.length + 50));
  let best = candidates[0];
  let bestScore = -1;
  for (const candidate of candidates) {
    const start = Math.max(0, candidate.position - 40);
    const excerpt = item.search.body.slice(start, Math.max(start + windowSize, candidate.position + candidate.length));
    const score = bodyTokens.reduce((total, token) => total + Number(excerpt.includes(token)), 0);
    if (score > bestScore) { best = candidate; bestScore = score; }
  }

  // body is NFKC-normalized by the index builder; retain its original case.
  const start = Math.max(0, best.position - 40);
  const end = Math.min(item.body.length, Math.max(start + windowSize, best.position + best.length));
  return {
    text: `${start ? "…" : ""}${item.body.slice(start, end).trim()}${end < item.body.length ? "…" : ""}`,
    bodyMatch: true
  };
};

// Map normalized matches back to displayed text, including full-width input.
export const getHighlightRanges = (value, tokens) => {
  let normalized = "";
  const offsets = [];
  let offset = 0;
  for (const character of value) {
    const part = normalizeSearchText(character);
    for (let index = 0; index < part.length; index++) offsets.push([offset, offset + character.length]);
    normalized += part;
    offset += character.length;
  }
  const ranges = [];
  for (const token of tokens) {
    let start = normalized.indexOf(token);
    while (start !== -1) {
      ranges.push([offsets[start][0], offsets[start + token.length - 1][1]]);
      start = normalized.indexOf(token, start + token.length);
    }
  }
  const merged = [];
  for (const range of ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1])) {
    const previous = merged.at(-1);
    if (previous && range[0] <= previous[1]) previous[1] = Math.max(previous[1], range[1]);
    else merged.push(range);
  }
  return merged;
};
