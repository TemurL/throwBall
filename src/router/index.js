import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      index: 0,
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      index: 1,
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/game',
      name: 'game',
      index: 2,
      component: () => import('../views/GameView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      index: 3,
      component: () => import('../views/SettingsView.vue'),
    },
  ],
})

export default router
