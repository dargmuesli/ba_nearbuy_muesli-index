export default function ({ app }) {
  app.$auth.onError((error, name, _endpoint) => {
    console.error(name, error)
  })
}
