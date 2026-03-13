<!--
 * 對話框組件
 * 顯示情境文字，並帶有打字機過渡效果，支援點擊跳過動畫
-->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { TYPING_CONFIG } from '../constants';
import { useAudioStore } from '../stores/audio';

const props = withDefaults(defineProps<{
  text: string;
  wait?: number;
  canNext?: boolean;
}>(), {
  canNext: true,
});

const emit = defineEmits<{
  (e: 'finish'): void;
  (e: 'next'): void;
}>();

const audioStore = useAudioStore();
const displayedText = ref('');
const isFinishedTyping = ref(false);
const isWaiting = ref(false);
let typingTimer: ReturnType<typeof setTimeout> | null = null;
let waitTimer: ReturnType<typeof setTimeout> | null = null;

function stopAllTimers() {
  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }
  if (waitTimer) {
    clearTimeout(waitTimer);
    waitTimer = null;
  }
}

/**
 * 開始打字機效果的核心邏輯
 */
function runTypingEffect(fullText: string) {
  stopAllTimers();
  displayedText.value = '';
  isFinishedTyping.value = false;
  isWaiting.value = false;

  let currentIndex = 0;

  const type = () => {
    if (currentIndex < fullText.length) {
      const char = fullText.charAt(currentIndex);
      displayedText.value += char;
      currentIndex++;

      const isPunctuation = TYPING_CONFIG.PUNCTUATION_REGEXP.test(char);
      const delay = isPunctuation ? TYPING_CONFIG.PUNCTUATION_DELAY : TYPING_CONFIG.DEFAULT_DELAY;
      typingTimer = setTimeout(type, delay);
    }
    else {
      isFinishedTyping.value = true;
      emit('finish');
    }
  };

  type();
}

/**
 * 處理等待動畫並在結束後開始打字
 */
function handleStartSequence(fullText: string) {
  stopAllTimers();
  isFinishedTyping.value = false;

  if (props.wait && props.wait > 0) {
    isWaiting.value = true;
    displayedText.value = '';

    let dotCount = 0;
    const updateDots = () => {
      if (!isWaiting.value) {
        return;
      }
      dotCount = (dotCount % 3) + 1;
      displayedText.value = '.'.repeat(dotCount);
      typingTimer = setTimeout(updateDots, TYPING_CONFIG.DOTS_FREQUENCY);
    };

    updateDots();

    waitTimer = setTimeout(() => {
      isWaiting.value = false;
      stopAllTimers();
      runTypingEffect(fullText);
    }, props.wait);
  }
  else {
    runTypingEffect(fullText);
  }
}

// 監聽文字變化
watch(() => props.text, (newText) => {
  handleStartSequence(newText);
});

onMounted(() => {
  handleStartSequence(props.text);
});

/**
 * 允許外部或點擊調用：立即完成打字或進入下一步
 */
function completeTyping() {
  audioStore.playClick();

  if (isWaiting.value) {
    // 點擊直接跳過等待
    isWaiting.value = false;
    stopAllTimers();
    runTypingEffect(props.text);
    return;
  }

  if (!isFinishedTyping.value) {
    // 點擊跳過打字過程
    stopAllTimers();
    displayedText.value = props.text;
    isFinishedTyping.value = true;
    emit('finish');
  }
  else if (props.canNext) {
    // 如果已完成且支援下一步，則發出 next 事件
    emit('next');
  }
}

defineExpose({
  completeTyping,
});
</script>

<template>
  <div
    class="
      relative min-h-[140px] w-full border-t-2 border-white/10 bg-black/80 p-6
      shadow-2xl
    "
  >
    <p
      class="
        font-serif text-lg/relaxed tracking-wide text-white select-none
        md:text-xl
      "
    >
      {{ displayedText }}
      <span
        v-if="!isFinishedTyping"
        class="ml-1 inline-block h-5 w-2 animate-pulse bg-white/70 align-middle"
      />
    </p>

    <!-- 提示打字完成 / 準備進入下一步的三角形圖示 -->
    <div
      v-if="isFinishedTyping && canNext"
      class="absolute right-4 bottom-4 animate-bounce"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-6 text-white/50"
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
