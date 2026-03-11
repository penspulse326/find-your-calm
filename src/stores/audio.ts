/**
 * 音效狀態管理 (Pinia Store)
 * 負責控制全域音效的播放與靜音狀態
 */
import { Howl } from 'howler';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAudioStore = defineStore('audio', () => {
  const isMuted = ref(false);
  const clickSound = ref<Howl | null>(null);

  // 初始化音效（如果未來有真實音檔，可以在這裡載入）
  function initSounds() {
    // 因為目前沒有音效素材，先使用空的 base64 作為佔位
    clickSound.value = new Howl({
      src: ['data:audio/mp3;base64,'], // 合法的空 base64
      onloaderror: () => {
        // 忽略佔位音效的載入錯誤
      },
    });
  }

  function playClick() {
    if (isMuted.value || !clickSound.value)
      return;
    clickSound.value.play();
  }

  function toggleMute() {
    isMuted.value = !isMuted.value;
    Howler.mute(isMuted.value);
  }

  return {
    isMuted,
    initSounds,
    playClick,
    toggleMute,
  };
});
