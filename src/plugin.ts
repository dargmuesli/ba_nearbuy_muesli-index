// import type { NearbuyPluginOptions } from '@ninjaneers/nearbuy-web-plugins' // TODO: enable once vite landed (https://youtrack.ninjaneers.de/youtrack/issue/NEARBUY-2556)
import packageJson from './package.json'

const nearbuyPluginMuesliIndex /* : NearbuyPluginOptions */ = {
  id: packageJson.name,
  name: {
    de: 'Muesli-Index',
    en: 'Muesli Index',
  },
  description: {
    de: 'Berechnet den "Muesli-Index", der die Verfügbarkeit der für ein leckeres Müsli benötigten Zutaten angibt. Anfragen für fehlende Zutaten können mit einem Klick hinzugefügt werden.',
    en: 'Calculates the "Muesli index", representing the availability of ingredients required for a yummy muesli. Requests for missing ingredients can be added with one click.',
  },
  version: packageJson.version,
  versionNearbuyCompatibility: '^0.1.0',
  // TODO: define plugin at runtime
  // eslint-disable-next-line compat/compat
  url: new URL('https://github.com/dargmuesli/ba_nearbuy_muesli-index'),
  iconPngBase64:
    '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',
  entryPoints: {
    plugin: {
      contentUrl:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3001/'
          : 'https://nearbuy_muesli-index.jonas-thelemann.de/',
    },
  },
}

export default nearbuyPluginMuesliIndex
