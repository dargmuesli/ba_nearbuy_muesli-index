export const STACK_DOMAIN =
  process.env.NUXT_ENV_STACK_DOMAIN || 'localhost:3001'
export const BASE_URL = // If NUXT_ENV_STACK_DOMAIN is missing, we assume that a http dev env is used.
  (process.env.NUXT_ENV_STACK_DOMAIN === undefined ? 'http' : 'https') +
  '://' +
  STACK_DOMAIN
export const CSP_POLICIES = {
  'base-uri': ["'none'"], // Mozilla Observatory.
  'connect-src': [
    "'self'",
    'http://localhost:8080/v1/',
    'http://api.staging.nearbuy-food.de.local.gd/v1/',
    'https://api.nearbuy-food.de/v1/',
    'https://api.staging.nearbuy-food.de/v1/',
    'https://auth.nearbuy-food.de/auth/realms/nearbuy-staging/',
  ],
  'default-src': ["'none'"],
  'font-src': ["'self'"],
  'form-action': ["'none'"], // Mozilla Observatory.
  'frame-ancestors': [
    'http://localhost:3000',
    'https://nearbuy-food.de',
    'https://staging.nearbuy-food.de',
  ],
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
}
export const CSP_REPORT_ONLY = false
export const KEYCLOAK_REALM_URI =
  'https://auth.nearbuy-food.de/auth/realms/nearbuy-staging'
export const KEYCLOAK_REDIRECT_URI =
  'http://localhost:3001/login/keycloak/callback'
export const LOCALES = [
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
