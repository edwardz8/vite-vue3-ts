<script setup>
import { ref, computed } from "vue";
import { getProjects, paginateProjectsData } from "~/data";
import { slug, limitString } from "~/utils";

// Get projects data
const currentPage = ref(1);

const projects = computed(() => {
  const projects = getProjects();
  const paginate = paginateProjectsData({
    projects: projects,
    currentPage: currentPage.value,
    pageSize: 3,
  });
  return paginate;
});

// Pagination
const clickStartPage = () => {
  currentPage.value = projects.value.startPage;
};
const clickPaginate = (paginate) => {
  currentPage.value = paginate;
};
const clickEndPage = () => {
  currentPage.value = projects.value.endPage;
};
</script>

<template>
  <div class="flex flex-col flex-wrap mb-2 px-4 lg:px-0">
    <h1 class="text-blog-700 dark:text-dark-repulser-400 font-bold">Past Work</h1>
    <h3 class="mt-1 text-blog-700 dark:text-dark-repulser-400">
      <!-- Total projects: {{ getProjects().length }} -->
    </h3>
    <div
      class="grid inline-grid gap-4 py-6 mb-2 lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2"
    >
      <Project
        v-for="(data, i) in projects.listProjects"
        :key="i"
        :image="data.meta.frontmatter.thumbnail"
        :alt="`blog-banner-${slug(data.meta.frontmatter.name)}`"
        :date="`${new Date(data.meta.frontmatter.date).toDateString()}`"
        :title="data.meta.frontmatter.name"
        :description="limitString(data.meta.frontmatter.description, 100)"
        :to="data.path"
      />
    </div>
    <div class="flex flex-wrap justify-center items-center mb-5">
      <Paginate
        :start-page="projects.startPage"
        :end-page="projects.endPage"
        :mid="projects.mid"
        :current-page="currentPage"
        :click-start-page="clickStartPage"
        :click-paginate="clickPaginate"
        :click-end-page="clickEndPage"
      />
    </div>
  </div>
</template>
