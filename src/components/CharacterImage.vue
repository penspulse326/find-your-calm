<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useGameStore } from '../stores/game';

const gameStore = useGameStore();
const { currentQuestionIndex } = storeToRefs(gameStore);

// Change colors dynamically based on the current question index
const bgColor = computed(() => {
  const index = currentQuestionIndex.value;
  // A palette transitioning from cool/calm to warm/tense
  const colors = [
    'bg-[#A7C7E7]', // Q1
    'bg-[#B0C4DE]', // Q2
    'bg-[#D3C7C7]', // Q3
    'bg-[#CFC0B7]', // Q4
    'bg-[#CBB0A1]', // Q5
    'bg-[#C8A08B]', // Q6
    'bg-[#C59075]', // Q7
    'bg-[#BA7D63]', // Q8
    'bg-[#AF6A51]', // Q9
    'bg-[#A44A3F]', // Q10
  ];
  return colors[index] || colors[0];
});
</script>

<template>
  <div
    class="w-full flex-1 min-h-[40vh] transition-colors duration-1000 ease-in-out relative flex items-center justify-center overflow-hidden shadow-inner"
    :class="bgColor"
  >
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    <div class="z-10 text-white/40 text-sm tracking-widest font-light">
      {{ /* Placeholder for Character Artwork */ }}
    </div>
  </div>
</template>
