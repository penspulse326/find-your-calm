/**
 * 應用程式路由配置
 * 定義各個頁面（首頁、測驗頁、結果頁）的路由路徑與對應組件
 */
import { createRouter, createWebHistory } from 'vue-router';
import { useGameStore } from '../stores/game';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: () => import('../views/QuizView.vue'),
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('../views/ResultView.vue'),
    },
  ],
});

// 導航守衛：防止直接從外部進入或重新整理導致狀態遺失
router.beforeEach((to) => {
  const gameStore = useGameStore();

  if (to.name === 'quiz' && !gameStore.isGameStarted) {
    return { name: 'home' };
  }

  if (to.name === 'result' && !gameStore.isFinished) {
    return { name: 'home' };
  }
});

export default router;
