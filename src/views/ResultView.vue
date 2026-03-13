<!--
 * 測驗結果視圖
 * 根據最終獲得的分數，計算並顯示對應的內心狀態以及改善建議
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { TRANSITION_CONFIG, UI_STRINGS } from '../constants';
import { useAudioStore } from '../stores/audio';
import { useGameStore } from '../stores/game';
import { generateResultImage, waitForImages } from '../utils/image';

const router = useRouter();
const gameStore = useGameStore();
const audioStore = useAudioStore();
const { resultStatus, currentResult: resultData } = storeToRefs(gameStore);

function restart() {
  audioStore.playClick();
  gameStore.resetGame();
  router.replace('/');
}

const resultCardRef = ref<HTMLElement | null>(null);
const resultImageUrl = ref<string>('');
const isGenerating = ref(true);

onMounted(async () => {
  try {
    await nextTick();

    if (resultCardRef.value) {
      // 確保所有圖片都已載入
      await waitForImages(resultCardRef.value);

      // 稍微延遲以確保所有圖片、CSS、字體等渲染完成
      await new Promise(resolve =>
        setTimeout(resolve, TRANSITION_CONFIG.RESULT_GEN_PREPARE_DELAY),
      );

      // 產生圖片
      const dataUrl = await generateResultImage(resultCardRef.value, {
        backgroundColor: resultData.value.bgColor,
        pixelRatio: 2,
      });

      resultImageUrl.value = dataUrl;
    }
  }
  catch (err) {
    // 雖然不建議 console.log，但保留關鍵錯誤紀錄於開發模式
    console.error('[ResultView] generate image error', err);
  }
  finally {
    isGenerating.value = false;
  }
});
</script>

<template>
  <div
    class="
      relative flex min-h-lvh flex-1 flex-col items-center bg-black text-center
      text-white transition-colors duration-1000
    "
    :class="resultData.gradientClass"
  >
    <div class="relative z-10 mx-auto w-full max-w-md">
      <!-- 使用 Grid 堆疊佈局，防止切換時發生抖動 -->
      <div class="grid grid-cols-1 grid-rows-1">
        <!-- 渲染後的圖片，允許用戶長按儲存 -->
        <div
          v-if="resultImageUrl"
          class="animate-fade-in z-20 col-start-1 row-start-1"
        >
          <img
            :src="resultImageUrl"
            alt="測驗結果圖片"
            class="block h-auto w-full rounded-xl shadow-2xl"
          >
          <p
            class="
              mt-6 flex items-center justify-center gap-2 text-xs
              tracking-widest text-white/50
            "
          >
            <span>📸</span> {{ UI_STRINGS.GEN_IMAGE_TIP }}
          </p>
        </div>

        <!-- 原始 DOM，用來提供給 html-to-image 擷取 -->
        <div
          ref="resultCardRef"
          class="
            relative z-10 col-start-1 row-start-1 bg-linear-to-b p-8
            transition-opacity duration-300
          "
          :class="[
            resultData.gradientClass,
            { 'pointer-events-none opacity-0': resultImageUrl },
          ]"
        >
          <h2 class="mb-2 text-sm tracking-[0.2em] text-white/50">
            你的心境
          </h2>
          <h1
            class="font-serif text-4xl font-bold tracking-widest text-[#D3C7C7]"
          >
            {{ resultStatus }}
          </h1>

          <div class="mx-auto my-6 h-px w-12 bg-white/20" />

          <!-- 主訊息與呼吸法區塊 -->
          <div
            class="
              rounded-xl border border-white/10 bg-white/5 p-6 text-left
              text-sm/relaxed text-white/90 shadow-lg
            "
          >
            <p>{{ resultData.message }}</p>

            <div class="mt-4 border-t border-white/10 pt-4">
              <h3 class="mb-2 font-bold text-white">
                {{ resultData.breathingName }}
              </h3>
              <p class="text-white/70">
                {{ resultData.breathingDesc }}
              </p>
            </div>
          </div>

          <!-- 人物圖片 -->
          <div class="mt-6 flex justify-center">
            <img
              :src="resultData.image"
              alt="Character Result"
              class="
                max-h-96 rounded-xl object-contain
                drop-shadow-[0_10px_15px_rgba(255,255,255,0.05)]
              "
            >
          </div>

          <p class="mt-8 text-sm">
            ⚠️ 評測結果僅供自我評估與參考<br>
            如有任何症狀或需求，請務必尋求專業機構協助
          </p>
        </div>
      </div>

      <button
        class="
          mt-8 transform rounded-full border border-white/30 bg-white/10 px-8
          py-3 text-sm tracking-widest transition-all duration-300
          hover:scale-105 hover:bg-white/20
        "
        @click="restart"
      >
        {{ UI_STRINGS.RESTART_BTN }}
      </button>

      <div class="mx-auto my-6 h-px w-80 bg-white/20" />

      <!-- 感謝說明 -->

      <div
        class="
          mx-4 rounded-xl border border-white/10 bg-white/5 p-6 text-left
          text-sm/relaxed text-white/90 shadow-lg
        "
      >
        <p>
          ❤️
          感謝您完成這個測驗。您可以透過簡單的呼吸練習，讓緊繃的自己暫時放鬆！
          <br>
          <br>
          ⚠️
          再次提醒，這是一個小遊戲，如您有任何生活困擾、身心健康等問題，請尋求專業機構之協助，詳情參考<a
            href="https://dep.mohw.gov.tw/DOMHAOH/mp-107.html"
            target="_blank"
            class="text-white/50 underline"
          >衛生福利部心理健康司</a>。

          <br>
          <br>

          🎮 如發現遊戲程序的 bug 或是建議，也歡迎<a
            href="mailto:penspulse@gmail.com"
            target="_blank"
            class="text-white/50 underline"
          >來信聯絡</a>。
        </p>
      </div>

      <img src="/images/avatar_heart.png" alt="">
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
