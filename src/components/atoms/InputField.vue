<template>
  <input
    :id="id"
    type="text"
    class="rounded-md border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    :class="{ 'text-center': centeredText, 'w-24': shortWidth, 'w-full': !shortWidth }"
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
}

defineProps<InputProps>()

const emit = defineEmits(['input', 'blur'])
</script>
