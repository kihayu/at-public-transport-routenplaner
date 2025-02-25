<template>
  <input
    :id="id"
    type="text"
    class="rounded-md border border-gray-300 px-2 sm:px-3 py-2 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none touch-manipulation"
    :class="{ 
      'text-center': centeredText, 
      'w-full': !shortWidth && !mediumWidth,
      'w-20 sm:w-24': shortWidth,
      'w-28 sm:w-36': mediumWidth
    }"
    v-maska="maskOptions"
    @input="emit('input', $event)"
    @blur="emit('blur')"
  />
</template>

<script setup lang="ts">
export interface InputProps {
  id: string
  maskOptions?: object
  centeredText?: boolean
  shortWidth?: boolean
  mediumWidth?: boolean
}

defineProps<InputProps>()

const emit = defineEmits(['input', 'blur'])
</script>
