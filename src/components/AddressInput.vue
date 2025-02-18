<template>
  <div class="flex w-full gap-2">
    <InputField
      :id="'address-' + index"
      :value="addressInput.address"
      container-full-width
      placeholder="Geben Sie eine Adresse ein"
      :class="{ 'bg-gray-50': isLoading }"
      @input="handleInput(index, $event)"
      @focus="handleFocus(index, $event)"
      @blur="handleBlur(index)"
      @keydown.enter="handleEnter(index)"
      @keydown.down.prevent="handleArrowDown()"
      @keydown.up.prevent="handleArrowUp()"
    >
      <template #label> Adresse {{ index + 1 }} </template>
    </InputField>
    <InputField
      v-if="index === 0"
      id="address-startdate"
      :value="props.startDate"
      type="date"
      centered-text
      @input="updateStartDate"
      @blur="validateStartDate"
    >
      <template #label> Startdatum </template>
    </InputField>
    <InputField
      v-if="index === 0"
      id="address-starttime"
      :value="props.startTime"
      placeholder="HH:MM"
      :mask-options="hourMinuteMaskOptions"
      centered-text
      short-width
      @input="updateStartTime"
      @blur="validateStartTime"
    >
      <template #label> Startzeit </template>
    </InputField>

    <template v-if="showExtensions">
      <InputField
        id="address-duration"
        :value="addressInput.durationInput"
        placeholder="HH:MM"
        :mask-options="hourMinuteMaskOptions"
        centered-text
        short-width
        @input="updateDuration($event)"
        @blur="validateDuration"
      >
        <template #label> Verweildauer </template>
      </InputField>
      <button
        @click="removeAddress(index)"
        class="mt-7 cursor-pointer rounded-md bg-red-50 px-4 py-2 text-red-600 transition-colors duration-200 hover:bg-red-100 hover:text-red-700"
        :class="{ hidden: index < 1 }"
        type="button"
      >
        Entfernen
      </button>
    </template>
  </div>
  <div
    v-if="showPredictions[index] && predictions.length > 0"
    class="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
  >
    <div
      v-for="(prediction, predIndex) in predictions"
      :key="prediction.place_id"
      class="cursor-pointer p-3 transition-colors duration-200 hover:bg-gray-50"
      :class="{ 'bg-gray-50': activeIndex === predIndex }"
      @click="selectPrediction(prediction)"
    >
      <div class="font-medium text-gray-900">{{ prediction.structured_formatting.main_text }}</div>
      <div class="text-sm text-gray-500">
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
import InputField from '@/components/molecules/InputField.vue'
import moment from 'moment'

export interface AddressInputProps {
  address: AddressDuration
  addressInput: AddressInputState
  index: number
  showExtensions?: boolean
  startDate: string
  startTime: string
}

const props = defineProps<AddressInputProps>()

const emit = defineEmits<{
  'update:address': [address: AddressDuration]
  'update:addressInput': [addressInput: AddressInputState]
  'update:startTime': [time: string]
  'update:startDate': [date: string]
  remove: [index: number]
}>()



const updateStartTime = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:startTime', value)
}

const validateStartTime = () => {
  const time = moment(props.startTime, 'HH:mm', true)
  if (!time.isValid()) {
    emit('update:startTime', moment().format('HH:mm'))
  }
}

const updateStartDate = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:startDate', value)
}

const validateStartDate = () => {
  const date = moment(props.startDate, 'YYYY-MM-DD', true)
  if (!date.isValid()) {
    emit('update:startDate', moment().format('YYYY-MM-DD'))
  }
}

const updateDuration = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:addressInput', {
    ...props.addressInput,
    durationInput: value,
  })
}

const hourMinuteMaskOptions = {
  mask: '##:##',
  tokens: {
    '#': { pattern: /[0-9]/, transform: (v: string) => v },
  },
}

interface AddressInputState extends AddressDuration {
  durationInput: string
}

const showPredictions = ref<Array<boolean>>([false, false])
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
