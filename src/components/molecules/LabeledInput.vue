<template>
  <div :class="{ 'w-full': containerFullWidth }" class="flex flex-col">
    <InputLabel :id="id">
      <slot name="label" />
    </InputLabel>
    <InputField :id="id" v-bind="$attrs" @input="emit('input', $event)" @blur="emit('blur')" />
  </div>
</template>

<script setup lang="ts">
import InputLabel from '@/components/atoms/InputLabel.vue'
import InputField from '@/components/atoms/InputField.vue'

export interface LabeledInputProps {
  id: string
  containerFullWidth?: boolean
}

withDefaults(defineProps<LabeledInputProps>(), {
  containerFullWidth: false,
})

const emit = defineEmits(['input', 'blur'])
</script>

<style scoped></style>
