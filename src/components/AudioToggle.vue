<!--
 * 音效切換組件
 * 提供一個浮動按鈕，讓使用者可以點擊切換全局靜音/播放狀態
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAudioStore } from '../stores/audio';

const audioStore = useAudioStore();
const { isMuted } = storeToRefs(audioStore);

function toggle() {
  audioStore.playClick();
  audioStore.toggleMute();
}
</script>

<template>
  <button
    class="absolute top-4 right-4 isolate z-50 glass-icon-button"
    aria-label="Toggle Audio"
    @click="toggle"
  >
    <svg v-if="!isMuted" xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.586l3.707 3.707A1 1 0 0015 19V5a1 1 0 00-1.707-.707L9.586 10H7a2 2 0 00-2 2z" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  </button>
</template>
