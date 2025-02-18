<template>
  <div v-if="results.length > 0" class="transit-results">
    <h3 style="margin-bottom: var(--spacing-4); font-size: var(--font-size-lg)">Ergebnisse:</h3>
    <div class="transit-times">
      <div v-for="(result, index) in results" :key="index" class="transit-time">
        <div class="route-details">
          <div class="text-sm text-gray-600">Von:</div>
          <div class="font-medium">{{ result.origin }}</div>
          <div class="text-sm text-gray-600 mt-2">Nach:</div>
          <div class="font-medium">{{ result.destination }}</div>
          <div class="text-sm text-gray-600 mt-2">Dauer:</div>
          <div class="font-medium text-primary">{{ result.duration }}</div>
          <div class="text-sm text-gray-600 mt-2">Ankunft:</div>
          <div class="font-medium">{{ formatArrivalTime(result.arrivalDateTime) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import moment from 'moment'

interface Result {
  origin: string
  destination: string
  duration: string
  arrivalDateTime: string
  status: string
}

export interface TransitResultProps {
  results: Array<Result>
}

defineProps<TransitResultProps>()

const formatArrivalTime = (isoTime: string) => {
  return moment(isoTime).format('HH:mm')
}
</script>

<style>
.route-details {
  display: grid;
  gap: var(--spacing-1);
  padding: var(--spacing-4);
  background-color: var(--color-surface-hover);
  border-radius: var(--radius-md);
}

.transit-times {
  display: grid;
  gap: var(--spacing-4);
}
</style>
