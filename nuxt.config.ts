export default defineNuxtConfig({
  modules: [
    "@chettapong/nuxt-lodash",
    "@nuxt/eslint",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "dayjs-nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "vuetify-nuxt-module",
  ],
  ssr: false,
  devtools: { enabled: false },

  /**
   * Every value has a non-secret default and can be overridden at run time
   * with a NUXT_* environment variable. The e2e suite points this at a stub.
   */
  runtimeConfig: {
    booksBaseUrl: "https://www.projectaon.org",
  },
  compatibilityDate: "2024-04-03",
  /**
   * Runs as a plain Node server in a container (see Dockerfile). The only
   * server code is the Project Aon proxy under server/api.
   */
  nitro: {
    preset: "node-server",
  },

  eslint: {
    config: {
      // One formatter, and it is the linter. No Prettier.
      stylistic: {
        quotes: "double",
        semi: true,
        commaDangle: "always-multiline",
      },
    },
  },
  lodash: {
    prefix: "_",
    upperAfterPrefix: false,
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
    moduleOptions: {
      // Vuetify's useLayout collides with Nuxt's built-in composable; we import
      // the few Vuetify composables we need explicitly instead.
      importComposables: false,
    },
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
