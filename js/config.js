export const PROFILE = {
  username: "zpt0",
  displayName: "zpt0",
  uid: "0",
  description: '"Bad days happen, but they are not the end of the story."',
  location: "Right here",

  avatar: "./assets/pfp.png",
  background: "./assets/bg.mp4",
  poster: "./assets/bg-poster.jpg",
  backgroundColor: "#000000",

  enterText: "click to enter...",
  enterSub: "@zpt0",

  audio: [
    {
      title: "JAXK - Redlights [Idleglance]",
      url: "./assets/song.mp3",
      cover: "./assets/cover.webp?v=16",
    },
  ],
  shuffleAudio: false,
  showPlayer: true,
  showVolume: true,

  socials: [
    { icon: "github", url: "https://github.com/zpt0" },
    { icon: "steam", url: "https://steamcommunity.com/id/76561199745694760" },
    { icon: "roblox", url: "https://www.roblox.com/users/5705835085/profile" },
    { icon: "discord", url: "https://discord.com/users/299670891875270656" },
  ],

  theme: {
    text: "#ffffff",
    textDim: "rgba(255,255,255,0.5)",
    icon: "#ffffff",
    accent: "#ffffff",
    card: "rgba(0,0,0,0.5)",
    cardBorder: "rgba(255,255,255,0.3)",
    cardRadius: 20,
    cardWidth: 640,
    blur: 10,
    avatarRadius: 35,
    glowUsername: true,
    glowSocials: true,
    iconGlowColor: "#ffffff",
  },

  effects: {
    background: "snowflakes",
    flakesColor: "#ffffff",
    animatedTitle: true,
    tilt: true,
    typewriter: true,
    typewriterTexts: [],
    typewriterSpeed: 55,
    typewriterHold: 2400,
  },

  protect: true,

  showViews: true,
  views: { workspace: "zpt0-views-72419", counter: "zpt0-views-72419" },
};

export default PROFILE;
