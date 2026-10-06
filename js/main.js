import { PROFILE } from "./config.js?v=4";
import { applyTheme } from "./modules/theme.js?v=4";
import {
  initBackground,
  backgroundReady,
  startBackground,
  restartBackground,
} from "./modules/background.js?v=4";
import { initSocials } from "./modules/socials.js?v=4";
import { initPlayer, audioReady, startAudio, restartAudio } from "./modules/player.js?v=4";
import { initSync } from "./modules/sync.js?v=4";
import { initFx } from "./modules/fx.js?v=4";
import { initEnter, initTitle, initViews, initTilt } from "./modules/extras.js?v=4";
import { initTypewriter } from "./modules/typewriter.js?v=4";
import { initProtect } from "./modules/protect.js?v=4";

applyTheme();
initBackground();
initSocials();
if (PROFILE.effects.typewriter) initTypewriter();
initFx();
initTitle();
initViews();
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
