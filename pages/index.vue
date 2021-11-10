<template>
  <div class="flex flex-col items-center">
    <p v-if="company">
      {{
        $t('metaCompany', {
          company: [
            company.name,
            ...(company.legalstatus ? [company.legalstatus] : []),
          ].join(' '),
        })
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
    }
  },
  methods: {
    async fetch() {
      const me = await this.$axios.$get('persons/me')
      console.log(me.links.self)
      // const employments = await this.$axios.$get(
      //   `persons/${this.trimId(me.links.self)}/employments`
      // )
      // console.log(employments)
      // const company = await this.$axios.$get(
      //   `companies/${this.trimId(employments[0].links.company)}`
      // )
      // console.log(company)
      // this.company = company
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
  fetch: Laden
  logOut: Ausloggen
  metaCompany: Du arbeitest bei {company}.
en:
  fetch: Fetch
  logOut: Log out
  metaCompany: You work at {company}.
</i18n>
