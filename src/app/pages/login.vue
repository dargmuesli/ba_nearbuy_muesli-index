<template>
  <div class="flex flex-col items-center space-y-2">
    <nb-button
      :name.prop="{ first: 'Read', last: 'Mode' }"
      @nbButtonEvent="logInR"
    >
      {{ t('logIn', { mode: 'r' }) }}
    </nb-button>
    <nb-button
      :name.prop="{ first: 'Read-Write', last: 'Mode' }"
      @nbButtonEvent="logInRw"
    >
      {{ t('logIn', { mode: 'rw' }) }}
    </nb-button>
  </div>
</template>

<script setup lang="ts">
interface LogInOptions {
  isWritable: boolean
}

const { t } = useI18n()

// methods
const logIn = async (e: CustomEvent<string>, options?: LogInOptions) => {
  alert(`[DEBUG] Submitted with name "${e.detail}".`)
  await navigateTo(
    {
      path: '/login/keycloak',
      query: options?.isWritable
        ? { scope: 'openid profile email nearbuy-offer-write' }
        : undefined,
    },
    { external: true },
  )
}
const logInR = async (e: CustomEvent<string>) => {
  await logIn(e)
}
const logInRw = async (e: CustomEvent<string>) => {
  await logIn(e, { isWritable: true })
}
</script>

<i18n lang="yaml">
de:
  logIn: Einloggen mit nearbuy [{mode}]
en:
  logIn: Log in with nearbuy [{mode}]
</i18n>
