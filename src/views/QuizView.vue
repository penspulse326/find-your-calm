<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CharacterImage from '../components/CharacterImage.vue';
import DialogBox from '../components/DialogBox.vue';
import OptionList from '../components/OptionList.vue';
import ProgressBar from '../components/ProgressBar.vue';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();
const { currentQuestion, progress, totalQuestions, isFinished }
  = storeToRefs(gameStore);

const isTransitioning = ref(false);
const showOptions = ref(false);

function handleSelect(score: number) {
  isTransitioning.value = true;
  showOptions.value = false;

  // Wait a moment before switching questions
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
    <ProgressBar :current="progress" :total="totalQuestions" />

    <div class="flex-1 flex flex-col relative overflow-hidden">
      <!-- Character / Background Area -->
      <CharacterImage />

      <!-- Floating Options Layer (Traditional VN Style) -->
      <transition name="options-fade">
        <div
          v-if="currentQuestion && showOptions"
          class="absolute inset-x-0 bottom-[140px] z-50 flex flex-col justify-center translate-y-0"
        >
          <div class="px-4 pb-4">
            <OptionList
              :options="currentQuestion.options"
              :disabled="isTransitioning"
              @select="handleSelect"
            />
          </div>
        </div>
      </transition>

      <!-- Dialog Box Area -->
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
    </div>
  </div>
</template>

<style scoped>
.options-fade-enter-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.options-fade-leave-active {
  transition: all 0.4s ease-in;
}
.options-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.options-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
