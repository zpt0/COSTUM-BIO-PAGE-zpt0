import { PROFILE } from "../config.js?v=8";

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
  const GLYPHS = "!<>-_/[]{}=+*^?#01";
  const PREFIX = "> ";
  const CUR = "▌";
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rnd = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
  (async function loop() {
    for (;;) {
      const shown = handle.split("").map(rnd);
      for (let i = 0; i < handle.length; i++) {
        for (let f = 0; f < 4; f++) {
          shown[i] = rnd();
          document.title = PREFIX + shown.join("") + CUR;
          await wait(55);
        }
        shown[i] = handle[i];
        document.title = PREFIX + shown.join("") + CUR;
        await wait(60);
      }
      document.title = PREFIX + handle;
      await wait(2200);
    }
  })();
}

export async function initViews() {
  if (!PROFILE.showViews) return;
  const box = document.getElementById("views");
  const num = document.getElementById("views-num");
  box.hidden = false;
  let v = null;
  try {
    v = await globalViews();
  } catch {}
  if (v === null) v = localViews();
  animateCount(num, v);
}

async function globalViews() {
  const w = PROFILE.views && PROFILE.views.workspace;
  if (!w) return null;
  const c = (PROFILE.views && PROFILE.views.counter) || "views";
  const r = await fetch(
    "https://api.counterapi.dev/v2/" + encodeURIComponent(w) + "/" + encodeURIComponent(c) + "/up"
  );
  if (!r.ok) return null;
  const j = await r.json();
  const n = j && j.data && j.data.up_count;
  return typeof n === "number" ? n : null;
}

function localViews() {
  const k = "bio_views_" + PROFILE.username;
  let v;
  try {
    v = parseInt(localStorage.getItem(k) || "", 10);
  } catch {
    v = NaN;
  }
  const start = PROFILE.views && typeof PROFILE.views.fallbackStart === "number" ? PROFILE.views.fallbackStart : 0;
  if (Number.isNaN(v)) v = start;
  else v += 1;
  try {
    localStorage.setItem(k, String(v));
  } catch {}
  return v;
}

function animateCount(num, v) {
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
