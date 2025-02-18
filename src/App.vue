<template>
  <div class="app">
    <h1>Öffi-Routenplaner</h1>
    <div class="app-content" :class="{ 'app-content__full': results.length == 0 }">
      <AddressInput @calculate="handleCalculate" />

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <TransitResults :results="results" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTransitCalculator } from '@/composables/useTransitCalculator'
import AddressInput from './components/molecules/AddressInput.vue'
import TransitResults from './components/molecules/TransitResults.vue'
import type { AddressDuration } from './types/AddressDuration'

const { calculateTransitTimes, results, error } = useTransitCalculator()

const handleCalculate = async (addresses: Array<AddressDuration>, startTime: number) => {
  await calculateTransitTimes(addresses, startTime)
}
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}
</style>
