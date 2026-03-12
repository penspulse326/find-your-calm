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
import { useAudioStore } from '../stores/audio';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();
const audioStore = useAudioStore();
const { currentStep, currentQuestionNumber, isFinished }
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
  }, 400);
}

function handleDialogFinish() {
  // 確保當前是測驗類型且無轉場中
  if (currentStep.value.type === 'quiz' && !isTransitioning.value) {
    // 將最新題目的選項存入副本，並顯示（觸發進入動畫）
    activeOptions.value = currentStep.value.options || [];
    showOptions.value = true;
  }
  else if (currentStep.value.type === 'dialogue' && currentStep.value.wait) {
    // 如果對話有標註 wait，在結束後自動進入下一步
    setTimeout(() => {
      // 確保還在同一題，避免使用者已經手動點擊
      if (currentStep.value.wait) {
        handleNext();
      }
    }, 1500);
  }
}

function handleNext() {
  // 只有在對話模式下，點擊對話框才會進入下一步
  // 如果是測驗模式，必須由選項點擊觸發下一階段
  if (currentStep.value.type === 'dialogue') {
    gameStore.nextStep();
  }
}

const bgUrl = computed(() => {
  if (!currentStep.value?.bg) {
    return '';
  }
  return `/images/${currentStep.value.bg}`;
});

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
    class="flex-1 flex flex-col bg-black relative min-h-screen overflow-hidden"
    :class="
      (currentStep?.type === 'quiz' && showOptions) || showConfirm
        ? 'cursor-default'
        : 'cursor-pointer'
    "
    @click="handleGlobalClick"
  >
    <div class="flex-1 flex flex-col relative overflow-hidden">
      <!-- 頂部標頭區域 -->
      <div
        class="absolute top-4 inset-x-4 z-50 flex items-center justify-between pointer-events-none"
      >
        <!-- 重新開始按鈕 -->
        <button
          class="p-2 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white hover:bg-white/30 transition-colors pointer-events-auto isolate will-change-[backdrop-filter,opacity]"
          aria-label="Restart Quiz"
          @click.stop="handleRestart"
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
        <div
          v-if="currentStep.type === 'quiz'"
          class="text-white/80 font-medium tracking-widest text-shadow-custom"
        >
          第 {{ currentQuestionNumber }} 題
        </div>
        <div v-else class="text-white/80 font-medium tracking-widest opacity-0">
          佔位
        </div>

        <!-- 用於平衡排版的佔位空間（對應右側絕對定位的音效按鈕） -->
        <div class="w-10" />
      </div>
      <!-- 角色與背景區域 -->
      <Transition name="bg-fade">
        <img
          v-if="bgUrl"
          :key="bgUrl"
          :src="bgUrl"
          alt=""
          class="absolute z-10 h-full w-full object-cover blur-[2px] opacity-50"
        >
      </Transition>
      <CharacterImage />

      <!-- 浮動選項層（傳統視覺小說風格） -->
      <div
        class="absolute inset-x-0 bottom-[140px] z-50 flex flex-col justify-center translate-y-0"
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
      <div v-if="currentStep" class="mt-auto z-40">
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
            class="relative bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl isolate will-change-[backdrop-filter,transform,opacity]"
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
