import { PROFILE } from "./config.js?v=1";
import { applyTheme } from "./modules/theme.js?v=1";
import {
  initBackground,
  backgroundReady,
  startBackground,
  restartBackground,
} from "./modules/background.js?v=1";
import { initSocials } from "./modules/socials.js?v=1";
import { initPlayer, audioReady, startAudio, restartAudio } from "./modules/player.js?v=1";
import { initSync } from "./modules/sync.js?v=1";
import { initFx } from "./modules/fx.js?v=1";
import { initEnter, initTitle, initViews, initTilt } from "./modules/extras.js?v=1";
import { initTypewriter } from "./modules/typewriter.js?v=1";
import { initProtect } from "./modules/protect.js?v=1";
import { initNav } from "./modules/nav.js?v=1";

applyTheme();
initBackground();
initSocials();
if (PROFILE.effects.typewriter) initTypewriter();
initFx();
initTitle();
initViews();
initNav();
initTilt();
initPlayer({
  onLoop: () => {
    restartBackground();
    restartAudio();
  },
  onTrackChange: () => restartBackground(),
});
initProtect();
initEnter(async () => {
  await Promise.all([backgroundReady(), audioReady()]);
  await startBackground();
  startAudio();
  initSync();
});
