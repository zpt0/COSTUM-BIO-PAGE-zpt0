import { PROFILE } from "../config.js?v=12";
export function initFx() {
  if (PROFILE.effects.background === "none") return;
  const cv = document.getElementById("fx");
  const ctx = cv.getContext("2d");
  const rain = PROFILE.effects.background === "rain";
  let W, H, parts;

  function resize() {
    W = cv.width = innerWidth;
    H = cv.height = innerHeight;
    const n = Math.min(rain ? 120 : 90, Math.floor(W / 12));
    parts = Array.from({ length: n }, () => spawn(true));
  }

  function spawn(anyY = false) {
    return rain
      ? { x: Math.random() * W, y: anyY ? Math.random() * H : -20, l: 10 + Math.random() * 14, v: 9 + Math.random() * 7, o: 0.3 + Math.random() * 0.4 }
      : { x: Math.random() * W, y: anyY ? Math.random() * H : -10, r: 1 + Math.random() * 2.6, v: 0.4 + Math.random() * 1.1, ph: Math.random() * Math.PI * 2, o: 0.4 + Math.random() * 0.5 };
  }

  let t = 0;
  function tick() {
    t += 0.01;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = ctx.fillStyle = PROFILE.effects.flakesColor;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (rain) {
        p.y += p.v; p.x -= 1.2;
        if (p.y > H) parts[i] = spawn();
        ctx.globalAlpha = p.o;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 2, p.y + p.l); ctx.stroke();
      } else {
        p.y += p.v; p.x += Math.sin(t + p.ph) * 0.4;
        if (p.y > H + 5) parts[i] = spawn();
        ctx.globalAlpha = p.o;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (!document.hidden) requestAnimationFrame(tick);
    else setTimeout(() => requestAnimationFrame(tick), 500);
  }

  addEventListener("resize", resize);
  resize(); tick();
}
