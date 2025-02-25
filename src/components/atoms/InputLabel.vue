<template>
  <label :for="id" class="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700">
    <slot />
  </label>
</template>

<script setup lang="ts">
export interface InputLabelProps {
  id: string
}

defineProps<InputLabelProps>()
</script>
