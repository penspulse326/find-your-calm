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
const { currentQuestion, progress, isFinished }
  = storeToRefs(gameStore);

const isTransitioning = ref(false);
const showOptions = ref(false);
const showConfirm = ref(false);

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
  isTransitioning.value = true;
  showOptions.value = false;

  // 在切換題目之前稍作等待
  setTimeout(() => {
    gameStore.answerQuestion(score);
    if (isFinished.value) {
      router.replace('/result');
    }
    isTransitioning.value = false;
  }, 600);
}

function handleDialogFinish() {
  // 文字結束後延遲 600ms 再顯示選項
  setTimeout(() => {
    if (!isTransitioning.value) {
      showOptions.value = true;
    }
  }, 600);
}
</script>

<template>
  <div class="flex-1 flex flex-col bg-black relative h-full overflow-hidden">
    <div class="flex-1 flex flex-col relative overflow-hidden">
      <!-- 頂部標頭區域 -->
      <div class="absolute top-4 inset-x-4 z-50 flex items-center justify-between pointer-events-none">
        <!-- 重新開始按鈕 -->
        <button
          class="p-2 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white hover:bg-white/30 transition-colors pointer-events-auto"
          aria-label="Restart Quiz"
          @click="handleRestart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
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
          <OptionList
            :options="currentQuestion && showOptions ? currentQuestion.options : []"
            :disabled="isTransitioning"
            @select="handleSelect"
          />
        </div>
      </div>

      <!-- 對話框區域 -->
      <div v-if="currentQuestion" class="mt-auto z-40">
        <div
          class="transition-opacity duration-500"
          :class="{ 'opacity-0': isTransitioning }"
        >
          <DialogBox
            :text="currentQuestion.text"
            @finish="handleDialogFinish"
          />
        </div>
      </div>

      <!-- 確認重開的彈跳視窗 -->
      <transition name="modal-fade">
        <div v-if="showConfirm" class="absolute inset-0 z-[100] flex items-center justify-center px-6">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="cancelRestart" />
          <div class="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl">
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
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
