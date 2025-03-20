<template>
  <div class="flex flex-col items-center">
    <div v-if="progress !== undefined">
      <progress :value="progress" max="10">{{ progress }}</progress>
    </div>
    <p v-if="isLoading">
      {{ t('loading') }}
    </p>
    <div v-else>
      <div v-if="offers">
        <span>{{ t('metaOffer') }}</span>
        <ul>
          <li v-for="offer in offers" :key="offer.id">
            {{ `${offer.totalAmount} ${offer.unit} ${offer.name}` }}
          </li>
        </ul>
      </div>
    </div>
    <div class="flex gap-4">
      <nb-button @nbButtonEvent="read">
        {{ t('read') }}
      </nb-button>
      <nb-button :disabled="!company" @nbButtonEvent="write">
        {{ t('write') }}
      </nb-button>
      <nb-button text @nbButtonEvent="logOut">
        {{ t('logOut') }}
      </nb-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { consola } from 'consola'

const nearbuyFetch = useNearbuyFetch()
const { t } = useI18n()
const companyId = useCompanyId()

// data
const company = ref()
const isLoading = ref()
const offers = ref()
const request = ref()

// computations
const progress = computed(() => {
  if (!offers.value) return

  let index = 0

  for (const offer of offers.value) {
    if (offer.name === 'OAT') {
      index += offer.totalAmount
    }
  }

  return index
})

// methods
const read = async () => {
  isLoading.value = true

  try {
    const me = await nearbuyFetch<{ links: { self: 'string' } }>('persons/me')

    const employments = await nearbuyFetch<{ links: { company: 'string' } }[]>(
      `persons/${trimId(me.links.self)}/employments`,
    )
    if (!employments || !employments[0]) {
      isLoading.value = false
      return consola.error('There is no employment!')
    }

    const companyFetched = await nearbuyFetch(
      `companies/${trimId(employments[0].links.company)}`,
    )
    if (!companyFetched) {
      isLoading.value = false
      return consola.error('There is no company!')
    }

    company.value = companyFetched
    companyId.value = trimId(employments[0].links.company)

    const offersFetched = await nearbuyFetch<
      { name: string; links: { category: 'string' } }[]
    >(`companies/${trimId(employments[0].links.company)}/offers`)

    if (!offersFetched) {
      isLoading.value = false
      return consola.error('There are no offers!')
    }

    for (const offer of offersFetched) {
      const category = await nearbuyFetch<{ label: string }>(
        `ontofood/${trimId(offer.links.category)}`,
      )
      if (!category) {
        isLoading.value = false
        return consola.error('There are no categories!')
      }

      offer.name = category.label
    }

    offers.value = offersFetched
  } catch (exception) {
    alert(exception)
  }

  isLoading.value = false
}

const getRandomInt = (max: number) => Math.floor(Math.random() * max)
const logOut = async () => {
  await $fetch('/api/logout', {
    method: 'POST',
  })
  await navigateTo('/login')
}
const trimId = (id: string) => id.replace(/^.*\//, '')
const write = async () => {
  if (!company.value) return

  const me = await nearbuyFetch<{ links: { self: 'string' } }>('persons/me')
  const employment = (
    await nearbuyFetch<{ id: string; links: { company: string } }[]>(
      `persons/${trimId(me.links.self)}/employments`,
    )
  )[0]

  if (!employment) return

  const companyContacts = await nearbuyFetch<string[]>(
    `companies/${trimId(employment.links.company)}/contacts`,
  )

  for (const companyContact of companyContacts) {
    const contact = await nearbuyFetch<{
      links: { person: 'string'; self: string }
    }>(`contacts/${trimId(companyContact)}`)

    if (me.links.self === contact.links.person) {
      await fetchRequest(contact)
      isLoading.value = false
      return
    }
  }

  const contact = await nearbuyFetch<{ links: { self: string } }>(
    `employments/${employment.id}/contact`,
    {
      method: 'POST',
      body: {
        phone: '',
        fax: '',
        email: '',
        responsibility: '',
        isProcurement: false,
        isSales: false,
      },
    },
  )

  await fetchRequest(contact)
}
const fetchRequest = async (contact: { links: { self: string } }) => {
  if (!company.value.address) {
    await nearbuyFetch(
      `companies/${trimId(company.value.links.self)}/addresses`,
      {
        method: 'POST',
        body: {
          street: 'Königstor 2',
          zipcode: '34117',
          city: 'Kassel',
          type: 'MAIN',
          lat: 51.3130604,
          lon: 9.48862355016594,
          name: '',
          suffix: '',
          links: { self: '', update: '', remove: '', company: '' },
        },
      },
    )
  }

  const requestFetched = await nearbuyFetch(
    `companies/${trimId(company.value.links.self)}/requests`,
    {
      method: 'POST',
      body: {
        active: true,
        category:
          'http://localhost:8080/v1/ontofood/ff2c344a-f6e3-4bd8-9b19-0d25b94bec06',
        contact: contact.links.self,
        dateEnd: '2024-03-19T23:00:00.000Z',
        dateFrom: '2024-03-09T23:00:00.000Z',
        description: '',
        levelsOfProcessing: [],
        totalAmount: getRandomInt(3) + 1,
        unit: 'Liter',
      },
    },
  )

  if (!requestFetched) {
    isLoading.value = false
    return consola.error('There is no company!')
  }

  request.value = requestFetched
  alert('Success')
}
</script>

<i18n lang="yaml">
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
