<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  text: string;
}>();

const emit = defineEmits<{
  (e: 'finish'): void;
}>();

const displayedText = ref('');
let timer: ReturnType<typeof setInterval> | null = null;
const isFinishedTyping = ref(false);

function startTyping(fullText: string) {
  displayedText.value = '';
  isFinishedTyping.value = false;
  if (timer)
    clearInterval(timer);

  let currentIndex = 0;

  timer = setInterval(() => {
    if (currentIndex < fullText.length) {
      displayedText.value += fullText.charAt(currentIndex);
      currentIndex++;
    }
    else {
      isFinishedTyping.value = true;
      if (timer)
        clearInterval(timer);
      emit('finish');
    }
  }, 100); // 40ms per character
}

// Watch for text changes
watch(
  () => props.text,
  (newText) => {
    startTyping(newText);
  },
);

onMounted(() => {
  startTyping(props.text);
});

// Allow user to click to skip typing effect
function completeTyping() {
  if (!isFinishedTyping.value) {
    if (timer)
      clearInterval(timer);
    displayedText.value = props.text;
    isFinishedTyping.value = true;
    emit('finish');
  }
}
</script>

<template>
  <div
    class="w-full bg-black/80 backdrop-blur-md border-t-2 border-white/10 p-6 shadow-2xl relative min-h-[140px] cursor-pointer"
    @click="completeTyping"
  >
    <p
      class="text-white text-lg md:text-xl leading-relaxed font-serif tracking-wide select-none"
    >
      {{ displayedText }}
      <span
        v-if="!isFinishedTyping"
        class="inline-block w-2 bg-white/70 h-5 animate-pulse ml-1 align-baseline"
      />
    </p>

    <!-- Triangle to indicate finished typing / ready for next -->
    <div
      v-if="isFinishedTyping"
      class="absolute bottom-4 right-4 animate-bounce"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-white/50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* Optional subtle texture or inner shadow */
</style>
