import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import scriptData from '../data/script.json';

export interface Option {
  label: string;
  text: string;
  score: number;
}

export interface GameStep {
  type: 'dialogue' | 'quiz';
  text: string;
  bg: string;
  character: string;
  wait?: number;
  id?: number;
  indicator?: string;
  options?: Option[];
}

export const useGameStore = defineStore('game', () => {
  const script = ref<GameStep[]>(scriptData as GameStep[]);
  const currentStepIndex = ref(0);
  const score = ref(0);
  const isFinished = ref(false);

  const currentStep = computed(() => script.value[currentStepIndex.value]);

  // 計算目前的題號 (只算 quiz 的類型)
  const currentQuestionNumber = computed(() => {
    let count = 0;
    for (let i = 0; i <= currentStepIndex.value; i++) {
      if (script.value[i].type === 'quiz') {
        count++;
      }
    }
    return count;
  });

  function nextStep() {
    if (currentStepIndex.value < script.value.length - 1) {
      currentStepIndex.value++;
    }
    else {
      isFinished.value = true;
    }
  }

  function answerQuestion(optionScore: number) {
    score.value += optionScore;
    nextStep();
  }

  function resetGame() {
    currentStepIndex.value = 0;
    score.value = 0;
    isFinished.value = false;
  }

  const resultStatus = computed(() => {
    const s = score.value;
    if (s <= 4) {
      return '靜謐之森';
    }
    if (s <= 9) {
      return '起風的海面';
    }
    if (s <= 14) {
      return '迷霧荒原';
    }
    return '雷鳴深淵';
  });

  return {
    script,
    currentStepIndex,
    currentStep,
    currentQuestionNumber,
    score,
    isFinished,
    resultStatus,
    nextStep,
    answerQuestion,
    resetGame,
  };
});
