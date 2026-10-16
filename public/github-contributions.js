(() => {
  const widgets = document.querySelectorAll("[data-github-contributions]");
  if (!widgets.length) return;

  const apiBase = "https://github-contributions-api.jogruber.de/v4";
  const refreshInterval = 5 * 60 * 1000;
  const dayInMilliseconds = 24 * 60 * 60 * 1000;
  const monthFormatter = new Intl.DateTimeFormat("zh-CN", { month: "short", timeZone: "UTC" });
  const dayFormatter = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  const timeFormatter = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit" });

  const parseDate = (value) => new Date(`${value}T00:00:00Z`);

  const setAnimatedTotal = (target, total) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.textContent = total.toLocaleString("zh-CN");
      return;
    }
    const startedAt = performance.now();
    const duration = 650;
    const update = (time) => {
      const progress = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      target.textContent = Math.round(total * eased).toLocaleString("zh-CN");
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const readCache = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      return null;
    }
  };

  const writeCache = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
    } catch {
      // Rendering live data is still useful when storage is unavailable.
    }
  };

  const showTooltip = (widget, cell) => {
    const tooltip = widget.querySelector("[data-contribution-tooltip]");
    if (!tooltip) return;
    tooltip.textContent = cell.dataset.label || "";
    tooltip.hidden = false;
    const rect = cell.getBoundingClientRect();
    const width = tooltip.offsetWidth;
    const left = Math.min(window.innerWidth - width - 12, Math.max(12, rect.left + rect.width / 2 - width / 2));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.max(12, rect.top - tooltip.offsetHeight - 9)}px`;
  };

  const hideTooltip = (widget) => {
    const tooltip = widget.querySelector("[data-contribution-tooltip]");
    if (tooltip) tooltip.hidden = true;
  };

  const render = (widget, data, { fromCache = false, checkedAt = Date.now() } = {}) => {
    const contributions = Array.isArray(data?.contributions)
      ? data.contributions.filter((item) => item?.date && Number.isFinite(Number(item.count)))
      : [];
    if (!contributions.length) throw new Error("Empty contribution response");

    contributions.sort((a, b) => a.date.localeCompare(b.date));
    const grid = widget.querySelector("[data-contribution-grid]");
    const months = widget.querySelector("[data-contribution-months]");
    const totalTarget = widget.querySelector("[data-contribution-total]");
    const stateTarget = widget.querySelector("[data-contribution-state]");
    const rangeTarget = widget.querySelector("[data-contribution-range]");
    if (!grid || !months || !totalTarget || !stateTarget || !rangeTarget) return;

    const firstDate = parseDate(contributions[0].date);
    const lastDate = parseDate(contributions.at(-1).date);
    const calendarStart = new Date(firstDate);
    calendarStart.setUTCDate(calendarStart.getUTCDate() - calendarStart.getUTCDay());
    const weekCount = Math.floor((lastDate - calendarStart) / dayInMilliseconds / 7) + 1;
    const total = contributions.reduce((sum, item) => sum + Number(item.count), 0);
    const monthPositions = new Map();

    grid.replaceChildren();
    months.replaceChildren();
    grid.style.setProperty("--weeks", String(weekCount));
    months.style.setProperty("--weeks", String(weekCount));

    contributions.forEach((item) => {
      const date = parseDate(item.date);
      const week = Math.floor((date - calendarStart) / dayInMilliseconds / 7) + 1;
      const cell = document.createElement("span");
      const count = Number(item.count);
      const level = Math.max(0, Math.min(4, Number(item.level) || 0));
      const label = `${dayFormatter.format(date)}：${count} 次贡献`;
      cell.className = "contribution-cell";
      cell.dataset.level = String(level);
      cell.dataset.label = label;
      cell.title = label;
      cell.style.gridColumn = String(week);
      cell.style.gridRow = String(date.getUTCDay() + 1);
      cell.style.setProperty("--cell-delay", `${Math.min(week * 9 + date.getUTCDay() * 5, 520)}ms`);
      cell.addEventListener("mouseenter", () => showTooltip(widget, cell));
      cell.addEventListener("mouseleave", () => hideTooltip(widget));
      grid.append(cell);

      const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      if (!monthPositions.has(monthKey)) monthPositions.set(monthKey, { date, week });
    });

    monthPositions.forEach(({ date, week }) => {
      const label = document.createElement("span");
      label.textContent = monthFormatter.format(date);
      label.style.gridColumn = `${week} / span 4`;
      months.append(label);
    });

    setAnimatedTotal(totalTarget, total);
    stateTarget.textContent = fromCache
      ? `缓存于 ${timeFormatter.format(checkedAt)} · 正在检查`
      : `已检查 · ${timeFormatter.format(checkedAt)}`;
    rangeTarget.textContent = `${dayFormatter.format(firstDate)} - ${dayFormatter.format(lastDate)}`;
    grid.setAttribute("aria-label", `${widget.dataset.username} 过去一年共有 ${total} 次公开贡献`);
    grid.classList.remove("is-loading");
    widget.classList.remove("has-error");
    widget.setAttribute("aria-busy", "false");
    requestAnimationFrame(() => grid.classList.add("is-ready"));

    const scroller = widget.querySelector(".contribution-scroll");
    if (scroller && scroller.scrollWidth > scroller.clientWidth) scroller.scrollLeft = scroller.scrollWidth;
  };

  const requestLatest = async (widget, cached) => {
    const username = widget.dataset.username;
    const stateTarget = widget.querySelector("[data-contribution-state]");
    const refreshButton = widget.querySelector("[data-contribution-refresh]");
    const cacheKey = `github-contributions:${username}:v2`;
    if (widget.dataset.refreshing === "true") return;
    widget.dataset.refreshing = "true";
    widget.setAttribute("aria-busy", "true");
    if (stateTarget) stateTarget.textContent = "正在检查 GitHub";
    if (refreshButton) {
      refreshButton.disabled = true;
      refreshButton.classList.add("is-loading");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${apiBase}/${encodeURIComponent(username)}?y=last`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`GitHub contribution request failed: ${response.status}`);
      const data = await response.json();
      const checkedAt = Date.now();
      render(widget, data, { checkedAt });
      writeCache(cacheKey, data);
      widget.dataset.lastChecked = String(checkedAt);
    } catch {
      if (cached?.data) {
        render(widget, cached.data, { fromCache: true, checkedAt: cached.savedAt });
        widget.classList.add("has-error");
        if (stateTarget) stateTarget.textContent = `接口延迟 · 缓存于 ${timeFormatter.format(cached.savedAt)}`;
      } else {
        widget.setAttribute("aria-busy", "false");
        widget.classList.add("has-error");
        if (stateTarget) stateTarget.textContent = "暂时无法同步";
      }
    } finally {
      clearTimeout(timeout);
      widget.dataset.refreshing = "false";
      if (refreshButton) {
        refreshButton.disabled = false;
        refreshButton.classList.remove("is-loading");
      }
    }
  };

  const load = (widget) => {
    const username = widget.dataset.username;
    const cacheKey = `github-contributions:${username}:v2`;
    const legacyCacheKey = `github-contributions:${username}:v1`;
    const cached = readCache(cacheKey) ?? readCache(legacyCacheKey);
    if (cached?.data) render(widget, cached.data, { fromCache: true, checkedAt: cached.savedAt });
    widget.querySelector("[data-contribution-refresh]")?.addEventListener("click", () => {
      const latestCache = readCache(cacheKey) ?? readCache(legacyCacheKey);
      requestLatest(widget, latestCache);
    });
    requestLatest(widget, cached);
  };

  widgets.forEach(load);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    widgets.forEach((widget) => {
      const lastChecked = Number(widget.dataset.lastChecked || 0);
      if (Date.now() - lastChecked < refreshInterval) return;
      const cacheKey = `github-contributions:${widget.dataset.username}:v2`;
      requestLatest(widget, readCache(cacheKey));
    });
  });
})();
