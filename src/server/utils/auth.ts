import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite'
import { Keycloak } from 'arctic'
import { Lucia } from 'lucia'

import { KEYCLOAK_REDIRECT_URI } from '../../utils/constants'
import { db, type DatabaseSession, type DatabaseUser } from './db'

const KEYCLOAK_REALM_URI =
  'https://auth.nearbuy-food.de/auth/realms/nearbuy-staging'

const adapter = new BetterSqlite3Adapter(db, {
  session: 'session',
  user: 'user',
})

export const lucia = new Lucia(adapter, {
  getSessionAttributes: (attributes) => ({
    accessToken: attributes.access_token,
    accessTokenExpiresAt: attributes.access_token_expires_at,
    idToken: attributes.id_token,
    refreshToken: attributes.refresh_token,
    refreshTokenExpiresAt: attributes.refresh_token_expires_at,
  }),
  getUserAttributes: (attributes) => ({
    nameFull: attributes.name,
  }),
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
})

export const keycloak = new Keycloak(
  KEYCLOAK_REALM_URI,
  'plugin_muesli-index_public',
  '', // TODO
  KEYCLOAK_REDIRECT_URI,
)

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseSessionAttributes: Omit<
      DatabaseSession,
      'id' | 'expires_at' | 'user_id'
    >
    DatabaseUserAttributes: Omit<DatabaseUser, 'id'>
  }
}
