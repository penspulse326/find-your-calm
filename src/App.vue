<!--
 * 應用程式根組件
 * 提供全局佈局設定與頁面路由切換的過渡動畫，並包含全域音效控制按鈕
-->
<script setup lang="ts">
import type { GameStep } from './types/game';
import { onMounted } from 'vue';
import AudioToggle from './components/AudioToggle.vue';
import GameScene from './components/GameScene.vue';
import { results } from './data/results';
import scriptData from './data/script.json';
import { useAudioStore } from './stores/audio';
import { useLoadingStore } from './stores/loading';
import { preloadImages } from './utils/image';

const audioStore = useAudioStore();
const loadingStore = useLoadingStore();

onMounted(async () => {
  audioStore.initSounds();

  // 1. 蒐集所有需要預載的圖片 URL
  const images = new Set<string>();

  // 劇本背景與角色
  (scriptData as GameStep[]).forEach((step) => {
    if (step.bg) {
      images.add(`/images/${step.bg}`);
    }
    if (step.character) {
      images.add(`/images/${step.character}`);
    }
  });

  // 測驗結果頁圖片
  results.forEach((res) => {
    if (res.image) {
      images.add(res.image);
    }
  });

  const imageUrls = [...images];

  // 2. 開始執行預載並追蹤進度
  loadingStore.setTotal(imageUrls.length);

  try {
    await preloadImages(imageUrls, () => {
      loadingStore.incrementLoaded();
    });
  }
  catch (err) {
    // 關鍵資源載入失敗時的紀錄
    console.error('[App] Failed to preload some images:', err);
  }
});
</script>

<template>
  <div class="flex min-h-dvh w-full justify-center bg-neutral-900">
    <div
      class="
        relative flex min-h-dvh w-full max-w-md flex-col items-stretch bg-black
        shadow-2xl
      "
    >
      <GameScene />
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <AudioToggle />
    </div>
  </div>
</template>

<style>
/*
  改用 clip-path 做頁面切換動畫，避免 opacity 動畫
  導致子元素的 backdrop-filter 無效的問題。
*/
.fade-enter-active,
.fade-leave-active {
  transition: clip-path 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  clip-path: inset(0 0 100% 0);
}
</style>
