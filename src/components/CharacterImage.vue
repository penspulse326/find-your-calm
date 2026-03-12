<!--
 * 角色與背景圖片組件
 * 根據測驗進度動態變換背景色調，用以營造不同情境的氛圍
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useGameStore } from '../stores/game';

const gameStore = useGameStore();
const { currentStep, currentQuestionNumber } = storeToRefs(gameStore);

// 根據當前題目的進度動態改變背景顏色
const bgColor = computed(() => {
  const index = Math.max(0, currentQuestionNumber.value - 1);
  // 從冷色/平靜過渡到暖色/緊張的色調配置
  const colors = [
    'bg-[#A7C7E7]', // Q1
    'bg-[#B0C4DE]', // Q2
    'bg-[#D3C7C7]', // Q3
    'bg-[#CFC0B7]', // Q4
    'bg-[#CBB0A1]', // Q5
    'bg-[#C8A08B]', // Q6
    'bg-[#C59075]', // Q7
    'bg-[#BA7D63]', // Q8
    'bg-[#AF6A51]', // Q9
    'bg-[#A44A3F]', // Q10
  ];
  return colors[index] || colors[0];
});

const characterUrl = computed(() => {
  if (!currentStep.value?.character) {
    return '';
  }
  return `/images/${currentStep.value.character}`;
});
</script>

<template>
  <div
    class="w-full flex-1 min-h-[40vh] transition-colors duration-1000 ease-in-out relative flex items-end justify-center overflow-hidden shadow-inner"
    :class="bgColor"
  >
    <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

    <!-- 角色立繪容器 -->
    <div class="z-10 h-full w-full relative">
      <Transition name="character-fade">
        <img
          v-if="characterUrl"
          :key="characterUrl"
          :src="characterUrl"
          alt="Character Avatar"
          class="absolute inset-x-0 -bottom-8 mx-auto h-[80vh] md:h-[85vh] object-contain object-bottom drop-shadow-2xl translate-y-4"
        >
      </Transition>
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
