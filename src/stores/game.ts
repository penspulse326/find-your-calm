import type { GameStep } from '../types/game';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getResultByScore } from '../data/results';
import scriptData from '../data/script.json';

export const useGameStore = defineStore('game', () => {
  const script = ref<GameStep[]>(scriptData as GameStep[]);
  const currentStepIndex = ref(0);
  const score = ref(0);
  const isFinished = ref(false);
  const isGameStarted = ref(false);

  const currentStep = computed(() => script.value[currentStepIndex.value]);

  /** 計算目前的題號 (只計入 quiz 類型) */
  const currentQuestionNumber = computed(
    () =>
      script.value
        .slice(0, currentStepIndex.value + 1)
        .filter(step => step.type === 'quiz')
        .length,
  );

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
    isGameStarted.value = true; // 當呼叫 resetGame 開始遊戲時設為 true
  }

  const resultStatus = computed(() => getResultByScore(score.value).title);

  return {
    script,
    currentStepIndex,
    currentStep,
    currentQuestionNumber,
    score,
    isFinished,
    isGameStarted,
    resultStatus,
    nextStep,
    answerQuestion,
    resetGame,
  };
});
