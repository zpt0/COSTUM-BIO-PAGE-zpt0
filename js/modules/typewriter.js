import { PROFILE } from "../config.js?v=4";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function initTypewriter() {
  const bio = document.getElementById("bio");
  const texts = PROFILE.effects.typewriterTexts?.length
    ? PROFILE.effects.typewriterTexts
    : [PROFILE.description];
  const speed = PROFILE.effects.typewriterSpeed ?? 55;
  const hold = PROFILE.effects.typewriterHold ?? 2400;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  bio.textContent = "";
  const caret = document.createElement("span");
  caret.id = "type-caret";
  caret.setAttribute("aria-hidden", "true");
  bio.appendChild(caret);

  if (reduce) {
    bio.textContent = texts[0];
    return;
  }

  let ti = 0;
  (async function run() {
    for (;;) {
      const text = texts[ti % texts.length];
      for (const ch of text) {
        caret.before(document.createTextNode(ch));
        await wait(speed + Math.random() * 45);
      }
      if (texts.length === 1) return;
      await wait(hold);
      let nodes = [...bio.childNodes].filter((n) => n !== caret);
      while (nodes.length) {
        nodes.pop().remove();
        nodes = [...bio.childNodes].filter((n) => n !== caret);
        await wait(28);
      }
      ti++;
    }
  })();
}
