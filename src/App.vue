<!--
 * 應用程式根組件
 * 提供全局佈局設定與頁面路由切換的過渡動畫，並包含全域音效控制按鈕
-->
<script setup lang="ts">
import { onMounted } from 'vue';
import AudioToggle from './components/AudioToggle.vue';
import { useAudioStore } from './stores/audio';

const audioStore = useAudioStore();

onMounted(() => {
  audioStore.initSounds();
});
</script>

<template>
  <div class="h-[100dvh] bg-neutral-900 flex justify-center w-full overflow-hidden">
    <div class="w-full max-w-md bg-black relative shadow-2xl overflow-hidden flex flex-col h-full items-stretch">
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
