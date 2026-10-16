const root = document.documentElement;
const storedTheme = localStorage.getItem("theme");
const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

root.dataset.theme = storedTheme || (preferredDark ? "dark" : "light");

const shortcutLabel = document.querySelector(".shortcut");
if (shortcutLabel && !/Mac|iPhone|iPad/.test(navigator.userAgent)) shortcutLabel.textContent = "Ctrl K";

const themeButton = document.querySelector("[data-theme-toggle]");
const updateThemeButton = () => {
  if (!themeButton) return;
  const isDark = root.dataset.theme === "dark";
  themeButton.textContent = isDark ? "☀" : "☾";
  themeButton.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
};

themeButton?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", root.dataset.theme);
  updateThemeButton();
});
updateThemeButton();

const header = document.querySelector(".site-header");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const backToTop = document.querySelector("[data-back-to-top]");
const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
  backToTop?.classList.toggle("is-visible", window.scrollY > Math.max(560, window.innerHeight * 0.7));
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
};
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector(".site-nav");
menuButton?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menuButton.textContent = isOpen ? "×" : "☰";
});

const searchDialog = document.querySelector("#site-search");
const searchInput = searchDialog?.querySelector("#site-search-input");
const searchResults = searchDialog?.querySelector("#search-results");
const searchSummary = searchDialog?.querySelector("[data-search-summary]");
const searchClear = searchDialog?.querySelector("[data-search-clear]");
let searchItems = [];
let searchLoaded = false;
let selectedSearchIndex = -1;

const normalizeSearchText = (value = "") => value.normalize("NFKC").toLowerCase();
const searchHistoryKey = "site-search-history";

const readSearchHistory = () => {
  try {
    const history = JSON.parse(localStorage.getItem(searchHistoryKey) || "[]");
    return Array.isArray(history) ? history.slice(0, 5) : [];
  } catch {
    return [];
  }
};

const rememberSearchResult = (href) => {
  const history = readSearchHistory().filter((item) => item !== href);
  history.unshift(href);
  localStorage.setItem(searchHistoryKey, JSON.stringify(history.slice(0, 5)));
};

const appendHighlightedText = (target, value, query) => {
  const tokens = [...new Set(query.trim().split(/\s+/).filter(Boolean))]
    .sort((a, b) => b.length - a.length)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!tokens.length) {
    target.textContent = value;
    return;
  }

  const expression = new RegExp(`(${tokens.join("|")})`, "gi");
  value.split(expression).filter(Boolean).forEach((part) => {
    if (expression.test(part)) {
      const mark = document.createElement("mark");
      mark.textContent = part;
      target.append(mark);
    } else {
      target.append(document.createTextNode(part));
    }
    expression.lastIndex = 0;
  });
};

const scoreSearchItem = (item, tokens) => {
  const title = normalizeSearchText(item.title);
  const description = normalizeSearchText(item.description);
  const meta = normalizeSearchText(item.meta);
  if (!tokens.every((token) => `${title} ${description} ${meta}`.includes(token))) return -1;
  return tokens.reduce((score, token) => {
    if (title.startsWith(token)) return score + 80;
    if (title.includes(token)) return score + 48;
    if (meta.includes(token)) return score + 22;
    return score + 10;
  }, 0);
};

const searchIndexReady = fetch("/search-index.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
    return response.json();
  })
  .then((items) => { searchItems = Array.isArray(items) ? items : []; })
  .catch(() => { searchItems = []; })
  .finally(() => {
    searchLoaded = true;
    if (searchDialog?.open) renderResults(searchInput?.value ?? "");
  });

const setSelectedSearchResult = (index) => {
  const results = [...(searchResults?.querySelectorAll(".search-result") ?? [])];
  if (!results.length) {
    selectedSearchIndex = -1;
    return;
  }
  selectedSearchIndex = (index + results.length) % results.length;
  results.forEach((result, resultIndex) => {
    const selected = resultIndex === selectedSearchIndex;
    result.classList.toggle("is-selected", selected);
    result.setAttribute("aria-selected", String(selected));
    if (selected) {
      searchInput?.setAttribute("aria-activedescendant", result.id);
      result.scrollIntoView({ block: "nearest" });
    }
  });
};

