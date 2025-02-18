<template>
  <div v-if="results.length > 0" class="rounded-lg bg-white p-6 shadow-md">
    <h3 class="mb-4 text-lg font-medium text-gray-900">Ergebnisse:</h3>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="(result, index) in results"
        :key="index"
        class="rounded-lg border border-gray-200 bg-white p-4 transition-shadow duration-200"
      >
        <div class="flex flex-col gap-2">
          <div class="text-sm text-gray-600">Von:</div>
          <div class="font-medium text-gray-900">{{ result.origin }}</div>
          <div class="mt-2 text-sm text-gray-600">Nach:</div>
          <div class="font-medium text-gray-900">{{ result.destination }}</div>
          <div class="mt-2 text-sm text-gray-600">Dauer:</div>
          <div class="font-medium text-blue-600">{{ result.duration }}</div>
          <div class="mt-2 text-sm text-gray-600">Ankunft:</div>
          <div class="font-medium text-gray-900">
            {{ formatArrivalTime(result.arrivalDateTime) }}
          </div>
          <template v-if="result.stayTime">
            <div class="mt-2 text-sm text-gray-600">Aufenthalt:</div>
            <div class="font-medium text-gray-900">{{ formatStayTime(result.stayTime) }}</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import moment from 'moment'
import type { TransitResult } from '@/types/TransitCalculator'

export interface TransitResultProps {
  results: Array<TransitResult>
}

defineProps<TransitResultProps>()

const formatArrivalTime = (isoTime: string) => {
  return moment(isoTime).format('HH:mm')
}

const formatStayTime = (msTime: string | null) => {
  return msTime ? moment.duration(parseInt(msTime, 10), 'seconds').humanize() : 'N/A'
}
</script>
