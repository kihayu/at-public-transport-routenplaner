<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="mb-8 text-center text-3xl font-bold text-gray-900">Öffi-Routenplaner</h1>
    <div class="flex flex-col gap-8">
      <div class="max-h-fit rounded-lg bg-white p-6 shadow-md">
        <div
          class="my-4 flex flex-col-reverse gap-x-4 gap-y-4 border-b border-gray-300 pb-4 md:flex-row-reverse"
        >
          <div
            class="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200"
          >
            <button
              class="mr-2 cursor-pointer border-r border-gray-400 pr-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-fit"
              :disabled="!importedFile"
              @click="fillPlan"
            >
              Import
            </button>
            <input
              class="w-48 cursor-pointer md:w-fit [&_input]:!cursor-pointer"
              type="file"
              @change="importFile"
              accept=".json"
            />
          </div>
          <button
            class="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200"
            @click="exportPlan"
          >
            Export
          </button>
        </div>
        <AddressContainer
          :imported-addresses="addresses"
          @calculate="handleCalculate"
          @address-export="setAddresses"
        />
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
}
</script>
