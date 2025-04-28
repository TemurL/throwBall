<script setup>
import { RouterView } from 'vue-router';
import Header from './components/Header.vue';
import { Analytics } from '@vercel/analytics/vue';
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <Analytics />
  <Header/>
  <RouterView />
  <SpeedInsights />
</template>

<style scoped>
</style>
