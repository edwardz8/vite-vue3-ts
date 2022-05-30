<script setup lang="ts">
import { isClient, useEventListener } from "@vueuse/core";
import { slug, limitString } from "~/utils";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const { frontmatter } = defineProps<{ frontmatter }>();

const router = useRoute();
const routes = router.fullPath;
let url = "";
if (typeof window !== "undefined") {
  url = window.location.origin + routes;
}

if (isClient) {
  const navigate = () => {
    if (location.hash) {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEventListener(window, "hashchange", navigate, false);

  onMounted(() => {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const href = a.getAttribute("href");
        history.replaceState({}, "", href);
        navigate();
      });
    });

    navigate();
    setTimeout(navigate, 500);
  });
}
</script>

<template>
  <div class="py-5 px-4">
    <h1
      class="mb-5 text-transparent bg-clip-text bg-gradient-to-r text-center font-bold text-5xl from-blog-500 to-blog-700 dark:from-dark-repulser-500 dark:to-dark-repulser-300 md:block"
    >
      {{ frontmatter.name }}
    </h1>
    <p class="text-center font-normal mb-5 text-dark-100 dark:text-blog-50">
      {{ frontmatter.description }}
    </p>
    <div class="flex flex-row flex-wrap justify-center">
      <carbon-calendar class="mr-1 mt-2px dark:text-blog-50" />
      <p class="text-center text-dark-100 font-light mb-5 dark:text-blog-50">
        {{ new Date(frontmatter.date).toDateString() }}
      </p>
    </div>
    <Tag :tags="frontmatter.tags" class="mb-5 flex flex-row justify-center" />
    <img
      :src="frontmatter.thumbnail"
      :alt="`thumbnail-${frontmatter.name}`"
      class="w-full h-md object-cover rounded-md shadow-lg"
      loading="lazy"
    />
    <div
      class="mt-5 mb-5 text-blog-500 divide-y dark:text-blog-50"
      style="border-bottom: 1px solid #63c0b6"
    >
      <slot />
    </div>
</template>
