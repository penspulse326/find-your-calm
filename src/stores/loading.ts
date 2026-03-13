import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const isLoaded = ref(false);
  const progress = ref(0);
  const totalAssets = ref(0);
  const loadedAssets = ref(0);

  function setTotal(total: number) {
    totalAssets.value = total;
    loadedAssets.value = 0;
    progress.value = 0;
    isLoaded.value = false;
  }

  function incrementLoaded() {
    loadedAssets.value++;
    if (totalAssets.value > 0) {
      progress.value = Math.floor((loadedAssets.value / totalAssets.value) * 100);
    }
    if (loadedAssets.value >= totalAssets.value) {
      isLoaded.value = true;
    }
  }

  return {
    isLoaded,
    progress,
    totalAssets,
    loadedAssets,
    setTotal,
    incrementLoaded,
  };
});
