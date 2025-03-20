<template>
  <div>
    <header>
      <div v-if="route.query.error" class="bg-yellow-300 px-4 py-2 text-center">
        {{ t('error', { error: route.query.error }) }}
      </div>
      <div v-if="user" class="bg-green-300 px-4 py-2 text-center">
        {{
          t('hello', {
            name,
            permission,
          })
        }}
      </div>
    </header>
    <main class="h-screen">
      <div class="flex h-full flex-col items-center justify-center">
        <img
          alt="muesli"
          height="200"
          src="/assets/static/favicon/safari-pinned-tab.svg"
          width="200"
        />
        <h1 class="mb-8 text-4xl font-bold">{{ t('heading') }}</h1>
        <slot />
      </div>
    </main>
    <footer class="text-center">
      <div class="flex justify-center gap-2">
        {{ t('theme') }}
        <span>
          <input
            id="nearbuy"
            checked
            name="color"
            type="radio"
            value="nearbuy"
          />
          <label for="nearbuy">{{ t('nearbuy') }}</label>
        </span>
        <span>
          <input
            id="muesliIndex"
            name="color"
            type="radio"
            value="muesliIndex"
          />
          <label for="muesliIndex">{{ t('muesliIndex') }}</label>
        </span>
      </div>
      <a href="https://thenounproject.com/search/?q=muesli&i=1505906">
        {{ t('iconCredits') }}
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { parseJWT } from 'oslo/jwt'

const { t } = useI18n()
const route = useRoute()
const user = useUser()
const userSession = useUserSession()

// computations
const name = computed(() => {
  const idTokenPayload = userSession.value
    ? (parseJWT(userSession.value.idToken)?.payload as {
        preferred_username: string
      })
    : undefined

  return idTokenPayload?.preferred_username
})
const permission = computed(() => {
  const accessTokenPayload = userSession.value
    ? (parseJWT(userSession.value.accessToken)?.payload as { scope: string })
    : undefined

  return accessTokenPayload?.scope.includes('offer-write') ? 'write' : 'read'
})

// lifecycle
onMounted(() => {
  const radios = document.querySelectorAll('input[type=radio]')

  for (const radio of radios) {
    radio.addEventListener('change', function (event: InputEvent) {
      if ((event.target as HTMLInputElement).value === 'nearbuy') {
        document.body.style.removeProperty('--nb-color-primary')
        document.body.classList.remove('theme-muesli-index')
      } else if ((event.target as HTMLInputElement).value === 'muesliIndex') {
        document.body.style.setProperty(
          '--nb-color-primary',
          'rgb(59, 130, 246)',
        )
        document.body.classList.add('theme-muesli-index')
      }
    } as EventListener)
  }
})

useServerHeadSafe({
  link: [
    {
      href: '/assets/static/favicon/apple-touch-icon.png?v=0.0.0',
      rel: 'apple-touch-icon',
      sizes: '180x180',
    },
    {
      href: '/assets/static/favicon/favicon-16x16.png?v=0.0.0',
      rel: 'icon',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      href: '/assets/static/favicon/favicon-32x32.png?v=0.0.0',
      rel: 'icon',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      href: '/assets/static/favicon/favicon.ico',
      rel: 'icon',
      type: 'image/x-icon',
    },
    {
      href: '/assets/static/favicon/site.webmanifest?v=0.0.0',
      rel: 'manifest',
    },
    {
      color: '#ee976e',
      href: '/assets/static/favicon/safari-pinned-tab.svg?v=0.0.0',
      rel: 'mask-icon',
    },
    {
      href: '/assets/static/favicon/favicon.ico?v=0.0.0',
      rel: 'shortcut icon',
    },
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'description',
      content:
        'Calculates the "Muesli index", representing the availability of ingredients required for a yummy muesli. Requests for missing ingredients can be added with one click.',
    },
    { name: 'format-detection', content: 'telephone=no' },
    {
      content: '/assets/static/favicon/browserconfig.xml?v=0.0.0',
      name: 'msapplication-config',
    },
  ],
  title: 'Nearbuy Muesli Index',
})
useServerHead({ meta: [{ charset: 'utf-8' }] })
</script>

<i18n lang="yaml">
de:
  error: 'Fehler: {error}'
  heading: 'Nearbuy: Muesli Index'
  hello: Hallo {name}! Du hast {permission}-Berechtigungen.
  iconCredits: Icon "Muesli" von Marina Rico über the Noun Project
  muesliIndex: Muesli Index
  nearbuy: Nearbuy
  theme: 'Thema:'
en:
  error: 'Error: {error}'
  heading: 'Nearbuy: Muesli Index'
  hello: Hello {name}! You have {permission} permissions.
  iconCredits: Icon "Muesli" by Marina Rico from the Noun Project
  muesliIndex: Muesli Index
  nearbuy: Nearbuy
  theme: 'Theme:'
</i18n>
