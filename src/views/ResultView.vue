<!--
 * 測驗結果視圖
 * 根據最終獲得的分數，計算並顯示對應的內心狀態以及改善建議
-->
<script setup lang="ts">
import { toPng } from 'html-to-image';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import end1 from '../assets/images/end_1.png';
import end2 from '../assets/images/end_2.png';
import end3 from '../assets/images/end_3.png';
import end4 from '../assets/images/end_4.png';
import { useAudioStore } from '../stores/audio';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();
const audioStore = useAudioStore();
const { score, resultStatus } = storeToRefs(gameStore);

function restart() {
  audioStore.playClick();
  gameStore.resetGame();
  router.replace('/');
}

const resultData = computed(() => {
  const s = score.value;
  if (s <= 4) {
    return {
      message:
        '你的內心是一片平靜的湖泊。繼續保持目前的步調，每天 5 分鐘正念。',
      breathingName: '💡 建議練習：腹式呼吸',
      breathingDesc:
        '將手輕放在腹部，用鼻子深吸氣，感受肚子像氣球般隆起；接著用嘴巴緩慢吐氣，讓腹部自然凹陷。重複數次，能有效放鬆身心。',
      image: end1,
    };
  }
  if (s <= 9) {
    return {
      message: '有些波浪，但你還能掌舵。建議減少咖啡因，並嘗試 4-7-8 呼吸法。',
      breathingName: '💡 建議練習：4-7-8 呼吸法',
      breathingDesc:
        '用鼻子吸氣 4 秒，憋氣 7 秒，最後用嘴巴緩慢且微噘嘴唇地吐氣 8 秒。這個循環能幫助啟動副交感神經，快速找回平靜。',
      image: end2,
    };
  }
  if (s <= 14) {
    return {
      message: '你似乎迷失了方向。請實行數位排毒，嘗試箱式呼吸來找回主控權。',
      breathingName: '💡 建議練習：箱式呼吸',
      breathingDesc:
        '吸氣 4 秒，憋氣停頓 4 秒，吐氣 4 秒，再憋氣停頓 4 秒。想像氣流在畫一個正方形，能幫助穩定心跳，找回專注力。',
      image: end3,
    };
  }
  return {
    message:
      '風暴已經來臨。請優先處理生理需求，並尋求專業諮詢，適時按下暫停鍵。',
    breathingName: '💡 應急練習：清涼呼吸法',
    breathingDesc:
      '將舌頭捲成 U 型（若無法捲舌可微微張開嘴唇），從嘴巴深吸氣，感受涼爽空氣進入。接著閉上嘴巴由鼻子緩慢吐氣。有助於平復極度焦躁的情緒。',
    image: end4,
  };
});

const resultCardRef = ref<HTMLElement | null>(null);
const resultImageUrl = ref<string>('');
const isGenerating = ref(true);

onMounted(async () => {
  try {
    await nextTick();
    // 稍微延遲以確保所有圖片、CSS、字體等渲染完成
    await new Promise(resolve => setTimeout(resolve, 300));

    if (resultCardRef.value) {
      // 轉換成 PNG
      const dataUrl = await toPng(resultCardRef.value, {
        quality: 1,
        backgroundColor: '#000000', // 防止透明背景
        pixelRatio: 2, // 提高解析度
      });
      resultImageUrl.value = dataUrl;
    }
  }
  catch (err) {
    console.error('generate image error', err);
  }
  finally {
    isGenerating.value = false;
  }
});
</script>

<template>
  <div
    class="flex-1 flex flex-col items-center text-center bg-linear-to-b from-gray-900 to-black text-white min-h-screen relative"
  >
    <div class="z-10 w-full relative max-w-md mx-auto">
      <!-- 渲染後的圖片，允許用戶長按儲存 -->
      <div v-if="resultImageUrl" class="mb-4 animate-fade-in">
        <img :src="resultImageUrl" alt="測驗結果圖片" class="w-full h-auto">
        <p
          class="text-white/50 text-xs mt-6 tracking-widest flex items-center justify-center gap-2"
        >
          <span>📸</span> 長按或右鍵以另存圖片
        </p>
      </div>

      <!-- 原始 DOM，用來提供給 html-to-image 擷取，擷取完成後隱藏 -->
      <div
        v-show="!resultImageUrl"
        ref="resultCardRef"
        class="bg-linear-to-b from-gray-900 to-black p-8 border border-white/5 relative"
      >
        <h2 class="text-sm tracking-[0.2em] text-white/50 mb-2">
          最終評估
        </h2>
        <h1
          class="text-4xl font-serif font-bold tracking-widest text-[#D3C7C7]"
        >
          {{ resultStatus }}
        </h1>

        <div class="w-12 h-px bg-white/20 mx-auto my-6" />

        <!-- 主訊息與呼吸法區塊 -->
        <div
          class="text-white/90 leading-relaxed text-sm text-left bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg"
        >
          <p>{{ resultData.message }}</p>

          <div class="mt-4 pt-4 border-t border-white/10">
            <h3 class="font-bold text-white mb-2">
              {{ resultData.breathingName }}
            </h3>
            <p class="text-white/70">
              {{ resultData.breathingDesc }}
            </p>
          </div>
        </div>

        <!-- 人物圖片 -->
        <div class="flex justify-center mt-6">
          <img
            :src="resultData.image"
            alt="Character Result"
            class="max-h-96 object-contain rounded-xl drop-shadow-[0_10px_15px_rgba(255,255,255,0.05)]"
          >
        </div>
      </div>

      <div class="pt-6 pb-10">
        <button
          class="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full transition-all duration-300 tracking-widest text-sm transform hover:scale-105"
          @click="restart"
        >
          重新測驗
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
</style>
