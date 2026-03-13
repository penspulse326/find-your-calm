<!--
 * 首頁視圖
 * 顯示測驗的標題與簡介，提供開始測驗的入口
-->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { UI_STRINGS } from '../constants';
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
      overflow-hidden bg-transparent
    "
  >
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
          {{ UI_STRINGS.HOME_TITLE }}
        </h1>
        <div class="mx-auto h-[2px] w-16 bg-white/40" />
        <p
          class="
            text-shadow-custom mx-auto max-w-sm text-base/relaxed font-medium
            whitespace-pre-line text-white/90 drop-shadow-md
          "
        >
          {{ UI_STRINGS.HOME_SUBTITLE }}
        </p>
      </div>

      <div class="pt-12">
        <button
          class="glass-button px-12 py-4"
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
/* 頁面特定樣式 (視覺由 HomeScene 持久層處理) */
</style>
