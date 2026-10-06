import { bgVideo } from "./background.js?v=6";

let timer = null;

function snap() {
  const v = bgVideo();
  const a = document.getElementById("audio");
  if (!v || !a || v.paused || a.paused) return;
  if (!isFinite(v.duration) || !isFinite(a.duration)) return;
  if (Math.abs(v.currentTime - a.currentTime) > 0.3) {
    v.currentTime = a.currentTime;
  }
}

export function initSync() {
  if (timer) return;
  timer = setInterval(snap, 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) snap();
  });
}
