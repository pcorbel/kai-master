export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  ssr: false,
  modules: [
    "@chettapong/nuxt-lodash",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "dayjs-nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "vuetify-nuxt-module",
  ],
  lodash: {
    prefix: "_",
    upperAfterPrefix: false,
  },
  nitro: {
    firebase: {
      gen: 2,
    },
  },
  piniaPluginPersistedstate: {
    storage: "localStorage",
  },
  pwa: {
    registerType: "autoUpdate",
    workbox: {
      globPatterns: ["**/*.{js,css,html,jpg}"],
      navigateFallback: null,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.(js|css|html|jpg)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "static-assets",
            expiration: {
              maxEntries: 1000,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          urlPattern: /^https:\/\/.*\/api\/.*/,
          handler: "CacheFirst",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24, // 24 hours
            },
          },
        },
      ],
    },
    manifest: {
      name: "Kai-Master",
      short_name: "Kai-Master",
      id: "Kai-Master",
      description: "A Modern Lone Wolf Reader",
      lang: "en",
      start_url: "/",
      display: "standalone",
      orientation: "portrait",
      theme_color: "#0F172A",
      background_color: "#0F172A",
      icons: [
        {
          src: "pwa-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
      screenshots: [
        {
          src: "screenshot-narrow.png",
          sizes: "1080x2400",
          type: "image/png",
          form_factor: "narrow",
          label: "Home",
        },
        {
          src: "screenshot-wide.png",
          sizes: "2840x1692",
          type: "image/png",
          form_factor: "wide",
          label: "Home",
        },
      ],
    },
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        themes: {
          dark: {
            dark: true,
            colors: {
              primary: "#60A5FA",
              background: "#0F172A",
              text: "#E2E8F0",
              border: "#2C2C2C",
            },
          },
          light: {
            dark: false,
            colors: {
              primary: "#3B82F6",
              background: "#FFFFFF",
              text: "#334155",
              border: "#E0E0E0",
            },
          },
        },
      },
    },
  },
});
