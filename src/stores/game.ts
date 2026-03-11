import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import questionsData from '../data/questions.json';

export interface Option {
  label: string;
  text: string;
  score: number;
}

export interface Question {
  id: number;
  indicator: string;
  text: string;
  options: Option[];
}

export const useGameStore = defineStore('game', () => {
  const currentQuestionIndex = ref(0);
  const score = ref(0);
  const questions = ref<Question[]>(questionsData);
  const isFinished = ref(false);
  const answers = ref<number[]>([]);

  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
  const progress = computed(() => currentQuestionIndex.value + 1);
  const totalQuestions = computed(() => questions.value.length);

  function answerQuestion(optionScore: number) {
    score.value += optionScore;
    answers.value.push(optionScore);

    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
    }
    else {
      isFinished.value = true;
    }
  }

  function resetGame() {
    currentQuestionIndex.value = 0;
    score.value = 0;
    isFinished.value = false;
    answers.value = [];
  }

  const resultStatus = computed(() => {
    const s = score.value;
    if (s <= 4)
      return '靜謐之森';
    if (s <= 9)
      return '起風的海面';
    if (s <= 14)
      return '迷霧荒原';
    return '雷鳴深淵';
  });

  return {
    currentQuestionIndex,
    score,
    questions,
    isFinished,
    answers,
    currentQuestion,
    progress,
    totalQuestions,
    resultStatus,
    answerQuestion,
    resetGame,
  };
});
