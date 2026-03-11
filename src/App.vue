<script setup lang="ts">
import AudioToggle from './components/AudioToggle.vue';
</script>

<template>
  <div class="min-h-screen bg-neutral-900 flex justify-center w-full">
    <div class="w-full max-w-md bg-black relative shadow-2xl overflow-hidden flex flex-col items-stretch">
      <AudioToggle />
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
