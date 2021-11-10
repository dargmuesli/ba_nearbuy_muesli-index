<template>
  <div class="flex flex-col items-center">
    <p v-if="loading">
      {{ $t('loading') }}
    </p>
    <p v-else>
      {{
        company
          ? $t('metaCompany', {
              company: [
                company.name,
                ...(company.legalstatus ? [company.legalstatus] : []),
              ].join(' '),
            })
          : $t('metaCompanyNone')
      }}
    </p>
    <div>
      <nb-button @nbButtonEvent="fetch">
        {{ $t('fetch') }}
      </nb-button>
      <nb-button secondary @nbButtonEvent="logOut">
        {{ $t('logOut') }}
      </nb-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  data() {
    return {
      company: undefined,
      loading: false,
    }
  },
  methods: {
    async fetch() {
      this.loading = true
      const me = await this.$axios.$get('persons/me')
      const employments = await this.$axios.$get(
        `persons/${this.trimId(me.links.self)}/employments`
      )
      const company = await this.$axios.$get(
        `companies/${this.trimId(employments[0].links.company)}`
      )
      this.company = company
      this.loading = false
    },
    async logOut() {
      await this.$auth.logout()
    },
    trimId(id: string) {
      return id.replace(/^.*\//, '')
    },
  },
  // https://auth.nearbuy-food.de/auth/js/keycloak.js
})
</script>

<i18n lang="yml">
de:
  fetch: Meine Firma anzeigen
  loading: Lade...
  logOut: Ausloggen
  metaCompany: Du arbeitest bei "{company}"!
  metaCompanyNone: Wo arbeitest du?
en:
  fetch: Display my company
  loading: Loading...
  logOut: Log out
  metaCompany: You work at "{company}"!
  metaCompanyNone: Where do you work at?
</i18n>
