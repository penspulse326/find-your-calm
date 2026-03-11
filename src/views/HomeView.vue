<!--
 * 首頁視圖
 * 顯示測驗的標題與簡介，提供開始測驗的入口
-->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import avatarThinking from '../assets/images/avatar_thinking.png';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();

function startQuiz() {
  gameStore.resetGame();
  router.push('/quiz');
}
</script>

<template>
  <div
    class="flex-1 flex flex-col items-center justify-center bg-[#A7C7E7] relative h-full overflow-hidden"
  >
    <!-- 背景裝飾：光暈或漸層 -->
    <div class="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/60" />

    <!-- 角色立繪 -->
    <div class="absolute inset-x-0 bottom-0 z-0 flex justify-center items-end h-[85%] transform translate-y-8">
      <img
        :src="avatarThinking"
        alt="Character"
        class="h-full object-contain object-bottom drop-shadow-2xl opacity-80"
      >
    </div>

    <!-- 內容區域 -->
    <div class="relative z-10 w-full flex flex-col items-center justify-center px-8 text-center space-y-8">
      <div class="space-y-4">
        <h1
          class="text-4xl md:text-5xl font-serif font-bold tracking-[0.2em] text-white drop-shadow-lg"
        >
          尋找平靜
        </h1>
        <div class="w-16 h-[2px] bg-white/40 mx-auto" />
        <p class="text-white/90 font-medium leading-relaxed text-base max-w-sm mx-auto drop-shadow-md">
          你有多久沒有好好放鬆了呢？<br>
          透過幾個日常問題，慢慢找到通往平靜的方向吧！
        </p>
      </div>

      <div class="pt-12">
        <button
          class="group relative px-12 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 rounded-full transition-all duration-500 overflow-hidden"
          @click="startQuiz"
        >
          <span class="relative z-10 text-white tracking-[0.3em] text-sm font-bold group-hover:scale-110 block transition-transform">
            開始測驗
          </span>
          <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </div>
    </div>

    <!-- 底部版權或裝飾文字 -->
    <div class="absolute bottom-4 text-white/30 text-[10px] tracking-[0.5em] font-light">
      PENS PULSE © 2026
    </div>
  </div>
</template>

<style scoped>
/* 可以在這裡加入細微的浮動動畫 */
@keyframes float {
  0% { transform: translateY(32px); }
  50% { transform: translateY(24px); }
  100% { transform: translateY(32px); }
}

img {
  animation: float 6s ease-in-out infinite;
}
</style>
