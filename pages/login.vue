<template>
  <div class="flex flex-col items-center space-y-2">
    <MyComponent
      :onFirstLastE="(e) => console.log(e)"
      :firstLast="{ first: '321', last: 'Jonas' }"
    />
    <button
      class="bg-green-600 font-bold px-4 py-2 rounded text-white text-xl"
      type="button"
      @click="logInR"
    >
      {{ $t('logInR') }}
    </button>
    <button
      class="bg-green-600 font-bold px-4 py-2 rounded text-white text-xl"
      type="button"
      @click="logInRW"
    >
      {{ $t('logInRW') }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

// import { MyComponent } from 'component-library-vue'

export default defineComponent({
  // components: [MyComponent],
  methods: {
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
