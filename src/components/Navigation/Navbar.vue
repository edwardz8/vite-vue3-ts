<script setup lang="ts">
import { isDark, toggleDark, slug } from "~/utils";
import type { NavbarMenu } from "~/types";
import { useToggle, onKeyStroke, onClickOutside } from "@vueuse/core";
import { ref } from "vue";
import { useRouter } from "vue-router";

// https://vueuse.org/shared/useToggle/
const [search, setSearch] = useToggle();
const [open, setOpen] = useToggle();

// https://vueuse.org/core/onKeyStroke/
onKeyStroke("Escape", () => {
  search.value = false;
});
onKeyStroke("Escape", () => {
  open.value = false;
});

// https://vueuse.org/core/onClickOutside/
const modalSearch = ref(null);
onClickOutside(modalSearch, (e) => {
  search.value = false;
});

const navbottom = ref(null);
onClickOutside(navbottom, (e) => {
  open.value = false;
});

// Search article
const searchArticle = ref("");
const router = useRouter();
const goSearch = () => {
  if (searchArticle.value) {
    router.push(`/search/${slug(searchArticle.value)}`).then(() => {
      search.value = false;
      searchArticle.value = "";
    });
  }
};

// Hide navbottom after page has been changed
router.afterEach(() => {
  open.value = false;
});

// Navbar list
const dataNavbar: NavbarMenu[] = [
  {
    name: "Home",
    to: "/",
  },
  /* {
    name: "Work",
    to: "/projects",
  }, */
  {
    name: "About",
    to: "/about",
  },
  {
    name: "Articles",
    to: "/articles",
  },
];
</script>

<template>
  <nav
    class="z-10 text-blog-700 dark:text-dark-repulser-400 relative h-20 px-4"
    role="navigation"
    aria-label="navbar"
  >
    <div class="max-w-screen-lg mx-auto h-full flex flex-row items-center space-x-4">
      <div class="logo flex-1">
        <router-link to="/" class="font-bold lg:tracking-wide text-2xl">
          zach
        </router-link>
      </div>
      <div class="flex flex-wrap items-center">
        <router-link
          v-for="(data, i) in dataNavbar"
          :key="i"
          class="mr-5 py-1.5 px-3 rounded-md text-blog-700 dark:text-dark-repulser-400 dark:hover:text-blog-300 hover:text-gray-900 hidden lg:block"
          :to="data.to"
          active-class="bg-gray-200 dark:bg-gray-500 dark:text-dark-repulser-200"
          >{{ data.name }}</router-link
        >
        <!-- <carbon-sun
          v-if="isDark"
          class="mr-5 cursor-pointer text-blog-700 dark:text-dark-repulser-400"
          tabindex="0"
          @click="toggleDark"
          title="Toggle light mode"
        />
        <carbon-moon
          v-else
          class="mr-5 cursor-pointer text-blog-700 dark:text-dark-repulser-400"
          tabindex="0"
          @click="toggleDark"
          title="Toggle dark mode"
        /> -->
        <carbon-search
          class="mr-5 cursor-pointer text-blog-700 dark:text-dark-repulser-400"
          tabindex="0"
          @click="setSearch"
          title="Search articles.."
        />
        <a
          href="https://github.com/edwardz8"
          target="_blank"
          rel="noreferrer"
          title="repository github"
        >
          <uil-github
            class="flex cursor-pointer text-blog-700 dark:text-dark-repulser-400"
          />
        </a>
        <carbon-menu
          class="cursor-pointer text-blog-700 dark:text-dark-repulser-400 ml-5 sm:block lg:hidden"
          tabindex="0"
          @click="setOpen"
        />
      </div>
    </div>
  </nav>

  <!-- Nav bottom -->
  <!-- :class="open ? "block translate-y-0" : "hidden translate-y-full"" -->
  <nav
    v-if="open"
    ref="navbottom"
    class="py-4 px-8 bg-blog-100 dark:bg-blog-600 fixed bottom-0 z-99 inset-x-0 rounded-t-lg shadow-lg overflow-x-hidden overflow-y-hidden lg:hidden"
  >
    <ul class="flex flex-col">
      <router-link to="/" class="bg-blog-50 dark:bg-blog-500 p-2 mb-2 rounded-md">
        <li class="flex flex-row flex-wrap items-center dark:text-blog-100">
          <carbon-home class="mr-2" />Home
        </li>
      </router-link>
      <!-- <router-link to="/projects" class="bg-blog-50 dark:bg-blog-500 p-2 mb-2 rounded-md">
        <li class="flex flex-row flex-wrap items-center dark:text-blog-100">
          <carbon-table-of-contents class="mr-2" />Work
        </li>
      </router-link> -->
      <router-link to="/about" class="bg-blog-50 dark:bg-blog-500 p-2 mb-2 rounded-md">
        <li class="flex flex-row flex-wrap items-center dark:text-blog-100">
          <uil-document-layout-center class="mr-2" />About
        </li>
      </router-link>
      <router-link to="/articles" class="bg-blog-50 dark:bg-blog-500 p-2 mb-2 rounded-md">
        <li class="flex flex-row flex-wrap items-center dark:text-blog-100">
          <carbon-table-of-contents class="mr-2" />Articles
        </li>
      </router-link>
    </ul>
  </nav>
  <!-- Search -->
  <div
    v-if="search"
    class="fixed overflow-x-hidden overflow-y-hidden inset-8 flex justify-content items-center z-50"
  >
    <div ref="modalSearch" class="relative mx-auto w-auto max-w-2xl">
      <carbon-search
        class="absolute right-8 top-4 text-xl text-gray-400 cursor-pointer"
        @click="goSearch"
      />
      <input
        ref="search"
        v-model="searchArticle"
        type="text"
        class="bg-white shadow rounded border-0 w-lg h-14 py-5 px-5 focus:outline-none"
        placeholder="Search articles here..."
        @keydown.enter="goSearch"
      />
    </div>
    <!-- :class="open ? "lg:hidden" : ''" -->
  </div>
  <div v-if="search || open" class="fixed inset-0 z-40 opacity-60 bg-dark-200" />
</template>

<style lang="scss">
.active-class {
  @apply p-2 mb-2 rounded-md bg-blog-200 dark:bg-blog-700;
}
</style>
