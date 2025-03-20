<template>
  <div class="relative isolate hyphens-auto">
    <NuxtLayout>
      <!-- `NuxtLayout` can't have mulitple child nodes (https://github.com/nuxt/nuxt/issues/21759) -->
      <NuxtPage />
    </NuxtLayout>
    <NuxtLoadingIndicator color="#fff" />
  </div>
</template>
