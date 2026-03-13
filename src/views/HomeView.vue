<!--
 * 首頁視圖
 * 顯示測驗的標題與簡介，提供開始測驗的入口
-->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAudioStore } from '../stores/audio';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();
const audioStore = useAudioStore();

function startQuiz() {
  audioStore.playClick();
  gameStore.resetGame();
  router.push('/quiz');
}
</script>

<template>
  <div
    class="
      relative flex min-h-dvh flex-1 flex-col items-center justify-center
      overflow-hidden bg-sky-300
    "
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
        alt="Character"
        class="
          h-full scale-220 object-contain object-bottom opacity-30
          drop-shadow-2xl
        "
      >
    </div>

    <!-- 內容區域 -->
    <div
      class="
        relative z-10 flex w-full flex-col items-center justify-center space-y-8
        px-8 text-center
      "
    >
      <div class="space-y-4">
        <h1
          class="
            font-serif text-4xl font-bold tracking-[0.2em] text-white
            drop-shadow-lg text-shadow-lg
            md:text-5xl
          "
        >
          平靜小棧
        </h1>
        <div class="mx-auto h-[2px] w-16 bg-white/40" />
        <p
          class="
            text-shadow-custom mx-auto max-w-sm text-base/relaxed font-medium
            text-white/90 drop-shadow-md
          "
        >
          你有多久沒有好好放鬆了呢？<br>
          來做個深呼吸，讓世界慢下來！
        </p>
      </div>

      <div class="pt-12">
        <button
          class="
            group relative overflow-hidden rounded-full border border-white/40
            bg-white/10 px-12 py-4 transition-all duration-500
            hover:bg-white/20
          "
          @click="startQuiz"
        >
          <span
            class="
              relative z-10 block text-sm font-bold tracking-[0.3em] text-white
              transition-transform
              group-hover:scale-110
            "
          >
            開始測驗
          </span>
          <div
            class="
              absolute inset-0 bg-white/10 opacity-0 transition-opacity
              duration-500
              group-hover:opacity-100
            "
          />
        </button>
      </div>
    </div>

    <!-- 底部版權或裝飾文字 -->
    <div
      class="
        absolute bottom-4 text-[10px] font-light tracking-[0.5em] text-white/30
      "
    >
      PEN'S PULSE © 2026
    </div>
  </div>
</template>

<style scoped>
/* 可以在這裡加入細微的浮動動畫 */
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
