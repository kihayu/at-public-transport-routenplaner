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

const { calculateTransitTimes, results, error } = useTransitCalculator()

const handleCalculate = async (addresses: Array<string>) => {
  await calculateTransitTimes(addresses)
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
  flex-direction: row;
  gap: var(--spacing-8);
}

.app-content .address-input {
  width: 66.66%;
}

.app-content .transit-results {
  width: 33.34%;
}

.app-content__full .address-input {
  width: 100%;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}
</style>
