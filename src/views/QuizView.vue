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
const { currentQuestion, progress, totalQuestions, isFinished } = storeToRefs(gameStore);

const isTransitioning = ref(false);

function handleSelect(score: number) {
  isTransitioning.value = true;

  // Wait a moment before switching questions
  setTimeout(() => {
    gameStore.answerQuestion(score);
    if (isFinished.value) {
      router.replace('/result');
    }
    isTransitioning.value = false;
  }, 600);
}
</script>

<template>
  <div class="flex-1 flex flex-col bg-black relative h-full">
    <ProgressBar :current="progress" :total="totalQuestions" />

    <div class="flex-1 flex flex-col mt-12 pb-6 overflow-y-auto">
      <CharacterImage />

      <div v-if="currentQuestion" class="flex-1 flex flex-col justify-end">
        <div class="transition-opacity duration-500" :class="{ 'opacity-0': isTransitioning }">
          <DialogBox :text="currentQuestion.text" />
        </div>

        <div class="mt-4 transition-opacity duration-500" :class="{ 'opacity-0': isTransitioning }">
          <OptionList :options="currentQuestion.options" :disabled="isTransitioning" @select="handleSelect" />
        </div>
      </div>
    </div>
  </div>
</template>
