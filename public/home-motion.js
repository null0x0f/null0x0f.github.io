(() => {
  const hero = document.querySelector("[data-home-hero]");
  const canvas = hero?.querySelector("[data-system-canvas]");
  if (!hero || !canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let width = 0;
  let height = 0;
  let frame = 0;
  let visible = true;

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    start();
  };

  const drawGrid = (time, borderColor) => {
    const spacing = width < 720 ? 44 : 58;
    const shiftX = pointer.x * 7;
    const shiftY = pointer.y * 5;
    context.strokeStyle = borderColor;
    context.lineWidth = 1;
    context.globalAlpha = 0.45;
    context.beginPath();
    for (let x = ((shiftX % spacing) + spacing) % spacing; x < width; x += spacing) {
      context.moveTo(Math.round(x) + 0.5, 0);
      context.lineTo(Math.round(x) + 0.5, height);
    }
    for (let y = ((shiftY % spacing) + spacing) % spacing; y < height; y += spacing) {
      context.moveTo(0, Math.round(y) + 0.5);
      context.lineTo(width, Math.round(y) + 0.5);
    }
    context.stroke();

    context.globalAlpha = 0.16;
    const scanX = reducedMotion.matches ? width * 0.72 : ((time * 0.035) % (width + 160)) - 80;
    context.beginPath();
    context.moveTo(scanX, 0);
    context.lineTo(scanX, height);
    context.stroke();
  };

  const drawSignals = (time, accentColor) => {
    const startX = width < 760 ? width * 0.2 : width * 0.48;
    const signalWidth = width - startX + 12;
    const phase = reducedMotion.matches ? 0 : time * 0.001;
    context.strokeStyle = accentColor;
    context.fillStyle = accentColor;
    context.lineWidth = 1.25;

    for (let lane = 0; lane < 3; lane += 1) {
      const baseline = height * (0.3 + lane * 0.18) + pointer.y * (lane + 1) * 3;
      const amplitude = 9 + lane * 3;
      context.globalAlpha = 0.18 - lane * 0.025;
      context.beginPath();
      for (let x = startX; x <= width + 12; x += 5) {
        const localX = x - startX;
        const raw = Math.sin(localX * (0.024 + lane * 0.003) - phase * (0.72 + lane * 0.14));
        const stepped = raw > 0.52 ? -amplitude : raw < -0.52 ? amplitude : 0;
        const y = baseline + stepped;
        if (x === startX) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();

      for (let point = 1; point <= 4; point += 1) {
        const travel = reducedMotion.matches ? point / 5 : ((phase * (0.045 + lane * 0.006) + point / 4) % 1);
        const x = startX + travel * signalWidth;
        context.globalAlpha = 0.28;
        context.beginPath();
        context.arc(x, baseline, 2.2, 0, Math.PI * 2);
        context.fill();
      }
    }
  };

  const draw = (time) => {
    const styles = getComputedStyle(document.documentElement);
    const borderColor = styles.getPropertyValue("--border").trim();
    const accentColor = styles.getPropertyValue("--accent").trim();
    context.clearRect(0, 0, width, height);
    pointer.x += (pointer.targetX - pointer.x) * 0.045;
    pointer.y += (pointer.targetY - pointer.y) * 0.045;
    drawGrid(time, borderColor);
    drawSignals(time, accentColor);
    context.globalAlpha = 1;

    if (!reducedMotion.matches && visible) frame = requestAnimationFrame(draw);
  };

  const start = () => {
    cancelAnimationFrame(frame);
    if (visible && !reducedMotion.matches) frame = requestAnimationFrame(draw);
    else draw(performance.now());
  };

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    pointer.targetX = event.clientX / rect.width - 0.5;
    pointer.targetY = (event.clientY - rect.top) / rect.height - 0.5;
  });
  hero.addEventListener("pointerleave", () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
  });

  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    start();
  }).observe(hero);
  new MutationObserver(start).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  reducedMotion.addEventListener("change", start);
  resize();

  const role = hero.querySelector("[data-rotating-role]");
  const roles = ["C++ Systems", "Qt Applications", "Embedded Devices", "Industrial I/O"];
  let roleIndex = 0;
  if (role && !reducedMotion.matches) {
    window.setInterval(() => {
      role.classList.add("is-changing");
      window.setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        role.textContent = roles[roleIndex];
        role.classList.remove("is-changing");
      }, 180);
    }, 3000);
  }
})();
