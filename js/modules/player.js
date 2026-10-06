import { PROFILE } from "../config.js?v=4";

let idx = 0;
let order = [];
let audio, toggleBtn, titleEl, fillEl, barEl, coverEl;
let onLoop = null;
let onTrackChange = null;
let readyResolve = null;
let readyPromise = Promise.resolve();

const SVG_PLAY =
  '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>';
const SVG_PAUSE =
  '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
const SVG_PREV =
  '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 5h2.5v14H6zM19 5.5v13L9.5 12z"/></svg>';
const SVG_NEXT =
  '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M15.5 5H18v14h-2.5zM5 5.5v13l9.5-6.5z"/></svg>';

function buildOrder() {
  order = PROFILE.audio.map((_, i) => i);
  if (PROFILE.shuffleAudio) order.sort(() => Math.random() - 0.5);
}

export function initPlayer(opts = {}) {
  onLoop = opts.onLoop || null;
  onTrackChange = opts.onTrackChange || null;
  audio = document.getElementById("audio");
  audio.preload = "auto";
  audio.loop = false;
  toggleBtn = document.getElementById("p-toggle");
  titleEl = document.getElementById("p-title");
  fillEl = document.getElementById("p-fill");
  barEl = document.getElementById("p-bar");
  coverEl = document.getElementById("p-cover");

  document.getElementById("p-prev").innerHTML = SVG_PREV;
  document.getElementById("p-next").innerHTML = SVG_NEXT;
  toggleBtn.innerHTML = SVG_PLAY;

  if (!PROFILE.audio.length) return;
  buildOrder();

  if (PROFILE.showPlayer) document.getElementById("player").hidden = false;

  const volBox = document.getElementById("volume");
  const volRange = document.getElementById("volume-range");
  if (PROFILE.showVolume) {
    volBox.hidden = false;
    volRange.addEventListener("input", () => {
      audio.volume = volRange.value / 100;
    });
  }

  readyPromise = new Promise((res) => {
    readyResolve = res;
    setTimeout(res, 20000);
  });
  audio.addEventListener("canplaythrough", () => readyResolve?.(), { once: true });

  load(0, false);
  bind();
}

export function audioReady() {
  if (!PROFILE.audio.length) return Promise.resolve();
  if (audio && audio.readyState >= 3) return Promise.resolve();
  return readyPromise;
}

function load(i, autoplay = true) {
  idx = ((i % order.length) + order.length) % order.length;
  const t = PROFILE.audio[order[idx]];
  audio.src = t.url;
  if (autoplay) audio.load();
  titleEl.textContent = t.title || "—";
  if (t.cover) {
    coverEl.src = t.cover;
  } else {
    coverEl.removeAttribute("src");
  }
  if (autoplay) audio.play().catch(() => {});
  if (autoplay && onTrackChange) onTrackChange();
  updateBtn();
}

function updateBtn() {
  toggleBtn.innerHTML = audio && !audio.paused ? SVG_PAUSE : SVG_PLAY;
}

function bind() {
  audio.addEventListener("play", updateBtn);
  audio.addEventListener("pause", updateBtn);
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) fillEl.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  });
  audio.addEventListener("ended", () => {
    if (order.length === 1 && onLoop) onLoop();
    else load(idx + 1);
  });
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    audio.paused ? audio.play().catch(() => {}) : audio.pause();
  });
  document
    .getElementById("p-next")
    .addEventListener("click", (e) => { e.stopPropagation(); load(idx + 1); });
  document
    .getElementById("p-prev")
    .addEventListener("click", (e) => { e.stopPropagation(); load(idx - 1); });
  barEl.addEventListener("click", (e) => {
    const r = barEl.getBoundingClientRect();
    const p = (e.clientX - r.left) / r.width;
    if (audio.duration) audio.currentTime = p * audio.duration;
  });
  barEl.addEventListener("keydown", (e) => {
    if (!audio.duration) return;
    if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
  });
}

export function startAudio() {
  const a = document.getElementById("audio");
  if (a && a.getAttribute("src")) {
    a.currentTime = 0;
    if (a.paused) a.play().catch(() => {});
  }
}

export function restartAudio() {
  const a = document.getElementById("audio");
  if (!a) return;
  a.currentTime = 0;
  a.play().catch(() => {});
  updateBtn();
}
