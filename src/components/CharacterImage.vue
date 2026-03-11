<!--
 * 角色與背景圖片組件
 * 根據測驗進度動態變換背景色調，用以營造不同情境的氛圍
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useGameStore } from '../stores/game';

const gameStore = useGameStore();
const { currentQuestionIndex } = storeToRefs(gameStore);

// 根據當前題目的索引動態改變背景顏色
const bgColor = computed(() => {
  const index = currentQuestionIndex.value;
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
</script>

<template>
  <div
    class="w-full flex-1 min-h-[40vh] transition-colors duration-1000 ease-in-out relative flex items-center justify-center overflow-hidden shadow-inner"
    :class="bgColor"
  >
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    <div class="z-10 text-white/40 text-sm tracking-widest font-light">
      <!-- 角色立繪的佔位符可以放在這裡 -->
    </div>
  </div>
</template>
