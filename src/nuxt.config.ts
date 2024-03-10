import { LOCALES } from './utils/constants'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@nuxtjs/seo'],
  nitro: {
    experimental: {
      database: true,
    },
  },
  sourcemap: true,
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag.startsWith('nb-'),
    },
  },

  // modules
  i18n: {
    defaultLocale: 'de', // Must be set for the default prefix_except_default prefix strategy.
    detectBrowserLanguage: false,
    // langDir: 'locales',
    // lazy: true,
    locales: LOCALES,
  },
})
