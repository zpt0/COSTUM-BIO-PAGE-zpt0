import { PROFILE } from "../config.js?v=11";

let video = null;
let readyPromise = Promise.resolve();
let started = false;

export function initBackground() {
  const bg = document.getElementById("bg");
  bg.innerHTML = "";

  const poster = document.createElement("img");
  poster.id = "bg-poster";
  poster.alt = "";
  poster.fetchPriority = "high";
  poster.decoding = "async";
  if (PROFILE.poster) poster.src = PROFILE.poster;
  bg.appendChild(poster);

  const url = PROFILE.background;
  if (url && /\.(mp4|webm|mov)(\?.*)?$/i.test(url)) {
    video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("aria-hidden", "true");
    const s = document.createElement("source");
    s.src = url;
    s.type = "video/mp4";
    video.appendChild(s);
    bg.appendChild(video);
    readyPromise = new Promise((res) => {
      if (video.readyState >= 3) res();
      else {
        video.addEventListener("canplaythrough", res, { once: true });
        setTimeout(res, 20000);
      }
    });
  } else if (url) {
    const full = new Image();
    full.decoding = "async";
    full.onload = () => {
      poster.src = url;
    };
    full.src = url;
  }
}

export function backgroundReady() {
  return readyPromise;
}

export function bgVideo() {
  return video;
}

function playFromZero() {
  video.currentTime = 0;
  return video.play();
}

export function startBackground() {
  if (!video || started) return Promise.resolve();
  started = true;
  return playFromZero().catch(() => {});
}

export function restartBackground() {
  if (!video) return;
  playFromZero().catch(() => {});
}
