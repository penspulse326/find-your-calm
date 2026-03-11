<!--
 * 測驗結果視圖
 * 根據最終獲得的分數，計算並顯示對應的內心狀態以及改善建議
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAudioStore } from '../stores/audio';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();
const audioStore = useAudioStore();
const { score, resultStatus } = storeToRefs(gameStore);

function restart() {
  audioStore.playClick();
  gameStore.resetGame();
  router.replace('/');
}
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-900 to-black text-white h-full relative">
    <div class="space-y-6 z-10 w-full relative">
      <h2 class="text-sm tracking-[0.2em] text-white/50 mb-2">
        最終評估
      </h2>
      <h1 class="text-4xl font-serif font-bold tracking-widest text-[#D3C7C7]">
        {{ resultStatus }}
      </h1>

      <div class="w-12 h-[1px] bg-white/20 mx-auto my-6" />

      <div class="text-white/70 leading-relaxed text-sm text-left bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg min-h-[120px]">
        <p v-if="score <= 4">
          你的內心是一片平靜的湖泊。繼續保持目前的步調，每天 5 分鐘正念。
        </p>
        <p v-else-if="score <= 9">
          有些波浪，但你還能掌舵。建議減少咖啡因，並嘗試 <strong class="text-white/90">4-7-8 呼吸法</strong>。
        </p>
        <p v-else-if="score <= 14">
          你似乎迷失了方向。請實行數位排毒，嘗試 <strong class="text-white/90">箱式呼吸</strong> 來找回主控權。
        </p>
        <p v-else>
          風暴已經來臨。請優先處理生理需求，並尋求專業諮詢，適時按下暫停鍵。
        </p>
      </div>

      <div class="pt-8">
        <button
          class="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full transition-all duration-300 tracking-widest text-sm transform hover:scale-105"
          @click="restart"
        >
          重新測驗
        </button>
      </div>
    </div>
  </div>
</template>
