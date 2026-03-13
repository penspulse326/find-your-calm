<!--
 * 選項列表組件
 * 負責渲染測驗選項，處理點擊事件與對應的分數，並帶有懸浮與點擊動畫效果
-->
<script setup lang="ts">
import type { Option } from '../types/game';
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
  if (props.disabled) {
    return;
  }
  audioStore.playClick();
  emit('select', score);
}
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <button
      v-for="option in options"
      :key="option.text"
      :disabled="disabled"
      class="
        group relative isolate w-full transform overflow-hidden rounded-2xl
        border border-white/10 bg-white/5 p-3 text-left shadow-lg
        backdrop-blur-sm transition-all duration-500
        will-change-[backdrop-filter,transform,opacity]
        hover:-translate-y-1 hover:border-white/40 hover:bg-white/15
        hover:shadow-white/10
        active:bg-white/25
        disabled:cursor-not-allowed disabled:opacity-50
      "
      @click.stop="handleSelect(option.score)"
    >
      <!-- 滑鼠懸浮時的光澤效果 -->
      <div
        class="
          group-hover:animate-shimmer
          absolute inset-0 -translate-x-full bg-linear-to-r from-transparent
          via-white/5 to-transparent
        "
      />

      <div class="relative z-10 flex items-center gap-4">
        <div
          class="
            flex size-8 items-center justify-center rounded-full border
            border-white/20 bg-white/10 transition-colors
            group-hover:bg-white/20
          "
        >
          <span class="font-serif text-sm text-white/80 italic">{{
            option.label
          }}</span>
        </div>
        <span
          class="
            text-shadow-custom text-sm/snug font-medium tracking-wide text-white
            transition-colors
            group-hover:text-white
          "
        >{{ option.text }}</span>
      </div>
    </button>
  </div>
</template>
