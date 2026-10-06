import { PROFILE } from "./config.js?v=16";
import { applyTheme } from "./modules/theme.js?v=16";
import {
  initBackground,
  backgroundReady,
  startBackground,
  restartBackground,
} from "./modules/background.js?v=16";
import { initSocials } from "./modules/socials.js?v=16";
import { initPlayer, audioReady, startAudio, restartAudio } from "./modules/player.js?v=16";
import { initSync } from "./modules/sync.js?v=16";
import { initFx } from "./modules/fx.js?v=16";
import { initEnter, initTitle, initViews, initTilt } from "./modules/extras.js?v=16";
import { initTypewriter } from "./modules/typewriter.js?v=16";
import { initProtect } from "./modules/protect.js?v=16";

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
