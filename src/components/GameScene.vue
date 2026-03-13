<!--
 * 全局遊戲場景組件
 * 持久化劇本中的所有角色與背景圖片，透過 v-show 切換避免重新掛載導致的遺失或閃爍
-->
<script setup lang="ts">
import type { GameStep } from '../types/game';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { BACKGROUND_THEMES } from '../constants';
import scriptData from '../data/script.json';
import { useGameStore } from '../stores/game';

const route = useRoute();
const gameStore = useGameStore();
const { currentStep, currentQuestionNumber } = storeToRefs(gameStore);

/** 只有在測驗頁面顯示持久化場景層 */
const isVisible = computed(() => route.name === 'quiz');

/** 根據測驗進度計算背景色調  */
const bgColor = computed(() => {
  const index = Math.max(0, currentQuestionNumber.value - 1);
  return BACKGROUND_THEMES[index] || 'transparent';
});

/** 從劇本資料中自動蒐集所有需要持久化的背景圖片 */
const allBackgrounds = computed(() => {
  const bgs = new Set<string>();
  (scriptData as GameStep[]).forEach((step) => {
    if (step.bg) {
      bgs.add(step.bg);
    }
  });
  return [...bgs];
});

/** 固定所有的角色表情清單 */
const ALL_AVATARS = [
  'avatar_smile.png',
  'avatar_cheer.png',
  'avatar_celebrating.png',
  'avatar_thinking.png',
  'avatar_heart.png',
];
</script>

<template>
  <transition name="scene-fade">
    <div
      v-show="isVisible"
      class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <!-- 1. 最底層：背景色調 (隨題號變化) -->
      <div
        class="
          absolute inset-0 size-full transition-colors duration-1000 ease-in-out
        "
        :class="bgColor"
      />

      <!-- 2. 中層：角色立繪 -->
      <div
        class="
          absolute inset-x-0 bottom-47 flex h-full items-end justify-center
        "
      >
        <div class="relative z-20 size-full">
          <img
            v-for="avatar in ALL_AVATARS"
            v-show="currentStep?.character === avatar"
            :key="avatar"
            :src="`/images/${avatar}`"
            alt="Character Avatar"
            class="
              absolute inset-x-0 -bottom-8 mx-auto h-[80vh] translate-y-4
              object-contain object-bottom drop-shadow-2xl
              md:h-[85vh]
            "
          >
        </div>
      </div>

      <!-- 3. 最上層：場景背景圖 (帶有 50% 透明度與模糊) -->
      <div class="absolute inset-0 z-10">
        <img
          v-for="bg in allBackgrounds"
          v-show="currentStep?.bg === bg"
          :key="bg"
          :src="`/images/${bg}`"
          alt=""
          class="
            absolute inset-0 size-full object-cover opacity-50 blur-[1px]
            transition-opacity duration-1000 ease-in-out
          "
        >
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* 確保場景層不影響路由組件的點擊事件 */
.pointer-events-none {
  pointer-events: none;
}

.scene-fade-enter-active,
.scene-fade-leave-active {
  transition: opacity 0.4s ease;
}

.scene-fade-enter-from,
.scene-fade-leave-to {
  opacity: 0;
}
</style>
