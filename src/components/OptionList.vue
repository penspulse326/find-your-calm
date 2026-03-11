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
  <div class="w-full flex flex-col gap-3 px-6 py-4">
    <button
      v-for="(option, index) in options"
      :key="index"
      :disabled="disabled"
      class="text-left w-full relative overflow-hidden bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl p-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
      @click="handleSelect(option.score)"
    >
      <div class="flex items-start gap-3">
        <span class="font-bold text-white/60 shrink-0">{{ option.label }}.</span>
        <span class="text-white font-medium">{{ option.text }}</span>
      </div>
    </button>
  </div>
</template>
