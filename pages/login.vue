<template>
  <div class="flex flex-col items-center space-y-2">
    <nb-button
      :name.prop="{ first: 'Read', last: 'Mode' }"
      @nbButtonEvent="logInR"
    >
      {{ $t('logIn', { mode: 'r' }) }}
    </nb-button>
    <nb-button
      :name.prop="{ first: 'Read-Write', last: 'Mode' }"
      @nbButtonEvent="logInRw"
    >
      {{ $t('logIn', { mode: 'rw' }) }}
    </nb-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

interface LogInOptions {
  isWritable: Boolean
}

export default defineComponent({
  methods: {
    async logIn(e: CustomEvent<string>, options?: LogInOptions) {
      alert(`[DEBUG] Submitted with name "${e.detail}".`)
      await this.$auth.loginWith(
        'keycloak',
        options?.isWritable
          ? {
              params: { scope: 'openid profile email offer-write' },
            }
          : {}
      )
    },
    async logInR(e: CustomEvent<string>) {
      await this.logIn(e)
    },
    async logInRw(e: CustomEvent<string>) {
      await this.logIn(e, { isWritable: true })
    },
  },
})
</script>

<i18n lang="yml">
de:
  logIn: Einloggen mit nearbuy [{mode}]
en:
  logIn: Log in with nearbuy [{mode}]
</i18n>
