<template>
  <div class="card">
    <div class="address-list">
      <div v-for="(_, index) in addresses" :key="index" class="address-field">
        <div class="input-group" style="position: relative">
          <label
            :for="'address-' + index"
            class="text-sm font-medium text-gray-700"
            style="margin-bottom: var(--spacing-2)"
          >
            Adresse {{ index + 1 }}
          </label>
          <div class="input-wrapper">
            <input
              :id="'address-' + index"
              v-model="addressInputs[index]"
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
            <button
              v-if="index > 1"
              @click="removeAddress(index)"
              class="button button-secondary"
              type="button"
              style="margin-left: var(--spacing-2)"
            >
              Entfernen
            </button>
          </div>
          <div v-if="showPredictions[index] && predictions.length > 0" class="predictions-dropdown">
            <div
              v-for="(prediction, predIndex) in predictions"
              :key="prediction.place_id"
              class="prediction-item"
              :class="{ active: activeIndex === predIndex }"
              @click="selectPrediction(prediction, index)"
            >
              <div class="main-text">{{ prediction.structured_formatting.main_text }}</div>
              <div class="secondary-text">
                {{ prediction.structured_formatting.secondary_text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="actions" style="margin-top: var(--spacing-6); display: flex; gap: var(--spacing-4)">
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

const emit = defineEmits<{
  calculate: [addresses: string[]]
}>()

const addresses = ref<string[]>(['', ''])
const addressInputs = ref<string[]>(['', ''])
const showPredictions = ref<boolean[]>([false, false])
const activeIndex = ref<number>(-1)
const isLoading = ref(false)

const { predictions, error: autocompleteError, getPlacePredictions } = usePlacesAutocomplete()

const hasEmptyAddresses = computed(() => addresses.value.some((address) => !address.trim()))

const addAddress = () => {
  addresses.value.push('')
  addressInputs.value.push('')
  showPredictions.value.push(false)
}

const removeAddress = (index: number) => {
  addresses.value.splice(index, 1)
  addressInputs.value.splice(index, 1)
  showPredictions.value.splice(index, 1)
}

const handleInput = async (index: number) => {
  if (addressInputs.value[index].length > 0) {
    isLoading.value = true
    await getPlacePredictions(addressInputs.value[index])
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
  addresses.value[index] = prediction.description
  addressInputs.value[index] = prediction.description
  showPredictions.value = showPredictions.value.map(() => false)
}

const calculate = () => {
  const validAddresses = addresses.value.filter((address) => address.trim() !== '')
  emit('calculate', validAddresses)
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

<style scoped>
.input-wrapper {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
}

.input-wrapper .input {
  flex: 1;
}

.route-details {
  display: grid;
  gap: var(--spacing-1);
  padding: var(--spacing-4);
  background-color: var(--color-surface-hover);
  border-radius: var(--radius-md);
}

.text-sm {
  font-size: var(--font-size-sm);
}

.text-gray-600 {
  color: var(--color-text-secondary);
}

.text-gray-700 {
  color: var(--color-text);
}

.font-medium {
  font-weight: 500;
}

.mt-2 {
  margin-top: var(--spacing-2);
}

.text-primary {
  color: var(--color-primary);
}

.transit-times {
  display: grid;
  gap: var(--spacing-4);
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

.actions {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-6);
}

.predictions-dropdown {
  max-height: 300px;
  overflow-y: auto;
  z-index: 50;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-lg);
  margin-top: var(--spacing-1);
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
