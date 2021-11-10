<template>
  <div class="flex flex-col items-center space-y-2">
    <!-- <nb-button
      :name.prop="{ first: 'Jonas', last: 'Thelemann' }"
      @nbButtonEvent="nbButtonEvent"
    /> -->
    <nb-button @nbButtonEvent="logInR">
      {{ $t('logInR') }}
    </nb-button>
    <nb-button @nbButtonEvent="logInRW">
      {{ $t('logInRW') }}
    </nb-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  methods: {
    nbButtonEvent(event: any) {
      console.log(event.detail.first)
    },
    async logInR() {
      await this.$auth.loginWith('keycloak')
    },
    async logInRW() {
      await this.$auth.loginWith('keycloak', {
        params: { scope: 'openid profile email offer-write' },
      })
    },
  },
})
</script>

<i18n lang="yml">
de:
  logInR: Einloggen mit nearbuy (r)
  logInRW: Einloggen mit nearbuy (rw)
en:
  logInR: Log in with nearbuy (r)
  logInRW: Log in with nearbuy (rw)
</i18n>
