<script setup>
import { RouterLink } from 'vue-router';
import router from '../router';
import { computed } from 'vue';

const clearPaths = computed(() => {
    return router.getRoutes().filter(p => p.path != router.currentRoute.value.path && p.path != '/');
})

</script>

<template>
  <header v-if="router.currentRoute.value.path != '/'">
    <div class="wrapper">
      <RouterLink to="/" class="logo-title">Throw ball</RouterLink>
      <nav>
        <RouterLink v-for="path in clearPaths" :to="path.path" :key="path.index">{{ path.name }}</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
    .wrapper {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: space-between;

        .logo-title {
            font-size: 2rem;
        }
    }
    nav {
        display: flex;
        justify-content: flex-end;
        padding-inline: 10px;
        gap: 25px;

        a {
            text-transform: capitalize;
            transition: .25s;

            &:hover {
                color: var(--color-accent-orange);
                letter-spacing: 1.1px;
            }
        }
    }
</style>
