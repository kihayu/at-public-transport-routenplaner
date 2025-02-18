<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="mb-8 text-center text-3xl font-bold text-gray-900">Öffi-Routenplaner</h1>
    <div class="flex flex-col gap-8">
      <AddressContainer @calculate="handleCalculate" />

      <div v-if="error" class="rounded-md bg-red-100 p-4 text-red-700">
        {{ error }}
      </div>

      <TransitResults :results="results" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTransitCalculator } from '@/composables/useTransitCalculator'
import AddressContainer from '@/components/AddressContainer.vue'
import TransitResults from '@/components/TransitResults.vue'
import type { AddressDuration } from '@/types/AddressDuration'

const { calculateTransitTimes, results, error } = useTransitCalculator()

const handleCalculate = async (addresses: Array<AddressDuration>, startTime: number) => {
  await calculateTransitTimes(addresses, startTime)
}
</script>
