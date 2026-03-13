/**
 * 音效狀態管理 (Pinia Store)
 * 負責控制全域音效的播放與靜音狀態
 */
import { Howl, Howler } from 'howler';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import bgmUrl from '../assets/audios/bgm.mp3';
import clickUrl from '../assets/audios/click.mp3';

export const useAudioStore = defineStore('audio', () => {
  const isMuted = ref(false);
  const clickSound = ref<Howl | null>(null);
  const bgmSound = ref<Howl | null>(null);

  // 初始化音效
  function initSounds() {
    if (!clickSound.value) {
      clickSound.value = new Howl({
        src: [clickUrl],
        volume: 0.5,
      });
    }

    if (!bgmSound.value) {
      bgmSound.value = new Howl({
        src: [bgmUrl],
        loop: true,
        volume: 0.4,
        autoplay: true,
      });
    }
  }

  function playClick() {
    if (isMuted.value || !clickSound.value) {
      return;
    }
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
