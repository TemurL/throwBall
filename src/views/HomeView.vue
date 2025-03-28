<script setup>
import ButtonLight from '@/components/ButtonLight.vue';
import { RouterLink } from 'vue-router';


</script>

<template>
  <main>
    <div>
      <h1 class="main-title">Lamps</h1>
      <RouterLink to="./about"><ButtonLight>Go</ButtonLight></RouterLink>
    </div>
  </main>
</template>

<style scoped>
  main {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  div {
    text-align: center;
  }

  .main-title {
    font-size: 100px;
    animation-name: float;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  @keyframes float {
    0% {
      translate: 0 -15px;
    }
    50% {
      translate: 0 0px;
    }
    100% {
      translate: 0 -15px;
    }
  }
</style>
