import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useVars = defineStore('vars', () => {
  const headerHeight = ref(69);
  const mobileGameboardHeight = computed(() => innerHeight - headerHeight.value);
  return { headerHeight, mobileGameboardHeight }
})
