import { Howl } from 'howler';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAudioStore = defineStore('audio', () => {
  const isMuted = ref(false);
  const clickSound = ref<Howl | null>(null);

  // Initialize sounds (in a real app, you would load real audio files)
  function initSounds() {
    // We are mocking this for now since we don't have assets yet
    clickSound.value = new Howl({
      src: ['data:audio/mp3;base64,'], // Empty valid base64 or placeholder
      onloaderror: () => {
        // Ignore errors for placeholder
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
