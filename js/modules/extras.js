import { PROFILE } from "../config.js?v=4";

export function initEnter(onEnter) {
  const el = document.getElementById("enter");
  let busy = false;
  const done = async () => {
    if (busy || document.body.classList.contains("entered")) return;
    busy = true;
    el.setAttribute("aria-busy", "true");
    document.getElementById("enter-text").textContent = "loading...";
    try {
      await onEnter?.();
    } catch {}
    document.body.classList.add("entered");
  };
  el.addEventListener("click", done);
  addEventListener("keydown", (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      done();
    }
  });
}

export function initTitle() {
  const handle = "@" + PROFILE.username;
  if (!PROFILE.effects.animatedTitle || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.title = handle;
    return;
  }
  const CUR = "▌";
  const cuts = [handle.length - 1, handle.length - 2, 1].filter((c) => c >= 1 && c < handle.length);
  let ci = 0;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async function loop() {
    for (;;) {
      for (let i = 1; i <= handle.length; i++) {
        document.title = "> " + handle.slice(0, i) + CUR;
        await wait(110 + Math.random() * 90);
      }
      document.title = "> " + handle;
      await wait(1800);
      const cut = cuts.length ? cuts[ci++ % cuts.length] : 1;
      for (let i = handle.length; i > cut; i--) {
        document.title = "> " + handle.slice(0, i - 1) + CUR;
        await wait(45);
      }
      await wait(450);
    }
  })();
}

export function initViews() {
  if (!PROFILE.showViews) return;
  const box = document.getElementById("views");
  const num = document.getElementById("views-num");
  box.hidden = false;
  const k = "bio_views_" + PROFILE.username;
  let v;
  try {
    v = parseInt(localStorage.getItem(k) || "", 10);
  } catch {
    v = NaN;
  }
  if (Number.isNaN(v)) v = PROFILE.viewsStart;
  else v += 1;
  try {
    localStorage.setItem(k, String(v));
  } catch {}
  let cur = Math.max(0, v - 8);
  num.textContent = cur;
  const iv = setInterval(() => {
    cur++;
    num.textContent = cur;
    if (cur >= v) clearInterval(iv);
  }, 90);
}

export function initTilt() {
  if (!PROFILE.effects.tilt || matchMedia("(pointer: coarse)").matches) return;
  const card = document.getElementById("card");
  const stage = document.getElementById("stage");
  stage.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  });
  stage.addEventListener("mouseleave", () => { card.style.transform = ""; });
}
