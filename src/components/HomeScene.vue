<!--
 * 全局首頁視覺場景組件
 * 分離首頁的視覺元素（背景、角色立繪、裝飾），透過持久化避免切換路由時的重複載入與閃爍
 -->
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

/** 只有在首頁時顯示此視覺層 */
const isVisible = computed(() => route.name === 'home');
</script>

<template>
  <div
    v-show="isVisible"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-sky-300"
  >
    <!-- 背景裝飾：光暈或漸層 -->
    <div
      class="
        absolute inset-0 bg-linear-to-b from-white/20 via-transparent
        to-black/60
      "
    />

    <!-- 角色立繪 -->
    <div
      class="
        absolute inset-x-0 bottom-20 z-0 flex h-[85%] translate-y-8 transform
        items-end justify-center
      "
    >
      <img
        src="/images/avatar_heart.png"
        alt="Home Character"
        class="
          h-full scale-220 object-contain object-bottom opacity-30
          drop-shadow-2xl
        "
      >
    </div>
  </div>
</template>

<style scoped>
/* 確保不影響點擊事件 */
.pointer-events-none {
  pointer-events: none;
}

/* 角色浮動動畫 */
@keyframes float {
  0% {
    transform: translateY(32px);
  }
  50% {
    transform: translateY(24px);
  }
  100% {
    transform: translateY(32px);
  }
}

img {
  animation: float 6s ease-in-out infinite;
}
</style>
