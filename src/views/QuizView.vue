<!--
 * 測驗主視圖
 * 整合角色背景、對話框與選項列表，控制測驗流程與畫面切換，並處理重啟測驗的確認邏輯
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CharacterImage from '../components/CharacterImage.vue';
import DialogBox from '../components/DialogBox.vue';
import OptionList from '../components/OptionList.vue';
import { useAudioStore } from '../stores/audio';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();
const audioStore = useAudioStore();
const { currentQuestion, progress, isFinished } = storeToRefs(gameStore);

const isTransitioning = ref(false);
const showOptions = ref(false);
const showConfirm = ref(false);

// 當前正在顯示的選項副本，用於在轉場期間保持資料穩定
const activeOptions = ref<any[]>([]);

function handleRestart() {
  audioStore.playClick();
  showConfirm.value = true;
}

function confirmRestart() {
  audioStore.playClick();
  gameStore.resetGame();
  router.push('/');
}

function cancelRestart() {
  audioStore.playClick();
  showConfirm.value = false;
}

function handleSelect(score: number) {
  // 1. 立即啟動轉場，並隱藏選項（觸發離開動畫）
  showOptions.value = false;
  isTransitioning.value = true;

  // 2. 在離開動畫進行中或結束後，才切換 Store 的題目資料
  // 這裡的延遲應與選項的離開動畫時間大致匹配
  setTimeout(() => {
    gameStore.answerQuestion(score);
    if (isFinished.value) {
      router.replace('/result');
    }
    else {
      // 重設轉場狀態，準備下一題
      isTransitioning.value = false;
    }
  }, 400);
}

function handleDialogFinish() {
  // 確保題目資料已加載，且目前不在切換轉場中
  if (currentQuestion.value && !isTransitioning.value) {
    // 將最新題目的選項存入副本，並顯示（觸發進入動畫）
    activeOptions.value = currentQuestion.value.options;
    showOptions.value = true;
  }
}
</script>

<template>
  <div class="flex-1 flex flex-col bg-black relative h-full overflow-hidden">
    <div class="flex-1 flex flex-col relative overflow-hidden">
      <!-- 頂部標頭區域 -->
      <div
        class="absolute top-4 inset-x-4 z-50 flex items-center justify-between pointer-events-none"
      >
        <!-- 重新開始按鈕 -->
        <button
          class="p-2 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white hover:bg-white/30 transition-colors pointer-events-auto isolate will-change-[backdrop-filter,opacity]"
          aria-label="Restart Quiz"
          @click="handleRestart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- 題目進度 -->
        <div class="text-white/80 font-medium tracking-widest">
          第 {{ progress }} 題
        </div>

        <!-- 用於平衡排版的佔位空間（對應右側絕對定位的音效按鈕） -->
        <div class="w-10" />
      </div>
      <!-- 角色與背景區域 -->
      <CharacterImage />

      <!-- 浮動選項層（傳統視覺小說風格） -->
      <div
        class="absolute inset-x-0 bottom-[140px] z-50 flex flex-col justify-center translate-y-0"
      >
        <div class="px-4 pb-4">
          <transition name="options-fade">
            <OptionList
              v-if="showOptions && activeOptions.length > 0"
              :options="activeOptions"
              :disabled="isTransitioning"
              @select="handleSelect"
            />
          </transition>
        </div>
      </div>

      <!-- 對話框區域 -->
      <div v-if="currentQuestion" class="mt-auto z-40">
        <div
          class="transition-opacity duration-500"
          :class="{
            'opacity-0': isTransitioning,
            'pointer-events-none': isTransitioning,
          }"
        >
          <DialogBox
            :text="currentQuestion.text"
            @finish="handleDialogFinish"
          />
        </div>
      </div>

      <!-- 確認重開的彈跳視窗 -->
      <transition name="modal-fade">
        <div
          v-if="showConfirm"
          class="absolute inset-0 z-[100] flex items-center justify-center px-6"
        >
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="cancelRestart"
          />
          <div
            class="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl isolate will-change-[backdrop-filter,transform,opacity]"
          >
            <h3 class="text-xl font-medium text-white/90 mb-4 tracking-wider">
              確認重開？
            </h3>
            <p class="text-white/60 text-sm leading-relaxed mb-8">
              返回首頁將不會保留當前的測驗進度，需要重新進行。
            </p>
            <div class="flex gap-4">
              <button
                class="flex-1 py-3 rounded-full border border-white/20 text-white/60 hover:bg-white/5 transition-colors text-sm"
                @click="cancelRestart"
              >
                取消
              </button>
              <button
                class="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-colors text-sm"
                @click="confirmRestart"
              >
                確認返回
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/*
  使用 clip-path 取代 opacity 動畫，徹底解決 backdrop-filter 在 opacity
  過渡時無法即時渲染的瀏覽器限制。clip-path 不影響合成層（Compositing
  Layer）的採樣，因此 backdrop-blur 從動畫第一幀就能正確顯示。
*/

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: clip-path 0.4s ease, transform 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  transform: scale(0.97);
  clip-path: inset(0 0 100% 0 round 1rem);
}

.options-fade-enter-active,
.options-fade-leave-active {
  transition: clip-path 0.4s ease, transform 0.4s ease;
}

.options-fade-enter-from,
.options-fade-leave-to {
  transform: translateY(12px);
  clip-path: inset(100% 0 0 0 round 1rem);
}
</style>
