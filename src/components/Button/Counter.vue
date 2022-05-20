<script setup lang="ts">
import { useCounter } from '@vueuse/core';

const props = defineProps<{
  liked?: boolean
  likes?: number 
}>()

const { count, inc, dec, set, reset } = useCounter()

</script>

<template>
  <div class="fixed right-5 bottom-5 z-1">
    <button
      @click="inc()"
    >
      <!-- <ant-like class="text-sm flex flex-wrap justify-center" /> -->
    </button>
  </div>
</template>