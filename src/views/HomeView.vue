<!--
 * 首頁視圖
 * 顯示測驗的標題與簡介，提供開始測驗的入口
-->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();

function startQuiz() {
  gameStore.resetGame();
  router.push('/quiz');
}
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-800 to-black text-white relative h-full">
    <div class="space-y-6 z-10 w-full">
      <h1 class="text-3xl font-serif font-bold tracking-widest text-white/90 mb-2">
        尋找平靜
      </h1>
      <div class="w-12 h-[1px] bg-white/30 mx-auto my-4" />
      <p class="text-white/60 leading-relaxed text-sm max-w-xs mx-auto">
        透過情境代入感評估焦慮程度，並獲得科學依據的改善建議。
      </p>
      <div class="pt-8">
        <button
          class="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full transition-all duration-300 tracking-widest text-sm transform hover:scale-105"
          @click="startQuiz"
        >
          開始測驗
        </button>
      </div>
    </div>
  </div>
</template>
