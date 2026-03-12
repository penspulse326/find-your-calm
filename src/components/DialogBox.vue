<!--
 * 對話框組件
 * 顯示情境文字，並帶有打字機過渡效果，支援點擊跳過動畫
-->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAudioStore } from '../stores/audio';

const props = defineProps<{
  text: string;
  wait?: number;
}>();

const emit = defineEmits<{
  (e: 'finish'): void;
  (e: 'next'): void;
}>();

const audioStore = useAudioStore();

const PUNCTUATION_REGEXP = /[，。！？；：、…—]/;

const displayedText = ref('');
const isFinishedTyping = ref(false);
const isWaiting = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;
let waitTimer: ReturnType<typeof setTimeout> | null = null;

function stopAllTimers() {
  if (timer)
    clearTimeout(timer);
  if (waitTimer)
    clearTimeout(waitTimer);
}

function startWaiting(duration: number, callback: () => void) {
  isWaiting.value = true;
  displayedText.value = '';

  let dotCount = 0;
  const maxDots = 6;

  function updateDots() {
    if (!isWaiting.value)
      return;

    dotCount = (dotCount % maxDots) + 1;
    displayedText.value = '.'.repeat(dotCount);

    timer = setTimeout(updateDots, 300);
  }

  updateDots();

  waitTimer = setTimeout(() => {
    isWaiting.value = false;
    if (timer)
      clearTimeout(timer);
    displayedText.value = '';
    callback();
  }, duration);
}

function startTyping(fullText: string) {
  displayedText.value = '';
  isFinishedTyping.value = false;
  stopAllTimers();

  let currentIndex = 0;

  function type() {
    if (currentIndex < fullText.length) {
      const char = fullText.charAt(currentIndex);
      displayedText.value += char;
      currentIndex++;

      // 判斷是否為中文標點符號，給予不同延遲
      const isPunctuation = PUNCTUATION_REGEXP.test(char);
      const delay = isPunctuation ? 500 : 50;

      timer = setTimeout(type, delay);
    }
    else {
      isFinishedTyping.value = true;
      emit('finish');
    }
  }

  if (props.wait && props.wait > 0) {
    startWaiting(props.wait, type);
  }
  else {
    type();
  }
}

// 監聽文字變化
watch(
  () => props.text,
  (newText) => {
    startTyping(newText);
  },
);

onMounted(() => {
  startTyping(props.text);
});

// 允許使用者點擊以跳過打字效果，或在完成後前往下一句
function completeTyping() {
  audioStore.playClick();

  if (isWaiting.value) {
    // 如果正在等待，點擊可以直接跳過等待，開始打字
    isWaiting.value = false;
    stopAllTimers();
    startTypingWithNoWait(props.text);
    return;
  }

  if (!isFinishedTyping.value) {
    stopAllTimers();
    displayedText.value = props.text;
    isFinishedTyping.value = true;
    emit('finish');
  }
  else {
    emit('next');
  }
}

function startTypingWithNoWait(fullText: string) {
  displayedText.value = '';
  isFinishedTyping.value = false;

  let currentIndex = 0;
  function type() {
    if (currentIndex < fullText.length) {
      const char = fullText.charAt(currentIndex);
      displayedText.value += char;
      currentIndex++;
      const isPunctuation = PUNCTUATION_REGEXP.test(char);
      const delay = isPunctuation ? 500 : 50;
      timer = setTimeout(type, delay);
    }
    else {
      isFinishedTyping.value = true;
      emit('finish');
    }
  }
  type();
}
</script>

<template>
  <div
    class="w-full bg-black/80 border-t-2 border-white/10 p-6 shadow-2xl relative min-h-[140px] cursor-pointer"
    @click="completeTyping"
  >
    <p
      class="text-white text-lg md:text-xl leading-relaxed font-serif tracking-wide select-none"
    >
      {{ displayedText }}
      <span
        v-if="!isFinishedTyping"
        class="inline-block w-2 bg-white/70 h-5 animate-pulse ml-1 align-middle"
      />
    </p>

    <!-- 提示打字完成 / 準備進入下一步的三角形圖示 -->
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
/* 可選的細微紋理或內陰影設定 */
</style>
