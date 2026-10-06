import { PROFILE } from "../config.js?v=14";

export function applyTheme() {
  const r = document.documentElement.style;
  const t = PROFILE.theme;
  r.setProperty("--text", t.text);
  r.setProperty("--text-dim", t.textDim);
  r.setProperty("--icon", t.icon);
  r.setProperty("--card", t.card);
  r.setProperty("--card-border", t.cardBorder);
  r.setProperty("--card-radius", t.cardRadius + "px");
  r.setProperty("--card-width", t.cardWidth + "px");
  r.setProperty("--blur", t.blur + "px");
  r.setProperty("--bg", PROFILE.backgroundColor);

  document.getElementById("avatar").style.setProperty("--avatar-radius", t.avatarRadius + "%");
  document.getElementById("avatar").style.borderRadius = t.avatarRadius + "%";

  if (t.glowUsername) document.getElementById("name").classList.add("glow");

  document.getElementById("enter-text").textContent = PROFILE.enterText;
  const sub = document.getElementById("enter-sub");
  if (PROFILE.enterSub) {
    sub.hidden = false;
    sub.textContent = PROFILE.enterSub;
  }
  const avatar = document.getElementById("avatar");
  avatar.src = PROFILE.avatar;
  avatar.setAttribute("draggable", "false");
  document.getElementById("name").textContent = PROFILE.displayName;
  document.getElementById("name").title = "UID " + PROFILE.uid;
  if (!PROFILE.effects.typewriter) {
    document.getElementById("bio").textContent = PROFILE.description;
  }

  if (PROFILE.location) {
    document.getElementById("location").hidden = false;
    document.getElementById("location-text").textContent = PROFILE.location;
  }
}
