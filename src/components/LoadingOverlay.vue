<script setup lang="ts">
import { ref, watch } from 'vue';
import { useLoadingStore } from '../stores/loading';

const loadingStore = useLoadingStore();
const isFadingOut = ref(false);
const isHidden = ref(false);

// 監控載入狀態
watch(() => loadingStore.isLoaded, (newValue) => {
  if (newValue) {
    // 延遲一點點讓使用者看到 100% 的感覺，或者直接開始淡出
    setTimeout(() => {
      isFadingOut.value = true;
      // 等待動畫結束後徹底移除
      setTimeout(() => {
        isHidden.value = true;
      }, 1200); // 對應 transition duration
    }, 500);
  }
});
</script>

<template>
  <div
    v-if="!isHidden"
    id="loading-overlay"
    class="
      fixed inset-0 z-10000 flex items-center justify-center bg-[#050505]
      transition-all duration-1200 ease-in-out
    "
    :class="{ 'invisible opacity-0': isFadingOut }"
  >
    <div class="flex flex-col items-center gap-8">
      <div class="relative flex size-20 items-center justify-center">
        <div
          class="
            pulse-circle absolute inset-0 animate-pulse-slow rounded-full
            border-2 border-[#00a8a5] opacity-0
          "
        />
        <div
          class="
            pulse-circle absolute inset-0 animate-pulse-slow rounded-full
            border-2 border-[#00a8a5] opacity-0 delay-1
          "
        />
      </div>
      <div
        class="
          relative h-0.5 w-[200px] overflow-hidden rounded-full bg-white/10
        "
      >
        <div
          class="
            absolute inset-0 animate-loading-slide bg-linear-to-r
            from-transparent via-[#00a8a5] to-transparent
          "
        />
      </div>
      <p
        class="
          m-0 text-[0.75rem] font-light tracking-[0.4rem] text-white uppercase
          opacity-50
        "
      >
        載入進度 {{ loadingStore.progress }}%
      </p>
    </div>
  </div>
</template>

<style scoped>
/*
  雖然大部分已轉為 Tailwind，但針對 animation delay
  這類特定的工具類，如果 ESLint 仍有疑慮，可以在此保留或直接在 class 中使用
*/
.delay-1 {
  animation-delay: 1s;
}
</style>
