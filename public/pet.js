(() => {
  const pet = document.querySelector("[data-blog-pet]");
  if (!pet) return;
  const sprite = pet.querySelector("[data-pet-sprite]");
  const stage = pet.querySelector("[data-pet-stage]");
  const touch = pet.querySelector("[data-pet-touch]");
  const minimize = pet.querySelector("[data-pet-minimize]");
  const restore = pet.querySelector("[data-pet-restore]");
  const bubble = pet.querySelector("[data-pet-message]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const storageKey = "blog-pet-minimized";
  // 原图 8 列 × 9 行，每帧 192 × 208；仅播放有图像的单元。
  const actions = {
    idle: { row: 0, frames: 6, interval: 180 },
    wave: { row: 3, frames: 4, interval: 180 },
    happy: { row: 4, frames: 5, interval: 150 }
  };
  const messages = ["喵～很高兴见到你。", "慢慢来，问题总会解决的。", "盯屏幕久了，记得休息一下。", "今天也有新的收获吗？"];
  let minimized = false;
  let ready = false;
  let frameTimer;
  let idleTimer;
  let messageTimer;
  let messageIndex = 0;
  let lastInteraction = 0;
  try { minimized = localStorage.getItem(storageKey) === "true"; } catch { /* 禁用存储时仍可正常使用。 */ }
  const paused = () => !ready || minimized || document.hidden || document.body.classList.contains("search-open");
  const frame = (row, column) => { sprite.style.setProperty("--pet-row", String(row)); sprite.style.setProperty("--pet-column", String(column)); };
  const stop = () => { clearTimeout(frameTimer); clearTimeout(idleTimer); };
  const hideMessage = () => { clearTimeout(messageTimer); bubble.hidden = true; bubble.textContent = ""; };
  const scheduleIdle = () => {
    clearTimeout(idleTimer);
    if (!paused() && !reducedMotion.matches) idleTimer = setTimeout(() => play("idle"), 6200);
  };
  const play = (name, cycles = 1) => {
    stop();
    if (paused() || reducedMotion.matches) { frame(0, 0); return; }
    const action = actions[name];
    let current = 0;
    const tick = () => {
      if (paused() || reducedMotion.matches) { stop(); frame(0, 0); return; }
      frame(action.row, current % action.frames);
      current += 1;
      if (current < action.frames * cycles) frameTimer = setTimeout(tick, action.interval);
      else frameTimer = setTimeout(() => { frame(0, 0); scheduleIdle(); }, action.interval);
    };
    tick();
  };
  const showMessage = () => {
    clearTimeout(messageTimer);
    bubble.hidden = false;
    bubble.textContent = messages[messageIndex++ % messages.length];
    messageTimer = setTimeout(hideMessage, 4000);
  };
  const setMinimized = (value, moveFocus = false) => {
    minimized = value;
    pet.dataset.minimized = String(value);
    stage.hidden = value;
    restore.hidden = !value;
    document.body.classList.toggle("pet-is-minimized", value);
    stop(); hideMessage(); frame(0, 0);
    try { localStorage.setItem(storageKey, String(value)); } catch { /* 不依赖浏览器存储。 */ }
    if (moveFocus) (value ? restore : touch).focus({ preventScroll: true });
    if (!value) play("wave");
  };
  touch.addEventListener("click", () => { lastInteraction = Date.now(); showMessage(); play("happy", 2); });
  touch.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch" || Date.now() - lastInteraction < 5000) return;
    lastInteraction = Date.now(); play("wave");
  });
  minimize.addEventListener("click", () => setMinimized(true, true));
  restore.addEventListener("click", () => setMinimized(false, true));
  const syncPlayback = () => { stop(); frame(0, 0); if (paused()) hideMessage(); else scheduleIdle(); };
  document.addEventListener("visibilitychange", syncPlayback);
  reducedMotion.addEventListener("change", syncPlayback);
  // 搜索打开时隐藏宠物并暂停帧计时。
  let searchOpen = document.body.classList.contains("search-open");
  const searchObserver = new MutationObserver(() => {
    const isOpen = document.body.classList.contains("search-open");
    if (isOpen === searchOpen) return;
    searchOpen = isOpen;
    syncPlayback();
  });
  searchObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  const image = new Image();
  image.onload = () => {
    ready = true;
    document.body.classList.add("has-blog-pet");
    setMinimized(minimized);
    pet.hidden = false;
  };
  image.onerror = () => { stop(); pet.hidden = true; document.body.classList.remove("has-blog-pet", "pet-is-minimized"); searchObserver.disconnect(); };
  image.src = pet.dataset.sprite;
})();