const renderResults = (query = "") => {
  if (!searchResults || !searchSummary) return;
  searchResults.replaceChildren();
  selectedSearchIndex = -1;
  searchInput?.removeAttribute("aria-activedescendant");
  if (searchClear) searchClear.hidden = !query;

  if (!searchLoaded) {
    searchSummary.textContent = "载入内容";
    const loading = document.createElement("div");
    const loadingTitle = document.createElement("strong");
    const loadingDetail = document.createElement("span");
    loading.className = "search-empty";
    loadingTitle.textContent = "正在准备搜索索引";
    loadingDetail.textContent = "...";
    loading.append(loadingTitle, loadingDetail);
    searchResults.append(loading);
    return;
  }

  const normalized = query.trim().toLowerCase();
  const tokens = normalizeSearchText(normalized).split(/\s+/).filter(Boolean);
  let items;

  if (tokens.length) {
    items = searchItems
      .map((item, index) => ({ item, index, score: scoreSearchItem(item, tokens) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, 12)
      .map(({ item }) => item);
    searchSummary.textContent = `${items.length} 个结果`;
  } else {
    const history = readSearchHistory();
    const recent = history.map((href) => searchItems.find((item) => item.href === href)).filter(Boolean);
    const rest = searchItems.filter((item) => !history.includes(item.href));
    items = [...recent, ...rest]
      .slice(0, 8);
    searchSummary.textContent = recent.length ? "最近访问" : "最近内容";
  }

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "search-empty";
    const title = document.createElement("strong");
    const detail = document.createElement("span");
    title.textContent = "没有匹配内容";
    detail.textContent = "换一个关键词或内容类型";
    empty.append(title, detail);
    searchResults.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item, index) => {
    const link = document.createElement("a");
    const top = document.createElement("div");
    const type = document.createElement("span");
    const title = document.createElement("strong");
    const description = document.createElement("p");
    const meta = document.createElement("span");
    const arrow = document.createElement("span");
    link.className = "search-result";
    link.id = `search-result-${index}`;
    link.href = item.href;
    link.role = "option";
    link.setAttribute("aria-selected", "false");
    top.className = "search-result-title";
    type.className = `search-result-type is-${item.kind}`;
    type.textContent = item.type;
    description.className = "search-result-description";
    meta.className = "search-result-meta";
    arrow.className = "search-result-arrow";
    arrow.textContent = "↗";
    arrow.setAttribute("aria-hidden", "true");
    appendHighlightedText(title, item.title, query);
    appendHighlightedText(description, item.description, query);
    meta.textContent = item.meta;
    top.append(type, title);
    link.append(top, description, meta, arrow);
    link.addEventListener("mouseenter", () => setSelectedSearchResult(index));
    link.addEventListener("click", () => rememberSearchResult(item.href));
    fragment.append(link);
  });
  searchResults.append(fragment);
};

const openSearch = async () => {
  if (!searchDialog) return;
  if (!searchDialog.open) searchDialog.showModal();
  document.body.classList.add("search-open");
  renderResults(searchInput?.value ?? "");
  requestAnimationFrame(() => searchInput?.focus());
  await searchIndexReady;
};

document.querySelector("[data-search-open]")?.addEventListener("click", openSearch);
document.querySelector("[data-search-close]")?.addEventListener("click", () => searchDialog?.close());
searchClear?.addEventListener("click", () => {
  if (!searchInput) return;
  searchInput.value = "";
  renderResults();
  searchInput.focus();
});
searchInput?.addEventListener("input", () => renderResults(searchInput.value));
searchInput?.addEventListener("keydown", (event) => {
  const results = searchResults?.querySelectorAll(".search-result") ?? [];
  if (event.key === "ArrowDown") {
    event.preventDefault();
    setSelectedSearchResult(selectedSearchIndex + 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    setSelectedSearchResult(selectedSearchIndex - 1);
  } else if (event.key === "Enter" && selectedSearchIndex >= 0) {
    event.preventDefault();
    results[selectedSearchIndex]?.click();
  }
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (searchDialog?.open) searchDialog.close();
    else openSearch();
  }
  if (event.key === "Escape" && searchDialog?.open) searchDialog.close();
});

searchDialog?.addEventListener("click", (event) => {
  if (event.target === searchDialog) searchDialog.close();
});
searchDialog?.addEventListener("close", () => document.body.classList.remove("search-open"));

const tocLinks = [...document.querySelectorAll(".toc a")];
if (tocLinks.length) {
  const headingLinks = tocLinks
    .map((link) => ({ link, heading: document.getElementById(decodeURIComponent(link.hash.slice(1))) }))
    .filter(({ heading }) => heading);
  const headingObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    headingLinks.forEach(({ link, heading }) => link.classList.toggle("is-active", heading === visible.target));
  }, { rootMargin: "-92px 0px -68%", threshold: 0 });
  headingLinks.forEach(({ heading }) => headingObserver.observe(heading));
}

document.querySelectorAll(".prose pre, .note-content pre").forEach((pre) => {
  if (pre.closest(".code-block")) return;
  const wrapper = document.createElement("div");
  const header = document.createElement("div");
  const label = document.createElement("span");
  const button = document.createElement("button");
  wrapper.className = "code-block";
  header.className = "code-head";
  button.className = "copy-code";
  button.type = "button";
  button.textContent = "复制";
  label.textContent = pre.dataset.language || "code";
  pre.before(wrapper);
  header.append(label, button);
  wrapper.append(header, pre);
});

document.querySelectorAll(".copy-code").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = button.closest(".code-block")?.querySelector("code")?.innerText || "";
    await navigator.clipboard.writeText(code);
    button.textContent = "已复制";
    setTimeout(() => { button.textContent = "复制"; }, 1400);
  });
});

const filterButtons = document.querySelectorAll("[data-filter]");
const archiveItems = document.querySelectorAll("[data-topic]");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    archiveItems.forEach((item) => { item.hidden = filter !== "all" && !item.dataset.topic.split(" ").includes(filter); });
    const visible = [...archiveItems].filter((item) => !item.hidden).length;
    const count = document.querySelector("[data-result-count]");
    if (count) count.textContent = `${visible} 篇内容`;
  });
});

const revealSelectors = [
  ".page-heading",
  ".archive-year",
  ".article-header",
  ".about-intro",
  ".about-content section"
];

document.querySelectorAll(revealSelectors.join(",")).forEach((target, index) => {
  if (!target.hasAttribute("data-reveal")) target.setAttribute("data-reveal", "");
  target.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
});

const revealTargets = document.querySelectorAll("[data-reveal]");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -4%", threshold: 0.02 });
  revealTargets.forEach((target) => revealObserver.observe(target));
}
