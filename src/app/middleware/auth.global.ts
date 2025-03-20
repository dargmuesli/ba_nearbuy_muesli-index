import type { Session, User } from 'lucia'

export default defineNuxtRouteMiddleware(async (to) => {
  const requestFetch = useRequestFetch()

  const user = useUser()
  const userSession = useUserSession()

  const userFetched = await requestFetch<User>('/api/user')
  const userSessionFetched = await requestFetch<Session>('/api/session')

  user.value = userFetched
  userSession.value = userSessionFetched

  if ((!userFetched || !userSessionFetched) && !to.path.startsWith('/login')) {
    return navigateTo('/login')
  }

  if (userFetched && userSessionFetched && to.path.startsWith('/login')) {
    return navigateTo('/')
  }
})
