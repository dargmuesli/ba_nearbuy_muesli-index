import { decodeIdToken, ArcticFetchError, OAuth2RequestError } from 'arctic'

type KeycloakUser = {
  acr: string
  at_hash: string
  aud: string
  auth_time: number
  azp: string
  email_verified: boolean
  email: string
  exp: number
  // family_name: string
  // given_name: string
  iat: number
  iss: string
  jti: string
  // locale: string
  // name: string
  // picture: string
  preferred_username: string
  session_state: string
  sid: string
  sub: string
  typ: string
  // user: any
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString()
  const state = query.state?.toString()
  const storedState = getCookie(event, 'keycloak_oauth_state')
  const codeVerifier = getCookie(event, 'code_verifier')
  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    throw createError({
      statusCode: 400,
    })
  }

  try {
    const tokens = await keycloak.validateAuthorizationCode(code, codeVerifier)
    const claims = decodeIdToken(tokens.idToken()) as KeycloakUser
    // console.log(decodeIdToken(tokens.accessToken()))
    // console.log(decodeIdToken(tokens.idToken()))
    // console.log(decodeIdToken(tokens.refreshToken() ?? ''))

    if (!claims || !claims.sub) {
      throw createError({
        message: '`id` token or subject missing!',
        statusCode: 500,
      })
    }

    const existingUser = db
      .prepare(`SELECT id FROM user WHERE id = ?`)
      .get(claims.sub)

    if (existingUser) {
      const session = await lucia.createSession(claims.sub, {
        access_token: tokens.accessToken(),
        access_token_expires_at: tokens.accessTokenExpiresAt().getTime(),
        id_token: tokens.idToken(),
        refresh_token: tokens.refreshToken() || undefined,
        refresh_token_expires_at:
          'refresh_expires_in' in tokens.data &&
          typeof tokens.data.refresh_expires_in === 'number'
            ? new Date(
                Date.now() + tokens.data.refresh_expires_in * 1000,
              ).getTime()
            : undefined,
      })
      appendHeader(
        event,
        'Set-Cookie',
        lucia.createSessionCookie(session.id).serialize(),
      )
      return sendRedirect(event, '/')
    }

    // Replace this with your own DB client.
    db.prepare(`INSERT INTO user VALUES (?)`).run(claims.sub)

    const session = await lucia.createSession(claims.sub, {
      access_token: tokens.accessToken(),
      access_token_expires_at: tokens.accessTokenExpiresAt().getTime(),
      id_token: tokens.idToken(),
      refresh_token: tokens.refreshToken() || undefined,
      refresh_token_expires_at:
        'refresh_expires_in' in tokens.data &&
        typeof tokens.data.refresh_expires_in === 'number'
          ? new Date(
              Date.now() + tokens.data.refresh_expires_in * 1000,
            ).getTime()
          : undefined,
    })
    appendHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize(),
    )
    return sendRedirect(event, '/')
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      throw createError({
        ...e,
        statusCode: 400,
      })
    }

    if (e instanceof ArcticFetchError) {
      throw createError({
        ...e,
        statusCode: 500,
      })
    }

    if (e instanceof Error) {
      throw createError({
        ...e,
        statusCode: 500,
      })
    }

    throw createError({
      statusCode: 500,
    })
  }
})
