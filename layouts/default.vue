<template>
  <div>
    <header>
      <div
        v-if="$route.query.error"
        class="bg-yellow-300 px-4 py-2 text-center"
      >
        {{ $t('error', { error: $route.query.error }) }}
      </div>
      <div v-if="$auth.loggedIn" class="bg-green-300 px-4 py-2 text-center">
        {{
          $t('hello', {
            name: $auth.user.name,
            permission: $auth.hasScope('offer-write') ? 'rw' : 'r',
          })
        }}
      </div>
    </header>
    <main class="h-screen">
      <div class="items-center flex flex-col h-full justify-center">
        <img
          alt="muesli"
          height="200"
          src="/assets/static/favicon/safari-pinned-tab.svg"
          width="200"
        />
        <h1 class="font-bold mb-8 text-4xl">{{ $t('heading') }}</h1>
        <nuxt />
      </div>
    </main>
    <footer class="text-center">
      <p>
        {{ $t('theme') }}
        <input id="nearbuy" name="color" type="radio" value="nearbuy" />
        <label for="nearbuy">{{ $t('nearbuy') }}</label>
        <input
          id="muesliIndex"
          checked
          name="color"
          type="radio"
          value="muesliIndex"
        />
        <label for="muesliIndex">{{ $t('muesliIndex') }}</label>
      </p>
      <a href="https://thenounproject.com/search/?q=muesli&i=1505906">
        {{ $t('iconCredits') }}
      </a>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true })
  },
  mounted() {
    // console.log(this.$auth.strategy.token.get())
    const radios = document.querySelectorAll('input[type=radio]')

    for (let i = 0; i < radios.length; i++) {
      radios[i].addEventListener('change', function (event: InputEvent) {
        if ((event.target as HTMLInputElement).value === 'nearbuy') {
          document.body.style.setProperty('--color-primary', '#92BE9B')
        } else if ((event.target as HTMLInputElement).value === 'muesliIndex') {
          document.body.style.setProperty(
            '--color-primary',
            'rgb(59, 130, 246)'
          )
        }
      } as EventListener)
    }
  },
})
</script>

<i18n lang="yml">
de:
  error: 'Fehler: {error}'
  heading: 'Nearbuy: Muesli Index'
  hello: Hallo {name}! ({permission})
  iconCredits: Icon "Muesli" von Marina Rico über the Noun Project
  muesliIndex: Muesli Index
  nearbuy: Nearbuy
  theme: 'Thema:'
en:
  error: 'Error: {error}'
  heading: 'Nearbuy: Muesli Index'
  hello: Hello {name}! ({permission})
  iconCredits: Icon "Muesli" by Marina Rico from the Noun Project
  muesliIndex: Muesli Index
  nearbuy: Nearbuy
  theme: 'Theme:'
</i18n>
