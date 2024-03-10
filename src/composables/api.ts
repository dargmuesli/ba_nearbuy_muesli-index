export const useNearbuyFetch = () => {
  const userSession = useUserSession()
  const companyId = useCompanyId()

  return $fetch.create({
    baseURL:
      process.env.NODE_ENV === 'production'
        ? 'https://api.staging.nearbuy-food.de/v1/'
        : 'http://localhost:8080/v1/',
    headers: {
      ...(userSession.value
        ? { Authorization: `Bearer ${userSession.value.accessToken}` }
        : {}),
      ...(companyId ? { 'Current-Company': companyId.value } : {}),
    },
  })
}
