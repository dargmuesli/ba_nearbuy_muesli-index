import { ServerResponse } from 'http'

import { IncomingMessageWithBody } from '~/types/http'

export default function (
  _req: IncomingMessageWithBody,
  res: ServerResponse,
  _next: any
) {
  const session = require('express-session')
  const Keycloak = require('keycloak-connect')

  const memoryStore = new session.MemoryStore()
  const keycloak = new Keycloak(
    { scope: 'offline_access', store: memoryStore },
    {
      clientId: 'plugin_muesli-index',
      bearerOnly: true,
      serverUrl: 'https://auth.nearbuy-food.de/auth',
      realm: 'nearbuy-staging',
      realmPublicKey: 'MIIBIjANB...',
    }
  )

  res.statusCode = 500
  res.end('Secret missing!')
}
