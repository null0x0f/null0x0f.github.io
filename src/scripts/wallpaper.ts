import { wallpapers } from "@/lib/wallpapers";

const choices = document.querySelectorAll<HTMLButtonElement>("[data-wallpaper-choice]");
const selectWallpaper = (id: string, announce = false) => {
  const index = wallpapers.findIndex((wallpaper) => wallpaper.id === id);
  const wallpaper = wallpapers[index];
  if (!wallpaper) return;
  document.querySelectorAll<HTMLImageElement>("[data-wallpaper-image], [data-wallpaper-background]").forEach((image) => {
    if (image.getAttribute("src") !== wallpaper.src) image.src = wallpaper.src;
    image.width = wallpaper.width;
    image.height = wallpaper.height;
  });
  choices.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.wallpaperChoice === id)));
  document.querySelectorAll("[data-wallpaper-label]").forEach((label) => { label.textContent = wallpaper.title; });
  document.querySelectorAll("[data-wallpaper-filename]").forEach((label) => { label.textContent = wallpaper.filename; });
  document.querySelectorAll("[data-wallpaper-number]").forEach((label) => { label.textContent = `${String(index + 1).padStart(2, "0")} / 03`; });
  if (announce) document.querySelectorAll("[data-wallpaper-status]").forEach((status) => { status.textContent = `已切换壁纸：${wallpaper.title}`; });
};
try { selectWallpaper(localStorage.getItem("desktop-wallpaper") ?? "bleach"); } catch { /* Default artwork works without storage. */ }
choices.forEach((button) => button.addEventListener("click", () => {
  const id = button.dataset.wallpaperChoice;
  if (!id) return;
  selectWallpaper(id, true);
  try { localStorage.setItem("desktop-wallpaper", id); } catch { /* Keep the selection for this page. */ }
}));
