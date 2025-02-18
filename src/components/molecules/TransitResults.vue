<template>
  <div v-if="results.length > 0" class="transit-results p-6">
    <h3 class="text-lg font-medium m-0 mb-4">Ergebnisse:</h3>
    <div class="transit-results__element grid gap-4">
      <div
        v-for="(result, index) in results"
        :key="index"
        class="transit-result p-4 border rounded bg-surface"
      >
        <div class="flex flex-col gap-2">
          <div class="text-sm text-gray-600">Von:</div>
          <div class="font-medium">{{ result.origin }}</div>
          <div class="text-sm text-gray-600 mt-2">Nach:</div>
          <div class="font-medium">{{ result.destination }}</div>
          <div class="text-sm text-gray-600 mt-2">Dauer:</div>
          <div class="font-medium text-primary">{{ result.duration }}</div>
          <div class="text-sm text-gray-600 mt-2">Ankunft:</div>
          <div class="font-medium">{{ formatArrivalTime(result.arrivalDateTime) }}</div>
          <template v-if="result.stayTime">
            <div class="text-sm text-gray-600 mt-2">Aufenthalt:</div>
            <div class="font-medium">{{ formatStayTime(result.stayTime) }}</div>
          </template>
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
  stayTime: string | null
  status: string
}

export interface TransitResultProps {
  results: Array<Result>
}

defineProps<TransitResultProps>()

const formatArrivalTime = (isoTime: string) => {
  return moment(isoTime).format('HH:mm')
}

const formatStayTime = (msTime: string | null) => {
  return msTime ? moment.duration(parseInt(msTime, 10), 'seconds').humanize() : 'N/A'
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

.transit-results__title {
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-lg);
}

.transit-results__element {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.transit-times {
  display: grid;
  gap: var(--spacing-4);
}
</style>
