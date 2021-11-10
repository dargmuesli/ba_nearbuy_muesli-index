export default function ({ app }) {
  const redirect = app.$auth.$storage.options.redirect
  for (const key in redirect) {
    redirect[key] =
      (app.i18n.locale === 'en' ? '' : '/' + app.i18n.locale) + redirect[key]
  }
  app.$auth.$storage.options.redirect = redirect

  app.$auth.onError((error, name, _endpoint) => {
    console.error(name, error)
  })
}
