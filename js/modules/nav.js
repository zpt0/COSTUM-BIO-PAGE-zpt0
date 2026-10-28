import { PROFILE } from "../config.js?v=1";
import { iconSVG, isImageUrl } from "./icons.js?v=1";

const FALLBACK_NAV = [
  { id: "start", label: "start" },
  { id: "portfolio", label: "portfolio" },
  { id: "about", label: "about me" },
  { id: "links", label: "links" },
];

const ARROW =
  '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M9 7h8v8"/></svg>';

export function initNav() {
  const nav = document.getElementById("nav");
  const card = document.getElementById("card");
  if (!nav || !card) return;

  const panels = new Map();
  for (const panel of document.querySelectorAll("#card .panel")) {
    panels.set(panel.dataset.panel, panel);
  }
  if (!panels.size) return;

  buildPages(panels);

  const items = (PROFILE.nav || FALLBACK_NAV).filter((item) => panels.has(item.id));
  if (!items.length) items.push(...FALLBACK_NAV.filter((item) => panels.has(item.id)));

  const pill = document.createElement("span");
  pill.id = "nav-pill";
  pill.setAttribute("aria-hidden", "true");
  nav.appendChild(pill);

  const tabs = new Map();
  for (const item of items) {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "nav-tab";
    tab.dataset.panel = item.id;
    tab.textContent = item.label || item.id;
    tab.addEventListener("click", () => {
      if (tab.getAttribute("aria-current") === "page") return;
      activate(item.id, true);
      pushHash(item.id);
    });
    nav.appendChild(tab);
    tabs.set(item.id, tab);
  }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let active = null;
  let timer = 0;

  function movePill() {
    const tab = tabs.get(active);
    if (!tab) return;
    const navRect = nav.getBoundingClientRect();
    const rect = tab.getBoundingClientRect();
    pill.style.width = rect.width + "px";
    pill.style.height = rect.height + "px";
    pill.style.transform = `translate(${rect.left - navRect.left - nav.clientLeft}px, ${
      rect.top - navRect.top - nav.clientTop
    }px)`;
    pill.style.opacity = "1";
  }

  function mark(id) {
    active = id;
    for (const [pid, panel] of panels) panel.classList.toggle("is-active", pid === id);
    for (const [tid, tab] of tabs) {
      if (tid === id) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    }
    movePill();
  }

  function activate(id, animate = true) {
    if (!panels.has(id) || id === active) return;

    if (!animate || reduce.matches) {
      clearTimeout(timer);
      card.classList.remove("is-switching");
      card.style.height = "";
      mark(id);
      return;
    }

    clearTimeout(timer);
    const startH = card.offsetHeight;
    card.classList.add("is-switching");
    card.style.height = startH + "px";

    mark(id);
    card.style.height = "auto";
    const endH = card.offsetHeight;

    card.style.height = startH + "px";
    void card.offsetHeight;
    card.style.height = endH + "px";

    timer = setTimeout(() => {
      card.classList.remove("is-switching");
      card.style.height = "";
    }, 500);
  }

  function hashId() {
    return (location.hash || "").replace(/^#/, "");
  }

  function pushHash(id) {
    const hash = "#" + id;
    if (location.hash === hash) return;
    try {
      history.pushState(null, "", hash);
    } catch {
      location.hash = id;
    }
  }

  function syncFromHash() {
    const id = hashId();
    activate(panels.has(id) ? id : items[0].id, true);
  }

  mark(panels.has("start") ? "start" : items[0].id);
  if (hashId() && hashId() !== active && panels.has(hashId())) mark(hashId());

  addEventListener("hashchange", syncFromHash);
  addEventListener("popstate", syncFromHash);
  addEventListener("resize", movePill);
  if (document.fonts?.ready) document.fonts.ready.then(movePill).catch(() => {});
}

function buildPages(panels) {
  const pages = PROFILE.pages || {};
  buildPortfolio(panels.get("portfolio"), pages.portfolio);
  buildAbout(panels.get("about"), pages.about);
  buildLinks(panels.get("links"), pages.links);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function addHead(panel, cfg) {
  const head = el("div", "panel-head");
  if (cfg.kicker) head.appendChild(el("p", "panel-kicker", cfg.kicker));
  if (cfg.title) head.appendChild(el("h2", "panel-title", cfg.title));
  panel.appendChild(head);
  if (cfg.intro) panel.appendChild(el("p", "panel-intro", cfg.intro));
}

function arrow() {
  const span = el("span", "row-arrow");
  span.innerHTML = ARROW;
  return span;
}

function buildPortfolio(panel, cfg) {
  if (!panel || !cfg) return;
  addHead(panel, cfg);
  const list = el("div", "projects");
  const projects = cfg.projects || [];
  projects.forEach((project, i) => {
    const item = document.createElement(project.url ? "a" : "div");
    item.className = "project";
    if (project.url) {
      item.href = project.url;
      item.target = "_blank";
      item.rel = "noopener noreferrer nofollow";
    }
    item.appendChild(el("span", "project-idx", String(i + 1).padStart(2, "0")));

    const body = el("div", "project-body");
    body.appendChild(el("p", "project-title", project.title || "untitled"));
    if (project.desc) body.appendChild(el("p", "project-desc", project.desc));
    if (project.tags?.length) {
      const tags = el("div", "project-tags");
      for (const tag of project.tags) tags.appendChild(el("span", null, tag));
      body.appendChild(tags);
    }
    item.appendChild(body);
    if (project.url) item.appendChild(arrow());
    list.appendChild(item);
  });
  if (!projects.length) list.appendChild(el("p", "panel-empty", "nothing here yet."));
  panel.appendChild(list);
}

function buildAbout(panel, cfg) {
  if (!panel || !cfg) return;
  addHead(panel, cfg);
  const text = el("div", "about-text");
  for (const paragraph of cfg.text || []) text.appendChild(el("p", null, paragraph));
  if (text.children.length) panel.appendChild(text);

  if (cfg.facts?.length) {
    const facts = el("div", "facts");
    for (const fact of cfg.facts) {
      const box = el("div", "fact");
      box.appendChild(el("p", "fact-label", fact.label));
      box.appendChild(el("p", "fact-value", fact.value));
      facts.appendChild(box);
    }
    panel.appendChild(facts);
  }
}

function buildLinks(panel, cfg) {
  if (!panel) return;
  addHead(panel, cfg || { title: "links" });
  const list = el("div", "link-list");
  for (const social of PROFILE.socials || []) {
    const row = document.createElement("a");
    row.className = "link-row";
    row.href = social.url;
    row.target = "_blank";
    row.rel = "noopener noreferrer nofollow";

    const icon = el("span", "link-icon");
    if (isImageUrl(social.icon)) {
      const img = document.createElement("img");
      img.src = social.icon;
      img.alt = "";
      img.loading = "lazy";
      icon.appendChild(img);
    } else {
      icon.innerHTML = iconSVG(social.icon);
    }

    const meta = el("span", "link-meta");
    meta.appendChild(el("span", "link-name", social.label || social.icon || "link"));
    meta.appendChild(el("span", "link-host", prettyUrl(social.url)));

    row.append(icon, meta, arrow());
    list.appendChild(row);
  }
  if (!list.children.length) list.appendChild(el("p", "panel-empty", "no links yet."));
  panel.appendChild(list);
  if (cfg?.note) panel.appendChild(el("p", "panel-note", cfg.note));
}

function prettyUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url || "";
  }
}
