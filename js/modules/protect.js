import { PROFILE } from "../config.js?v=18";

export function initProtect() {
  if (!PROFILE.protect) return;

  if (window.top !== window.self) {
    try {
      window.top.location = window.self.location;
    } catch {}
  }

  addEventListener("contextmenu", (e) => e.preventDefault());
  addEventListener("dragstart", (e) => e.preventDefault());
  addEventListener("copy", (e) => e.preventDefault());
  addEventListener("cut", (e) => e.preventDefault());
  addEventListener("selectstart", (e) => {
    if (!(e.target instanceof HTMLInputElement)) e.preventDefault();
  });
  addEventListener("keydown", (e) => {
    const k = e.key.toUpperCase();
    if (e.key === "F12") e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && ["U", "S", "P"].includes(k)) e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && (k === "C" || k === "X")) {
      if (!(e.target instanceof HTMLInputElement)) e.preventDefault();
    }
  });

  for (const img of document.images) {
    img.setAttribute("draggable", "false");
  }

  let open = false;
  function setShield(on) {
    if (on === open) return;
    open = on;
    document.body.classList.toggle("shielded", on);
    const a = document.getElementById("audio");
    const v = document.querySelector("#bg video");
    if (on) {
      a?.pause();
      v?.pause();
    } else if (document.body.classList.contains("entered")) {
      v?.play().catch(() => {});
      a?.play().catch(() => {});
    }
  }

  setInterval(() => {
    if (document.hidden) return;
    const t0 = performance.now();
    debugger;
    if (performance.now() - t0 > 120) setShield(true);
    else if (open) setShield(false);
  }, 3000);

  console.log(
    "%cHold on.",
    "color:#fff;background:#000;font-size:24px;font-weight:bold;padding:4px 10px;border-radius:6px;"
  );
  console.log("%cThis profile is private property. Hands off.", "font-size:12px;");
}
