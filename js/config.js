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
      cover: "./assets/cover.webp?v=41",
    },
  ],
  shuffleAudio: false,
  showPlayer: true,
  showVolume: true,

  socials: [
    { icon: "github", label: "GitHub", url: "https://github.com/zpt0" },
    { icon: "steam", label: "Steam", url: "https://steamcommunity.com/id/76561199745694760" },
    { icon: "roblox", label: "Roblox", url: "https://www.roblox.com/users/5705835085/profile" },
    { icon: "discord", label: "Discord", url: "https://discord.com/users/299670891875270656" },
  ],

  nav: [
    { id: "start", label: "start" },
    { id: "portfolio", label: "portfolio" },
    { id: "about", label: "about me" },
    { id: "links", label: "links" },
  ],

  pages: {
    portfolio: {
      kicker: "selected work",
      title: "portfolio",
      intro: "discord tooling, bots and the occasional web page.",
      projects: [
        {
          title: "Clonecord",
          desc: "clone discord servers straight from the client — as a vencord plugin.",
          tags: ["typescript", "vencord"],
          url: "https://github.com/zpt0/Clonecord",
        },
        {
          title: "Questcord",
          desc: "vencord plugin that automates discord quests with real-time progress tracking.",
          tags: ["typescript", "vencord"],
          url: "https://github.com/zpt0/Questcord",
        },
        {
          title: "DC-Lyra",
          desc: "modular discord music bot with lavalink, playlists, filters and 7+ languages.",
          tags: ["typescript", "lavalink"],
          url: "https://github.com/zpt0/DC-Lyra",
        },
        {
          title: "Git2Page",
          desc: "turns a github username into a published portfolio page.",
          tags: ["typescript", "web"],
          url: "https://github.com/zpt0/Git2Page",
        },
      ],
    },
    about: {
      kicker: "a bit about me",
      title: "about me",
      text: [
        "hey, i'm zpt0 — a self-taught fullstack developer. i build whatever sounds fun: discord bots, client plugins, small static pages, sometimes tools only i will ever use.",
        "most of it ends up in typescript. no niche, no roadmap — if a project sounds interesting, i start it. no stack by default: a framework, a build step or a dependency has to earn its place.",
      ],
      facts: [
        { label: "focus", value: "discord bots & plugins" },
        { label: "stack", value: "typescript / node" },
        { label: "status", value: "shipping side projects" },
        { label: "contact", value: "discord" },
      ],
    },
    links: {
      kicker: "find me",
      title: "links",
      note: "the fastest way to reach me is discord.",
    },
  },

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
