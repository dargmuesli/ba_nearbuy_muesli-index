import bodyParser from 'body-parser'

import { BASE_URL } from './plugins/baseUrl'

const KEYCLOAK_REALM_URI =
  'https://auth.nearbuy-food.de/auth/realms/nearbuy-staging'
const KEYCLOAK_REDIRECT_URI = 'http://localhost:3000'
const LOCALES = [
  {
    code: 'en',
    name: 'English',
    iso: 'en', // Will be used as catchall locale by default.
  },
  {
    code: 'de',
    name: 'Deutsch',
    iso: 'de',
  },
]

export default {
  build: {
    extractCSS: true,
  },
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
    [
      '@nuxtjs/html-validator',
      {
        options: {
          elements: [
            'html5',
            {
              'nb-button': { flow: true },
            },
          ],
        },
      },
    ],
    '@nuxtjs/stylelint-module',
    '@nuxtjs/tailwindcss',
  ],
  components: true,
  generate: {
    interval: 2000, // https://github.com/nuxt-community/composition-api/issues/44
  },
  head() {
    return {
      link: [
        {
          href: '/assets/static/favicon/apple-touch-icon.png?v=0.0.0',
          rel: 'apple-touch-icon',
          sizes: '180x180',
        },
        {
          href: '/assets/static/favicon/favicon-16x16.png?v=0.0.0',
          rel: 'icon',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          href: '/assets/static/favicon/favicon-32x32.png?v=0.0.0',
          rel: 'icon',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          href: '/assets/static/favicon/favicon.ico',
          rel: 'icon',
          type: 'image/x-icon',
        },
        {
          href: '/assets/static/favicon/site.webmanifest?v=0.0.0',
          rel: 'manifest',
        },
        {
          color: '#ee976e',
          href: '/assets/static/favicon/safari-pinned-tab.svg?v=0.0.0',
          rel: 'mask-icon',
        },
        {
          href: '/assets/static/favicon/favicon.ico?v=0.0.0',
          rel: 'shortcut icon',
        },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content:
            'Calculates the "Muesli index", representing the availability of ingredients required for a yummy muesli. Requests for missing ingredients can be added with one click.',
        },
        { name: 'format-detection', content: 'telephone=no' },
        {
          content: '/assets/static/favicon/browserconfig.xml?v=0.0.0',
          name: 'msapplication-config',
        },
      ],
      title: 'Nearbuy Muesli Index',
    }
  },
  modules: [
    [
      'nuxt-helmet',
      {
        hsts: {
          maxAge: 31536000,
          preload: true,
        },
      },
    ], // Should be declared at the start of the array.
    'nuxt-healthcheck',
    [
      'nuxt-stencil',
      {
        hydratePath: 'component-library/hydrate',
        lib: 'component-library',
        loaderPath: 'component-library/loader',
        prefix: 'my-',
      },
    ],
    [
      '@nuxtjs/axios',
      {
        baseUrl: 'https://api.staging.nearbuy-food.de/v1/',
        debug: true,
      },
    ],
    [
      '@nuxtjs/auth-next',
      {
        cookie: {
          options: {
            sameSite: 'Strict',
            secure: true,
          },
        },
        plugins: ['~/plugins/auth.js'],
        strategies: {
          keycloak: {
            scheme: 'oauth2',
            endpoints: {
              authorization: `${KEYCLOAK_REALM_URI}/protocol/openid-connect/auth`,
              token: `${KEYCLOAK_REALM_URI}/protocol/openid-connect/token`,
              userInfo: `${KEYCLOAK_REALM_URI}/protocol/openid-connect/userinfo`,
              logout: `${KEYCLOAK_REALM_URI}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(
                KEYCLOAK_REDIRECT_URI
              )}`,
            },
            token: {
              property: 'access_token',
              type: 'Bearer',
              maxAge: 1800,
            },
            refreshToken: {
              property: 'refresh_token',
              maxAge: 60 * 60 * 24 * 30,
            },
            responseType: 'code',
            grantType: 'authorization_code',
            // accessType: undefined,
            // redirectUri: KEYCLOAK_REDIRECT_URI,
            // logoutRedirectUri: undefined,
            clientId: 'plugin_muesli-index_public',
            scope: ['openid', 'profile', 'email'],
            // state: 'UNIQUE_AND_NON_GUESSABLE',
            codeChallengeMethod: 'S256',
            // responseMode: '',
            // acrValues: '',
            // autoLogout: false
          },
        },
      },
    ],
    [
      '@nuxtjs/i18n',
      {
        baseUrl: BASE_URL,
        defaultLocale: 'en', // Must be set for the default prefix_except_default prefix strategy.
        detectBrowserLanguage: {
          cookieSecure: true,
          redirectOn: 'root',
        },
        locales: LOCALES,
        vueI18n: {
          // messages: {
          //   de: localeDe,
          //   en: localeEn,
          // },
          silentFallbackWarn: true,
        },
        vueI18nLoader: true,
      },
    ],
    [
      '@nuxtjs/robots',
      {
        Allow: ['/'],
        Disallow: ['/robots.txt'], // https://webmasters.stackexchange.com/a/117537/70856
        Sitemap: BASE_URL + '/sitemap.xml',
      },
    ],
    ['@nuxtjs/sitemap', { hostname: BASE_URL, i18n: true }], // Should be declared at the end of the array.
  ],
  plugins: ['~/plugins/baseUrl.ts'],
  render: {
    csp: {
      policies: {
        'base-uri': ["'none'"], // Mozilla Observatory.
        'connect-src': [
          "'self'",
          'https://api.staging.nearbuy-food.de/v1/',
          'https://auth.nearbuy-food.de/auth/realms/nearbuy-staging/',
        ],
        'default-src': ["'none'"],
        'font-src': ["'self'"],
        'form-action': ["'none'"], // Mozilla Observatory.
        'frame-ancestors': ["'none'"], // Mozilla Observatory.
        'img-src': ["'self'"],
        'manifest-src': ["'self'"], // Chrome
        'report-uri': 'https://dargmuesli.report-uri.com/r/d/csp/enforce',
        'script-src': [
          "'self'",
          'https://static.cloudflareinsights.com/beacon.min.js',
        ],
        'style-src': [
          "'self'", // Tailwind
          "'unsafe-inline'", // Shadow root
        ],
      },
      reportOnly: false,
    },
  },
  router: {
    middleware: ['auth'],
  },
  serverMiddleware: [
    bodyParser.json(),
    { handler: '~/middleware/server/headers.ts' },
    { path: '/auth', handler: '~/api/auth.ts' },
  ],
  ssr: false,
  vue: {
    config: {
      ignoredElements: [/nb-\w+/],
      productionTip: false,
    },
  },
}
