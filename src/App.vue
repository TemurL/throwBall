<script setup>
import { RouterView } from 'vue-router';
import Header from './components/Header.vue';
import { Analytics } from '@vercel/analytics';

</script>

<template>
  <Header/>
  <RouterView />
  <Analytics />
</template>

<style scoped>
</style>
