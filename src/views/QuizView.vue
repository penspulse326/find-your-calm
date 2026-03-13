<!--
 * 測驗主視圖
 * 整合角色背景、對話框與選項列表，控制測驗流程與畫面切換，並處理重啟測驗的確認邏輯
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import CharacterImage from '../components/CharacterImage.vue';
import DialogBox from '../components/DialogBox.vue';
import OptionList from '../components/OptionList.vue';
import { TRANSITION_CONFIG, UI_STRINGS } from '../constants';
import { useAudioStore } from '../stores/audio';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();
const audioStore = useAudioStore();
const { currentStep, currentQuestionNumber, totalQuestions, isFinished }
  = storeToRefs(gameStore);

const isTransitioning = ref(false);
const showOptions = ref(false);
const showConfirm = ref(false);
const dialogBoxRef = ref<any>(null);

watch(
  () => isFinished.value,
  (newVal) => {
    if (newVal) {
      router.replace('/result');
    }
  },
);

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
    // 重設轉場狀態，準備下一題或進入結尾對話
    isTransitioning.value = false;
  }, TRANSITION_CONFIG.QUIZ_TRANSITION_DELAY);
}

function handleDialogFinish() {
  // 確保當前是測驗類型且無轉場中
  if (currentStep.value.type === 'quiz' && !isTransitioning.value) {
    // 將最新題目的選項存入副本，並顯示（觸發進入動畫）
    activeOptions.value = currentStep.value.options || [];
    showOptions.value = true;
  }
}

function handleNext() {
  // 只有在對話模式下，點擊對話框才會進入下一步
  // 如果是測驗模式，必須由選項點擊觸發下一階段
  if (currentStep.value.type === 'dialogue') {
    gameStore.nextStep();
  }
}

const bgUrl = computed(() =>
  !currentStep.value?.bg ? '' : `/images/${currentStep.value.bg}`,
);

function handleGlobalClick() {
  if (showConfirm.value) {
    return;
  }
  // 如果是測驗中且選項已經顯示，則不處理全局點擊，必須點選選項
  if (currentStep.value?.type === 'quiz' && showOptions.value) {
    return;
  }

  dialogBoxRef.value?.completeTyping();
}
</script>

<template>
  <div
    class="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-black"
    :class="
      (currentStep?.type === 'quiz' && showOptions) || showConfirm
        ? 'cursor-default'
        : 'cursor-pointer'
    "
    @click="handleGlobalClick"
  >
    <div class="relative flex flex-1 flex-col overflow-hidden">
      <!-- 頂部標頭區域 -->
      <div
        class="
          pointer-events-none absolute inset-x-4 top-4 z-50 flex items-center
          justify-between
        "
      >
        <!-- 重新開始按鈕 -->
        <button
          class="
            pointer-events-auto isolate rounded-full border border-white/30
            bg-white/20 p-2 text-white backdrop-blur-sm transition-colors
            will-change-[backdrop-filter,opacity]
            hover:bg-white/30
          "
          aria-label="Restart Quiz"
          @click.stop="handleRestart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-6"
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
        <div
          v-if="currentStep.type === 'quiz'"
          class="flex flex-col items-center gap-2"
        >
          <div class="text-shadow-custom text-xs font-medium text-white/70">
            {{ `第 ${currentQuestionNumber} 題` }}
          </div>
          <div
            class="h-1 w-24 overflow-hidden rounded-full bg-white/10 shadow-sm"
          >
            <div
              class="h-full bg-white/60 transition-all duration-700 ease-out"
              :style="{
                width: `${(currentQuestionNumber / totalQuestions) * 100}%`,
              }"
            />
          </div>
        </div>
        <div v-else class="flex flex-col items-end gap-2 opacity-0">
          <div class="text-xs">
            PLACEHOLDER
          </div>
          <div class="h-1 w-24 rounded-full bg-white/10" />
        </div>

        <!-- 用於平衡排版的佔位空間（對應右側絕對定位的音效按鈕） -->
        <div class="w-10" />
      </div>
      <!-- 角色與背景區域 -->
      <img
        v-show="bgUrl"
        :src="bgUrl"
        alt=""
        class="
          absolute z-10 size-full object-cover opacity-50 blur-[2px]
          transition-opacity duration-1000 ease-in-out
        "
      >
      <CharacterImage />

      <!-- 浮動選項層（傳統視覺小說風格） -->
      <div
        class="
          absolute inset-x-0 bottom-[140px] z-50 flex translate-y-0 flex-col
          justify-center
        "
      >
        <div class="px-4 pb-4">
          <transition name="options-fade">
            <OptionList
              v-if="
                currentStep.type === 'quiz'
                  && showOptions
                  && activeOptions.length > 0
              "
              :options="activeOptions"
              :disabled="isTransitioning"
              @select="handleSelect"
            />
          </transition>
        </div>
      </div>

      <!-- 對話框區域 -->
      <div v-if="currentStep" class="z-40 mt-auto">
        <DialogBox
          ref="dialogBoxRef"
          :text="currentStep.text"
          :wait="currentStep.wait"
          :can-next="currentStep.type === 'dialogue'"
          @next="handleNext"
          @finish="handleDialogFinish"
        />
      </div>

      <!-- 確認重開的彈跳視窗 -->
      <transition name="modal-fade">
        <div
          v-if="showConfirm"
          class="absolute inset-0 z-100 flex items-center justify-center px-6"
        >
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="cancelRestart"
          />
          <div
            class="
              relative isolate w-full max-w-sm rounded-2xl border
              border-white/20 bg-white/10 p-8 text-center shadow-2xl
              backdrop-blur-sm will-change-[backdrop-filter,transform,opacity]
            "
          >
            <h3 class="mb-4 text-xl font-medium tracking-wider text-white/90">
              {{ UI_STRINGS.RESTART_CONFIRM_TITLE }}
            </h3>
            <p class="mb-8 text-sm/relaxed text-white/60">
              {{ UI_STRINGS.RESTART_CONFIRM_DESC }}
            </p>
            <div class="flex gap-4">
              <button
                class="
                  flex-1 rounded-full border border-white/20 py-3 text-sm
                  text-white/60 transition-colors
                  hover:bg-white/5
                "
                @click="cancelRestart"
              >
                取消
              </button>
              <button
                class="
                  flex-1 rounded-full border border-white/30 bg-white/10 py-3
                  text-sm text-white transition-colors
                  hover:bg-white/20
                "
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

.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    clip-path 0.4s ease,
    transform 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  transform: scale(0.97);
  clip-path: inset(0 0 100% 0 round 1rem);
}

.options-fade-enter-active,
.options-fade-leave-active {
  transition:
    clip-path 0.4s ease,
    transform 0.4s ease;
}

.options-fade-enter-from,
.options-fade-leave-to {
  transform: translateY(12px);
  clip-path: inset(100% 0 0 0 round 1rem);
}
</style>
