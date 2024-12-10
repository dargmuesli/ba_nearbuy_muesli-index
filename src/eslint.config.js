import { VIO_ESLINT_CONFIG } from '@dargmuesli/nuxt-vio/.config/lint.js'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  ...VIO_ESLINT_CONFIG,
  {
    settings: {
      'vue-i18n': {
        localeDir: [
          {
            pattern: './node_modules/@dargmuesli/nuxt-vio/i18n/locales/*.json',
          },
        ],
      },
    },
  },
  {
    rules: {
      'vue/v-on-event-hyphenation': 'off',
    },
  },
)
