<template>
  <div class="app">
    <h1>Öffi-Routenplaner</h1>
    <AddressInput @calculate="handleCalculate" />

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <TransitResults :results="results" />
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

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}
</style>
