(() => {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(pointer: fine)");
  const wide = matchMedia("(min-width: 981px)");
  const workspace = document.querySelector("[data-desktop-workspace]");
  const windows = [...document.querySelectorAll(".desktop-window")];
  const movable = windows.filter((window) => window.hasAttribute("data-window-movable"));
  const header = document.querySelector(".site-header");
  const sceneToggle = document.querySelector("[data-scene-toggle]");
  let scenePaused = false;
  try { scenePaused = localStorage.getItem("scene-paused") === "true"; } catch {}
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let dragging = null;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));
  const sceneIsRunning = () => !scenePaused && !reduced.matches && !document.hidden && !document.body.classList.contains("search-open");
  const canAnimate = () => sceneIsRunning() && fine.matches;

  const paintScene = () => {
    frame = 0;
    const enabled = canAnimate();
    root.style.setProperty("--scene-x", `${enabled ? pointerX : 0}px`);
    root.style.setProperty("--scene-y", `${enabled ? pointerY : 0}px`);
    root.style.setProperty("--scene-scroll", `${enabled ? Math.min(scrollY * .055, 60) : 0}px`);
    root.style.setProperty("--scene-tilt-x", `${enabled ? -pointerY * .1 : 0}deg`);
    root.style.setProperty("--scene-tilt-y", `${enabled ? pointerX * .08 : 0}deg`);
  };
  const queueScene = () => { if (!frame) frame = requestAnimationFrame(paintScene); };
  const updateScenePlayback = () => {
    const running = sceneIsRunning();
    root.style.setProperty("--scene-play-state", running ? "running" : "paused");
    if (sceneToggle) {
      sceneToggle.hidden = false;
      sceneToggle.disabled = reduced.matches;
      sceneToggle.setAttribute("aria-pressed", String(!scenePaused && !reduced.matches));
      sceneToggle.title = reduced.matches ? "已按系统设置减少动态效果" : scenePaused ? "播放背景动画" : "暂停背景动画";
      sceneToggle.querySelector("[data-scene-pause]").toggleAttribute("hidden", scenePaused || reduced.matches);
      sceneToggle.querySelector("[data-scene-play]").toggleAttribute("hidden", !scenePaused && !reduced.matches);
    }
    queueScene();
  };
  sceneToggle?.addEventListener("click", () => {
    scenePaused = !scenePaused;
    try { localStorage.setItem("scene-paused", String(scenePaused)); } catch {}
    updateScenePlayback();
  });
  new MutationObserver(updateScenePlayback).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("pointermove", (event) => {
    if (!canAnimate() || dragging || event.pointerType === "touch") return;
    pointerX = (event.clientX / innerWidth - .5) * 16;
    pointerY = (event.clientY / innerHeight - .5) * 12;
    queueScene();
  }, { passive: true });
  document.addEventListener("pointerleave", () => { pointerX = pointerY = 0; queueScene(); });
  addEventListener("scroll", queueScene, { passive: true });

  const resetPosition = (window) => {
    window.style.setProperty("--window-x", "0px");
    window.style.setProperty("--window-y", "0px");
    window.closest(".window-slot")?.style.removeProperty("z-index");
  };
  const setExpanded = (window, expanded) => {
    const body = window.querySelector("[data-window-body]");
    const button = window.querySelector("[data-window-toggle]");
    if (!body || !button) return;
    body.hidden = !expanded;
    button.textContent = expanded ? "−" : "+";
    button.setAttribute("aria-expanded", String(expanded));
    button.setAttribute("aria-label", `${expanded ? "收起" : "展开"}${window.dataset.windowTitle || "内容"}窗口`);
  };
  windows.forEach((window) => {
    window.querySelector("[data-window-toggle]")?.addEventListener("click", () => {
      setExpanded(window, window.querySelector("[data-window-body]")?.hidden ?? false);
    });
  });
  const endDrag = () => {
    if (!dragging) return;
    const { window, handle, pointerId } = dragging;
    dragging = null;
    window.classList.remove("is-dragging");
    document.body.classList.remove("is-window-dragging");
    if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
  };
  movable.forEach((window) => {
    const handle = window.querySelector("[data-window-handle]");
    if (!handle || !workspace) return;
    handle.addEventListener("pointerdown", (event) => {
      if (!fine.matches || !wide.matches || event.button !== 0 || event.pointerType === "touch" || event.target.closest("button, a, input")) return;
      endDrag();
      const rect = window.getBoundingClientRect();
      const x = parseFloat(window.style.getPropertyValue("--window-x")) || 0;
      const y = parseFloat(window.style.getPropertyValue("--window-y")) || 0;
      dragging = { window, handle, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x, y, baseLeft: rect.left - x, baseTop: rect.top - y, width: rect.width };
      document.querySelectorAll(".window-slot").forEach((slot) => slot.style.removeProperty("z-index"));
      const slot = window.closest(".window-slot");
      if (slot) slot.style.zIndex = "5";
      window.classList.add("is-dragging");
      document.body.classList.add("is-window-dragging");
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    handle.addEventListener("pointermove", (event) => {
      if (!dragging || dragging.window !== window || event.pointerId !== dragging.pointerId) return;
      const bounds = workspace.getBoundingClientRect();
      const { baseLeft, baseTop, width, x, y, startX, startY } = dragging;
      const nextX = clamp(x + event.clientX - startX, Math.max(8, bounds.left) - baseLeft, Math.min(innerWidth - 8, bounds.right) - baseLeft - width);
      const nextY = clamp(y + event.clientY - startY, Math.max((header?.clientHeight || 0) + 8, bounds.top) - baseTop, Math.min(innerHeight - 48, bounds.bottom - 48) - baseTop);
      window.style.setProperty("--window-x", `${nextX}px`);
      window.style.setProperty("--window-y", `${nextY}px`);
    });
    handle.addEventListener("pointerup", endDrag);
    handle.addEventListener("pointercancel", endDrag);
    handle.addEventListener("lostpointercapture", endDrag);
    handle.addEventListener("dblclick", (event) => {
      if (event.target.closest("button, a")) return;
      endDrag();
      resetPosition(window);
    });
  });
  document.querySelector("[data-workspace-reset]")?.addEventListener("click", () => {
    endDrag();
    windows.forEach((window) => { resetPosition(window); setExpanded(window, true); });
    const status = document.querySelector("[data-workspace-status]");
    if (status) status.textContent = "桌面已恢复默认布局，所有窗口已展开。";
  });
  const resetViewport = () => { endDrag(); movable.forEach(resetPosition); pointerX = pointerY = 0; queueScene(); };
  addEventListener("resize", resetViewport, { passive: true });
  addEventListener("blur", () => { endDrag(); pointerX = pointerY = 0; queueScene(); });
  fine.addEventListener("change", resetViewport);
  wide.addEventListener("change", resetViewport);

  const clock = document.querySelector("[data-local-clock]");
  const role = document.querySelector("[data-rotating-role]");
  const roles = ["C++ Systems", "Qt Applications", "Embedded Devices", "Industrial I/O"];
  const clockFormat = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  let clockTimer;
  let roleTimer;
  let roleSwap;
  let roleIndex = 0;
  const updateClock = () => {
    clearTimeout(clockTimer);
    if (!clock || document.hidden) return;
    const now = new Date();
    clock.textContent = clockFormat.format(now);
    clock.dateTime = now.toISOString();
    clockTimer = setTimeout(updateClock, 60000 - now.getSeconds() * 1000 - now.getMilliseconds());
  };
  const rotateRole = () => {
    if (!role || reduced.matches || document.hidden) return;
    role.classList.add("is-changing");
    roleSwap = setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      role.textContent = roles[roleIndex];
      role.classList.remove("is-changing");
      roleTimer = setTimeout(rotateRole, 3800);
    }, 180);
  };
  const updateMotion = () => {
    clearTimeout(roleTimer);
    clearTimeout(roleSwap);
    role?.classList.remove("is-changing");
    if (role && !reduced.matches && !document.hidden) roleTimer = setTimeout(rotateRole, 3800);
    if (document.hidden) endDrag();
    updateScenePlayback();
    updateClock();
  };
  reduced.addEventListener("change", updateMotion);
  document.addEventListener("visibilitychange", updateMotion);
  updateMotion();
})();
