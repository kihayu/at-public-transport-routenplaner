<template>
  <div class="address-input card p-6">
    <div class="address-list mb-6">
      <div v-for="(_, index) in addresses" :key="index" class="address-field">
        <div class="relative">
          <label :for="'address-' + index" class="mb-2 text-sm font-medium text-gray-700">
            Adresse {{ index + 1 }}
          </label>
          <div class="flex items-start gap-2">
            <input
              :id="'address-' + index"
              v-model="addressInputs[index].address"
              type="text"
              placeholder="Geben Sie eine Adresse ein"
              class="input"
              :class="{ loading: isLoading }"
              @input="handleInput(index)"
              @focus="handleFocus(index)"
              @blur="handleBlur(index)"
              @keydown.enter="handleEnter(index)"
              @keydown.down.prevent="handleArrowDown()"
              @keydown.up.prevent="handleArrowUp()"
            />
            <!-- Start time input -->
            <input
              v-if="index === 0"
              id="address-starttime"
              v-model="startTime"
              type="text"
              placeholder="HH:MM"
              class="input duration-input"
              v-maska="maskOptions"
              @blur="validateDuration(index)"
            />
            <!-- Stay duration time input -->
            <input
              v-else-if="index !== 0 && index !== addresses.length - 1"
              :id="'address-duration-' + index"
              v-model="addressInputs[index].durationInput"
              type="text"
              placeholder="HH:MM"
              class="input duration-input"
              v-maska="maskOptions"
              @blur="validateDuration(index)"
            />

            <button
              v-if="index !== 0 && index !== addresses.length - 1"
              @click="removeAddress(index)"
              class="button button-secondary ml-2"
              :class="{ hidden: index <= 1 }"
              type="button"
            >
              Entfernen
            </button>
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
              @click="selectPrediction(prediction, index)"
            >
              <div class="font-medium">{{ prediction.structured_formatting.main_text }}</div>
              <div class="text-sm text-gray-600">
                {{ prediction.structured_formatting.secondary_text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="actions border-t pt-6 mt-6 flex gap-4">
      <button
        @click="addAddress"
        class="button button-secondary"
        type="button"
        :disabled="isLoading"
      >
        Adresse hinzufügen
      </button>
      <button
        @click="calculate"
        class="button button-primary"
        :disabled="addresses.length < 2 || isLoading || hasEmptyAddresses"
      >
        {{ isLoading ? 'Berechne...' : 'Route berechnen' }}
      </button>
    </div>

    <div v-if="autocompleteError" class="error-message">
      {{ autocompleteError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import { usePlacesAutocomplete } from '@/composables/usePlacesAutocomplete'
import type { AddressDuration } from '@/types/AddressDuration'
import { vMaska } from 'maska/vue'
import moment from 'moment'

const startTime = ref(moment().format('HH:mm'))

const maskOptions = {
  mask: '##:##',
  tokens: {
    '#': { pattern: /[0-9]/, transform: (v: string) => v },
  },
}

const emit = defineEmits<{
  calculate: [addresses: Array<AddressDuration>, startTime: number]
}>()

interface AddressInputState extends AddressDuration {
  durationInput: string
}

const addresses = ref<Array<AddressDuration>>([
  { address: '', duration: 0 },
  { address: '', duration: 0 },
])
const addressInputs = ref<Array<AddressInputState>>([
  { address: '', duration: 0, durationInput: '' },
  { address: '', duration: 0, durationInput: '' },
])
const showPredictions = ref<boolean[]>([false, false])
const activeIndex = ref<number>(-1)
const isLoading = ref(false)

const { predictions, error: autocompleteError, getPlacePredictions } = usePlacesAutocomplete()

const hasEmptyAddresses = computed(() => addresses.value.some((address) => !address.address.trim()))

const validateDuration = (index: number) => {
  const timeStr = addressInputs.value[index].durationInput
  if (!timeStr) {
    addressInputs.value[index].duration = 0
    addresses.value[index].duration = 0
    return
  }

  const time = moment(timeStr, 'HH:mm', true)
  if (time.isValid()) {
    const duration = time.hours() * 3600 + time.minutes() * 60
    addressInputs.value[index].duration = duration
    addresses.value[index].duration = duration
  } else {
    addressInputs.value[index].durationInput = ''
    addressInputs.value[index].duration = 0
    addresses.value[index].duration = 0
  }
}

const addAddress = () => {
  addresses.value.push({ address: '', duration: 0 })
  addressInputs.value.push({ address: '', duration: 0, durationInput: '' })
  showPredictions.value.push(false)
}

const removeAddress = (index: number) => {
  addresses.value.splice(index, 1)
  addressInputs.value.splice(index, 1)
  showPredictions.value.splice(index, 1)
}

const handleInput = async (index: number) => {
  if (addressInputs.value[index].address.length > 0) {
    isLoading.value = true
    await getPlacePredictions(addressInputs.value[index].address)
    showPredictions.value[index] = true
    activeIndex.value = -1
    isLoading.value = false
  } else {
    showPredictions.value[index] = false
    activeIndex.value = -1
  }
}

const handleFocus = (index: number) => {
  if (addressInputs.value[index]) {
    handleInput(index)
  }
}

const handleBlur = (index: number) => {
  // Timeout needed for prediction click - otherwise not working
  setTimeout(() => {
    showPredictions.value[index] = false
  }, 200)
}

const selectPrediction = (prediction: { description: string }, index: number) => {
  const currentDuration = addressInputs.value[index].duration
  const currentDurationInput = addressInputs.value[index].durationInput

  addresses.value[index] = { address: prediction.description, duration: currentDuration }
  addressInputs.value[index] = {
    address: prediction.description,
    duration: currentDuration,
    durationInput: currentDurationInput,
  }
  showPredictions.value = showPredictions.value.map(() => false)
}

const calculate = () => {
  const validAddresses = addresses.value.filter((address) => address.address.trim() !== '')
  const unixStartTime = moment(startTime.value, 'HH:mm', true).unix()
  emit('calculate', validAddresses, unixStartTime)
}

const handleEnter = (index: number) => {
  if (activeIndex.value >= 0 && activeIndex.value < predictions.value.length) {
    selectPrediction(predictions.value[activeIndex.value], index)
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
.address-input {
  max-height: fit-content;
}

.address-field {
  margin-bottom: var(--spacing-4);
}

.address-field:last-child {
  margin-bottom: 0;
}

.address-list {
  margin-bottom: var(--spacing-6);
}

.input-wrapper .input {
  flex: 1;
}

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
