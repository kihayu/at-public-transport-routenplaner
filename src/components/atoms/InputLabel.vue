<template>
  <label :for="id" class="mb-2 text-sm font-medium text-gray-700">
    <slot />
  </label>
</template>

<script setup lang="ts">
export interface InputLabelProps {
  id: string
}

defineProps<InputLabelProps>()
</script>
