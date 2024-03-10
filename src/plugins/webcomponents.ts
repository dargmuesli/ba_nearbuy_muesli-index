import { ComponentLibrary } from '@ninjaneers/nearbuy-web-components_vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ComponentLibrary)
})
