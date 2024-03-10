import { renderToString } from '@ninjaneers/nearbuy-web-components/hydrate'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', async (html) => {
    for (const [key, value] of html.body.entries()) {
      html.body[key] = (await renderToString(value)).html
    }
  })
})
