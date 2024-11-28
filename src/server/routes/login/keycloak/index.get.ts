import { generateState, generateCodeVerifier } from 'arctic'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const url = keycloak.createAuthorizationURL(
    state,
    codeVerifier,
    query.scope && typeof query.scope === 'string'
      ? query.scope.split(' ')
      : ['openid', 'profile', 'email'],
  )

  setCookie(event, 'keycloak_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })
  setCookie(event, 'code_verifier', codeVerifier, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })
  return sendRedirect(event, url.toString())
})
