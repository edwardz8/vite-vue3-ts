<script setup lang="ts">
import { useHead } from "@vueuse/head";
// import HelloWorld from './components/HelloWorld.vue'

// https://github.com/vueuse/head
useHead({
  title: "zed8.dev",
  meta: [
    {
      name: "description",
      content: "blog built with vue and vite",
    },
  ],
});
</script>

<template>
  <!-- <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->

  <div class="min-h-100vh overflow-hidden block relative pb-30 mx-auto flex flex-col">
    <Navbar />
    <main class="mx-auto mt-4 min-h-prose w-full lg:max-w-screen-lg">
      <router-view :key="$route.path" />
      <ToTopBtn />
    </main>
    <Footer />
  </div>
</template>
