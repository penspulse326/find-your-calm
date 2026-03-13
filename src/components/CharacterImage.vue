<!--
 * 角色與背景圖片組件
 * 根據測驗進度動態變換背景色調，用以營造不同情境的氛圍
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { BACKGROUND_THEMES } from '../constants';
import { useGameStore } from '../stores/game';

const gameStore = useGameStore();
const { currentStep, currentQuestionNumber } = storeToRefs(gameStore);

/** 根據當前題目的進度動態改變背景顏色 */
const bgColor = computed(() => {
  const index = Math.max(0, currentQuestionNumber.value - 1);
  return BACKGROUND_THEMES[index] || BACKGROUND_THEMES[0];
});
</script>

<template>
  <div
    class="
      relative flex min-h-[40vh] w-full flex-1 items-end justify-center
      overflow-hidden shadow-inner transition-colors duration-1000 ease-in-out
    "
    :class="bgColor"
  >
    <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

    <!-- 角色立繪容器 -->
    <div class="relative z-10 size-full">
      <template
        v-for="avatar in [
          'avatar_smile.png',
          'avatar_cheer.png',
          'avatar_celebrating.png',
          'avatar_thinking.png',
          'avatar_heart.png',
        ]"
        :key="avatar"
      >
        <img
          v-show="currentStep?.character === avatar"
          :src="`/images/${avatar}`"
          alt="Character Avatar"
          class="
            absolute inset-x-0 -bottom-8 mx-auto h-[80vh] translate-y-4
            object-contain object-bottom drop-shadow-2xl
            md:h-[85vh]
          "
        >
      </template>
    </div>
  </div>
</template>

<style scoped>
.character-fade-enter-active,
.character-fade-leave-active {
  transition:
    opacity 0.5s ease-in-out,
    transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.character-fade-enter-from {
  opacity: 0;
}

.character-fade-leave-to {
  opacity: 0;
}
</style>
