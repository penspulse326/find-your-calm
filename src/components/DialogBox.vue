<!--
 * 對話框組件
 * 顯示情境文字，並帶有打字機過渡效果，支援點擊跳過動畫
-->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAudioStore } from '../stores/audio';

const props = defineProps<{
  text: string;
}>();

const emit = defineEmits<{
  (e: 'finish'): void;
}>();

const audioStore = useAudioStore();

const PUNCTUATION_REGEXP = /[，。！？；：、…—]/;

const displayedText = ref('');
const isFinishedTyping = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

function startTyping(fullText: string) {
  displayedText.value = '';
  isFinishedTyping.value = false;
  if (timer)
    clearTimeout(timer);

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

  type();
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

// 允許使用者點擊以跳過打字效果
function completeTyping() {
  if (!isFinishedTyping.value) {
    audioStore.playClick();
    if (timer)
      clearTimeout(timer);
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
