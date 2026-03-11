<!--
 * 選項列表組件
 * 負責渲染測驗選項，處理點擊事件與對應的分數，並帶有懸浮與點擊動畫效果
-->
<script setup lang="ts">
import type { Option } from '../stores/game';
import { useAudioStore } from '../stores/audio';

const props = defineProps<{
  options: Option[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', score: number): void;
}>();

const audioStore = useAudioStore();

function handleSelect(score: number) {
  if (props.disabled)
    return;
  audioStore.playClick();
  emit('select', score);
}
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <button
      v-for="(option, index) in options"
      :key="index"
      :disabled="disabled"
      class="group text-left w-full relative overflow-hidden bg-white/5 hover:bg-white/15 active:bg-white/25 backdrop-blur-md border border-white/10 hover:border-white/40 rounded-2xl p-3 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 shadow-lg hover:shadow-white/10"
      @click="handleSelect(option.score)"
    >
      <!-- 滑鼠懸浮時的光澤效果 -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer"
      />

      <div class="flex items-center gap-4 relative z-10">
        <div
          class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors"
        >
          <span class="font-serif italic text-white/80 text-sm">{{
            option.label
          }}</span>
        </div>
        <span
          class="text-white font-medium text-sm leading-snug tracking-wide group-hover:text-white transition-colors"
        >{{ option.text }}</span>
      </div>
    </button>
  </div>
</template>
