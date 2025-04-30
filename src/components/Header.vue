<script setup>
import { RouterLink } from 'vue-router';
import router from '../router';
import { computed, ref, onMounted, onUpdated } from 'vue';
import { useVars } from '@/stores/vars';

const vars = useVars();
const headerElem = ref();

const clearPaths = computed(() => {
    return router.getRoutes().filter(p => p.path != router.currentRoute.value.path && p.path != '/');
})

onUpdated(() => {
  const setHeaderHeight = () => {
    vars.headerHeight = headerElem.value.clientHeight;
  };
  setHeaderHeight();
  addEventListener('resize', setHeaderHeight);
})

</script>

<template>
  <header ref="headerElem" v-if="router.currentRoute.value.path != '/'">
    <div class="wrapper">
      <RouterLink to="/" class="logo-title">Throw ball</RouterLink>
      <nav>
        <RouterLink v-for="path in clearPaths" :to="path.path">{{ path.name }}</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
    .wrapper {
        display: flex;
        gap: 10px;
        padding: 1.5rem;
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

    @media screen and (max-width: 999px) {
      .wrapper {
        padding: 15px;
      }
    }
</style>
