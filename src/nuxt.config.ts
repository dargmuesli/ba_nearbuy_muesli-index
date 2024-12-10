import { LOCALES } from './utils/constants'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
  ],
  nitro: {
    experimental: {
      database: true,
    },
  },
  runtimeConfig: {
    nearbuy: {
      keycloak: {
        realmUri: 'https://auth.staging.nearbuy-food.de/realms/nearbuy',
        redirectUri: 'http://localhost:3001/login/keycloak/callback',
      },
    },
  },
  typescript: {
    tsConfig: {
      vueCompilerOptions: {
        htmlAttributes: [], // https://github.com/johnsoncodehk/volar/issues/1970#issuecomment-1276994634
      },
    },
  },
  vite: {
    optimizeDeps: {
      include: ['oslo/jwt'],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag.startsWith('nb-'),
    },
  },

  // modules
  eslint: {
    config: {
      typescript: true,
    },
  },
  i18n: {
    defaultLocale: 'de', // Must be set for the default prefix_except_default prefix strategy.
    detectBrowserLanguage: false,
    // lazy: true,
    locales: LOCALES,
  },
})
