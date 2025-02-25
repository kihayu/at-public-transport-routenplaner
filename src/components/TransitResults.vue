<template>
  <div v-if="results.length > 0" class="rounded-lg bg-white p-3 sm:p-6 shadow-md">
    <RouteMap :results="results" />
    <h3 class="mt-4 sm:mt-6 mb-3 sm:mb-4 text-xl sm:text-2xl font-medium text-gray-900">Route</h3>
    <div v-for="(result, index) in results" :key="index" class="bg-white">
      <div class="flex flex-col">
        <div class="grid grid-cols-[auto_1fr] grid-rows-[auto_2fr_auto] gap-x-2 sm:gap-x-3">
          <template v-if="index === 0 || results[index - 1].stayTime">
            <span class="row-start-1 self-center text-xs sm:text-sm text-gray-600">
              {{ formatDateTime(result.startDateTime) }}
            </span>
            <div class="row-start-1 text-sm sm:text-base font-medium text-gray-900">{{ result.origin }}</div>
          </template>
          <span class="col-span-1 row-start-2 my-2 text-center text-gray-600">↓</span>
          <span class="col-span-1 row-start-2 my-2 self-center text-xs sm:text-sm font-medium text-gray-900">
            {{ result.duration }}
          </span>
          <span class="row-start-3 self-center text-xs sm:text-sm text-gray-600">
            {{ formatDateTime(result.arrivalDateTime) }}
          </span>
          <div class="row-start-3 text-sm sm:text-base font-medium text-gray-900">
            {{ result.destination }}
          </div>
        </div>

        <template v-if="result.stayTime">
          <div class="my-4 sm:my-6 text-sm sm:text-base font-medium text-gray-900">
            Aufenthalt: {{ formatTime(result.stayTime) }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import RouteMap from '@/components/RouteMap.vue'
import { formatTime } from '@/utils/formatTime'
import type { TransitResult } from '@/types/TransitResult'

export interface TransitResultProps {
  results: Array<TransitResult>
}

defineProps<TransitResultProps>()

const formatDateTime = (isoTime: string) => {
  return moment(isoTime).format('HH:mm')
}
</script>
