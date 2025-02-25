<template>
  <div class="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8">
    <h1 class="mb-4 text-center text-2xl font-bold text-gray-900 sm:mb-8 sm:text-3xl">
      Öffi-Routenplaner
    </h1>
    <div class="flex flex-col gap-4 sm:gap-8">
      <div class="max-h-fit rounded-lg bg-white p-3 shadow-md sm:p-6">
        <div
          class="my-3 flex flex-col gap-3 border-b border-gray-200 pb-4 sm:my-4 sm:flex-row-reverse sm:gap-x-4"
        >
          <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <label
              class="relative flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-100 px-3 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200"
            >
              <span class="cursor-pointer">Import</span>
              <input
                class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                type="file"
                @change="importFile"
                accept=".json"
              />
            </label>
            <button
              class="w-full cursor-pointer rounded-md bg-blue-100 px-3 py-2 text-blue-700 transition-colors duration-200 hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:cursor-not-allowed hover:disabled:bg-blue-100"
              :disabled="!importedFile"
              @click="fillPlan"
            >
              Anwenden
            </button>
          </div>
          <button
            class="w-full cursor-pointer rounded-md bg-gray-100 px-3 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200 sm:w-auto"
            @click="exportPlan"
          >
            Export
          </button>
        </div>
        <div class="mt-2 sm:mt-0">
          <h2 class="mb-3 text-lg font-medium text-gray-900 sm:hidden">Adressen</h2>
          <AddressContainer
            :imported-addresses="addresses"
            @calculate="handleCalculate"
            @address-export="setAddresses"
          />
        </div>
      </div>

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
import { ref, type Ref } from 'vue'

const { calculateTransitTimes, results, error } = useTransitCalculator()

const handleCalculate = async (addresses: Array<AddressDuration>, startTime: number) => {
  await calculateTransitTimes(addresses, startTime)
}

const addresses: Ref<Array<AddressDuration>> = ref([
  { address: '', duration: 0 },
  { address: '', duration: 0 },
])
const importedFile = ref()

const setAddresses = (newAddresses: Array<AddressDuration>) => {
  addresses.value = newAddresses
}

const download = (content: string, filename: string) => {
  const element = document.createElement('a')
  const blob = new Blob([content], { type: 'application/json' })
  element.href = URL.createObjectURL(blob)
  element.download = filename
  element.click()
}

const importFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    importedFile.value = target.files[0]
  }
}

const exportPlan = () => {
  const exportJson = JSON.stringify(addresses.value)
  download(exportJson, 'plan.json')
}

const fillPlan = async () => {
  if (!importedFile.value) {
    return
  }
  const text = await importedFile.value.text()
  const jsonObject = JSON.parse(text)
  console.log(jsonObject)
  addresses.value = jsonObject as Array<AddressDuration>
  importedFile.value = null
}
</script>
