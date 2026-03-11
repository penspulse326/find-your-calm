<script setup lang="ts">
defineProps<{
  current: number;
  total: number;
}>();
</script>

<template>
  <div class="w-full p-4 flex items-center gap-4 bg-black/40 backdrop-blur pb-2 pt-4 absolute top-0 left-0 z-40 shadow-sm">
    <span class="text-white/80 font-mono text-sm tracking-wider font-bold shadow-sm">
      {{ String(current).padStart(2, '0') }} / {{ total }}
    </span>
    <div class="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
      <div
        class="h-full bg-white transition-all duration-700 ease-out"
        :style="{ width: `${(current / total) * 100}%` }"
      />
    </div>
  </div>
</template>
