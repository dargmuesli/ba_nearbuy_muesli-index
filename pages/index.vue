<template>
  <div class="flex flex-col items-center">
    <div v-if="index !== undefined">
      <progress :value="index" max="10">{{ index }}</progress>
    </div>
    <p v-if="loading">
      {{ $t('loading') }}
    </p>
    <div v-else>
      <div v-if="offers">
        <span>{{ $t('metaOffer') }}</span>
        <ul>
          <li v-for="offer in offers" :key="offer.id">
            {{ `${offer.totalAmount} ${offer.unit} ${offer.name}` }}
          </li>
        </ul>
      </div>
    </div>
    <div>
      <nb-button @nbButtonEvent="read">
        {{ $t('read') }}
      </nb-button>
      <nb-button :disabled="!company" @nbButtonEvent="write">
        {{ $t('write') }}
      </nb-button>
      <nb-button secondary @nbButtonEvent="logOut">
        {{ $t('logOut') }}
      </nb-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

const consola = require('consola')

export default defineComponent({
  data() {
    return {
      company: undefined,
      loading: false,
      offers: undefined,
      request: undefined,
    }
  },
  computed: {
    index() {
      if (!this.offers) return

      let index = 0

      for (const offer of this.offers as any) {
        if (offer.name === 'OAT') {
          index += offer.totalAmount
        }
      }

      return index
    },
  },
  methods: {
    async read() {
      this.loading = true
      const me = await this.$axios.$get('persons/me')

      const employments = await this.$axios.$get(
        `persons/${this.trimId(me.links.self)}/employments`
      )
      if (!employments || employments.length === 0) {
        this.loading = false
        return consola.error('There is no employment!')
      }

      const company = await this.$axios.$get(
        `companies/${this.trimId(employments[0].links.company)}`
      )
      if (!company) {
        this.loading = false
        return consola.error('There is no company!')
      }

      this.company = company

      const offers = await this.$axios.$get(
        `companies/${this.trimId(employments[0].links.company)}/offers`
      )
      if (!offers) {
        this.loading = false
        return consola.error('There are no offers!')
      }

      for (const offer of offers) {
        const category = await this.$axios.$get(
          `ontofood/${this.trimId(offer.links.category)}`
        )
        if (!category) {
          this.loading = false
          return consola.error('There are no categories!')
        }

        offer.name = category.label
      }

      this.offers = offers

      this.loading = false
    },
    getRandomInt(max: number) {
      return Math.floor(Math.random() * max)
    },
    async logOut() {
      await this.$auth.logout()
    },
    trimId(id: string) {
      return id.replace(/^.*\//, '')
    },
    async write() {
      if (!this.company) return

      const request = await this.$axios.$post(
        `companies/${this.trimId((this.company as any).links.self)}/requests`,
        {
          dateFrom: '2022-01-04T00:00:00.000Z',
          dateEnd: '2022-02-05T00:00:00.000Z',
          description: '',
          category:
            'http://localhost:8080/v1/ontofood/ff2c344a-f6e3-4bd8-9b19-0d25b94bec06',
          unit: 'Liter',
          totalAmount: this.getRandomInt(3) + 1,
          levelsOfProcessing: [],
          active: true,
          contact:
            'http://localhost:8080/v1/contacts/ac6e3532-63fe-4e29-bf61-d3af1faa239b',
        }
      )
      if (!request) {
        this.loading = false
        return consola.error('There is no company!')
      }

      this.request = request
      this.loading = false
      alert('Success')
    },
  },
  // https://auth.nearbuy-food.de/auth/js/keycloak.js
})
</script>

<i18n lang="yml">
de:
  loading: Lade...
  logOut: Ausloggen
  metaOffer: 'Es gibt die folgenden Angebote:'
  read: Angebote anzeigen
  write: Gesuch erstellen
en:
  loading: Loading...
  logOut: Log out
  metaOffer: 'There are the following offers:'
  read: Display offers
  write: Create request
</i18n>
