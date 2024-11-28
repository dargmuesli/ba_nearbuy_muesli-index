import { ArcticFetchError, OAuth2RequestError } from 'arctic'
import { parseJWT } from 'oslo/jwt'

// type KeycloakUser = {
//   exp: number
//   iat: number
//   auth_time: number
//   jti: string
//   iss: string
//   aud: string
//   sub: string
//   typ: string
//   azp: string
//   session_state: string
//   at_hash: string
//   acr: string
//   sid: string
//   email_verified: boolean
//   name: string
//   preferred_username: string
//   given_name: string
//   locale: string
//   family_name: string
//   email: string
//   picture: string
//   user: any
// }

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
    const id = parseJWT(tokens.idToken())
    // console.log(parseJWT(tokens.accessToken())!.payload)
    // console.log(parseJWT(tokens.idToken())!.payload)
    // console.log(parseJWT(tokens.refreshToken() ?? '')!.payload)

    if (!id || !id.subject) {
      throw createError({
        message: '`id` token or subject missing!',
        statusCode: 500,
      })
    }

    const existingUser = db
      .prepare(`SELECT id FROM user WHERE id = ?`)
      .get(id.subject)

    if (existingUser) {
      const session = await lucia.createSession(id.subject, {
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
    db.prepare(`INSERT INTO user VALUES (?)`).run(id.subject)

    const session = await lucia.createSession(id.subject, {
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
