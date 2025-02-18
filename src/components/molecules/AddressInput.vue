<template>
  <label :for="'address-' + index" class="mb-2 text-sm font-medium text-gray-700">
    Adresse {{ index + 1 }}
  </label>
  <div class="flex items-start gap-2">
    <input
      :id="'address-' + index"
      :value="addressInput.address"
      type="text"
      placeholder="Geben Sie eine Adresse ein"
      class="input"
      :class="{ loading: isLoading }"
      @input="handleInput(index, $event)"
      @focus="handleFocus(index, $event)"
      @blur="handleBlur(index)"
      @keydown.enter="handleEnter(index)"
      @keydown.down.prevent="handleArrowDown()"
      @keydown.up.prevent="handleArrowUp()"
    />
    <!-- Start time input -->
    <input
      v-if="index === 0"
      id="address-starttime"
      :value="startTime"
      type="text"
      placeholder="HH:MM"
      class="input duration-input"
      v-maska="maskOptions"
      @input="updateStartTime"
      @blur="validateStartTime"
    />
    <template v-if="showExtensions">
      <!-- Stay duration time input -->
      <input
        :id="'address-duration-' + index"
        :value="addressInput.durationInput"
        type="text"
        placeholder="HH:MM"
        class="input duration-input"
        v-maska="maskOptions"
        @input="updateDuration($event)"
        @blur="validateDuration()"
      />

      <button
        @click="removeAddress(index)"
        class="button button-secondary ml-2"
        :class="{ hidden: index <= 1 }"
        type="button"
      >
        Entfernen
      </button>
    </template>
  </div>
  <div
    v-if="showPredictions[index] && predictions.length > 0"
    class="predictions-dropdown absolute top-full left-0 right-0 bg-surface border rounded shadow-md mt-1 z-50"
  >
    <div
      v-for="(prediction, predIndex) in predictions"
      :key="prediction.place_id"
      class="prediction-item p-2 hover:bg-surface-hover cursor-pointer transition-fast"
      :class="{ active: activeIndex === predIndex }"
      @click="selectPrediction(prediction)"
    >
      <div class="font-medium">{{ prediction.structured_formatting.main_text }}</div>
      <div class="text-sm text-gray-600">
        {{ prediction.structured_formatting.secondary_text }}
      </div>
    </div>
  </div>

  <div v-if="autocompleteError" class="error-message">
    {{ autocompleteError }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlacesAutocomplete } from '@/composables/usePlacesAutocomplete'
import type { AddressDuration } from '@/types/AddressDuration'
import { vMaska } from 'maska/vue'
import moment from 'moment'

export interface AddressInputProps {
  address: AddressDuration
  addressInput: AddressInputState
  index: number
  showExtensions?: boolean
}

const props = defineProps<AddressInputProps>()

const emit = defineEmits<{
  'update:address': [address: AddressDuration]
  'update:addressInput': [addressInput: AddressInputState]
  'update:startTime': [time: string]
  remove: [index: number]
}>()

const startTime = ref(moment().format('HH:mm'))

const updateStartTime = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:startTime', value)
}

const validateStartTime = () => {
  const time = moment(startTime.value, 'HH:mm', true)
  if (!time.isValid()) {
    emit('update:startTime', moment().format('HH:mm'))
  }
}

const updateDuration = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:addressInput', {
    ...props.addressInput,
    durationInput: value,
  })
}

const maskOptions = {
  mask: '##:##',
  tokens: {
    '#': { pattern: /[0-9]/, transform: (v: string) => v },
  },
}

interface AddressInputState extends AddressDuration {
  durationInput: string
}

const showPredictions = ref<boolean[]>([false, false])
const activeIndex = ref<number>(-1)
const isLoading = ref(false)

const { predictions, error: autocompleteError, getPlacePredictions } = usePlacesAutocomplete()

const validateDuration = () => {
  const timeStr = props.addressInput.durationInput
  if (!timeStr) {
    emit('update:addressInput', { ...props.addressInput, duration: 0 })
    emit('update:address', { ...props.address, duration: 0 })
    return
  }

  const time = moment(timeStr, 'HH:mm', true)
  if (time.isValid()) {
    const duration = time.hours() * 3600 + time.minutes() * 60
    emit('update:addressInput', { ...props.addressInput, duration })
    emit('update:address', { ...props.address, duration })
  } else {
    emit('update:addressInput', {
      ...props.addressInput,
      durationInput: '',
      duration: 0,
    })
    emit('update:address', { ...props.address, duration: 0 })
  }
}

const removeAddress = (index: number) => {
  emit('remove', index)
}

const handleInput = async (index: number, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:addressInput', {
    ...props.addressInput,
    address: value,
  })

  if (value.length > 0) {
    isLoading.value = true
    await getPlacePredictions(value)
    showPredictions.value[index] = true
    activeIndex.value = -1
    isLoading.value = false
  } else {
    showPredictions.value[index] = false
    activeIndex.value = -1
  }
}

const handleFocus = (index: number, event: Event) => {
  if (props.addressInput) {
    handleInput(index, event)
  }
}

const handleBlur = (index: number) => {
  // Timeout needed for prediction click - otherwise not working
  setTimeout(() => {
    showPredictions.value[index] = false
  }, 200)
}

const selectPrediction = (prediction: { description: string }) => {
  const { duration, durationInput } = props.addressInput

  emit('update:address', {
    address: prediction.description,
    duration,
  })

  emit('update:addressInput', {
    address: prediction.description,
    duration,
    durationInput,
  })

  showPredictions.value = showPredictions.value.map(() => false)
}

const handleEnter = (index: number) => {
  if (activeIndex.value >= 0 && activeIndex.value < predictions.value.length) {
    selectPrediction(predictions.value[activeIndex.value])
  }
  showPredictions.value[index] = false
  activeIndex.value = -1
}

const handleArrowDown = () => {
  if (predictions.value.length > 0) {
    activeIndex.value = (activeIndex.value + 1) % predictions.value.length
  }
}

const handleArrowUp = () => {
  if (predictions.value.length > 0) {
    activeIndex.value =
      activeIndex.value <= 0 ? predictions.value.length - 1 : activeIndex.value - 1
  }
}
</script>

<style>
.duration-input {
  flex: 0 0 100px;
  text-align: center;
}

.predictions-dropdown {
  max-height: 300px;
  overflow-y: auto;
}

.prediction-item {
  padding: var(--spacing-2) var(--spacing-3);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.prediction-item:hover,
.prediction-item.active {
  background-color: var(--color-surface-hover);
}
</style>
