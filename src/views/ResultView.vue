<!--
 * 測驗結果視圖
 * 根據最終獲得的分數，計算並顯示對應的內心狀態以及改善建議
-->
<script setup lang="ts">
import { toPng } from 'html-to-image';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import avatarHeart from '../assets/images/avatar_heart.png';
import { getResultByScore } from '../data/results';
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
  return getResultByScore(score.value);
});

const resultCardRef = ref<HTMLElement | null>(null);
const resultImageUrl = ref<string>('');
const isGenerating = ref(true);

onMounted(async () => {
  try {
    await nextTick();
    // 稍微延遲以確保所有圖片、CSS、字體等渲染完成
    await new Promise(resolve => setTimeout(resolve, 800));

    if (resultCardRef.value) {
      // 轉換成 PNG
      const dataUrl = await toPng(resultCardRef.value, {
        quality: 1,
        backgroundColor: resultData.value.bgColor, // 防止透明背景，使用對應背景色
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
    class="flex-1 flex flex-col items-center text-center text-white min-h-screen relative transition-colors duration-1000 bg-zinc-900"
    :class="resultData.gradientClass"
  >
    <div class="z-10 w-full relative max-w-md mx-auto">
      <!-- 使用 Grid 堆疊佈局，防止切換時發生抖動 -->
      <div class="grid grid-cols-1 grid-rows-1">
        <!-- 渲染後的圖片，允許用戶長按儲存 -->
        <div
          v-if="resultImageUrl"
          class="col-start-1 row-start-1 z-20 animate-fade-in"
        >
          <img
            :src="resultImageUrl"
            alt="測驗結果圖片"
            class="w-full h-auto rounded-xl"
          >
          <p
            class="text-white/50 text-xs mt-6 tracking-widest flex items-center justify-center gap-2"
          >
            <span>📸</span> 長按或右鍵以另存圖片
          </p>
        </div>

        <!-- 原始 DOM，用來提供給 html-to-image 擷取 -->
        <div
          ref="resultCardRef"
          class="col-start-1 row-start-1 z-10 p-8 relative bg-linear-to-b transition-opacity duration-300"
          :class="[
            resultData.gradientClass,
            { 'opacity-0 pointer-events-none': resultImageUrl },
          ]"
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

          <p class="mt-8 text-sm">
            ⚠️ 評測結果僅供自我評估與參考<br>
            如有任何症狀或需求，請務必尋求專業機構協助
          </p>
        </div>
      </div>

      <button
        class="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full transition-all duration-300 tracking-widest text-sm transform hover:scale-105"
        @click="restart"
      >
        重新測驗
      </button>

      <div class="w-80 h-px bg-white/20 mx-auto my-6" />

      <!-- 感謝說明 -->

      <div
        class="text-white/90 mx-4 leading-relaxed text-sm text-left bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg"
      >
        <p>
          ❤️
          感謝您進行這個測驗。您可以透過簡單的呼吸練習，幫緊繃的自己按下暫停鍵！
          <br>
          <br>
          ⚠️
          再次提醒，這是一個小遊戲，如您有任何生活困擾、身心健康等問題，請尋求專業機構之協助，詳情參考
          <a
            href="https://dep.mohw.gov.tw/DOMHAOH/mp-107.html"
            target="_blank"
            class="text-white/50 underline"
          >衛生福利部心理健康司</a>。

          <br>
          <br>

          🎮 如遇到 bug 或是遊戲內容之建議，也歡迎
          <a
            href="mailto:penspulse@gmail.com"
            target="_blank"
            class="text-white/50 underline"
          >來信聯絡</a>。
        </p>
      </div>

      <img :src="avatarHeart" alt="">
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.1s ease-out forwards;
}
</style>
