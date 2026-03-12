<!--
 * 應用程式根組件
 * 提供全局佈局設定與頁面路由切換的過渡動畫，並包含全域音效控制按鈕
-->
<script setup lang="ts">
import { onMounted } from 'vue';
import AudioToggle from './components/AudioToggle.vue';
import { results } from './data/results';
import scriptData from './data/script.json';
import { useAudioStore } from './stores/audio';
import { preloadImages } from './utils/preload';

const audioStore = useAudioStore();

onMounted(async () => {
  audioStore.initSounds();

  // 提取劇本中所有需要使用的圖片
  const images = new Set<string>();
  scriptData.forEach((step: any) => {
    if (step.bg) {
      images.add(step.bg);
    }
    if (step.character) {
      images.add(step.character);
    }
  });

  // 轉換為完整的 URL 並開始預載
  const imageUrls = Array.from(
    images,
    img => new URL(`./assets/images/${img}`, import.meta.url).href,
  );

  // 同時預載測驗結果頁的圖片
  results.forEach((r) => {
    if (r.image) {
      imageUrls.push(r.image);
    }
  });

  try {
    await preloadImages(imageUrls);
  }
  catch (err) {
    console.error('Failed to preload images:', err);
  }
});
</script>

<template>
  <div class="min-h-screen bg-neutral-900 flex justify-center w-full">
    <div
      class="w-full max-w-md bg-black relative shadow-2xl flex flex-col min-h-screen items-stretch"
    >
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
