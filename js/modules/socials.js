import { PROFILE } from "../config.js?v=19";
import { iconSVG, isImageUrl } from "./icons.js?v=19";

export function initSocials() {
  const nav = document.getElementById("socials");
  nav.innerHTML = "";
  for (const s of PROFILE.socials) {
    const a = document.createElement("a");
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer nofollow";
    a.setAttribute("aria-label", typeof s.icon === "string" ? s.icon : "link");
    if (PROFILE.theme.glowSocials) a.classList.add("glow");
    a.style.color = PROFILE.theme.iconGlowColor || PROFILE.theme.icon;
    if (isImageUrl(s.icon)) {
      const img = document.createElement("img");
      img.src = s.icon; img.alt = ""; img.loading = "lazy";
      a.appendChild(img);
    } else {
      a.innerHTML = iconSVG(s.icon);
    }
    nav.appendChild(a);
  }
}
