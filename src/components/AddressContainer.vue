<template>
  <div class="max-h-fit rounded-lg bg-white p-6 shadow-md">
    <div class="mb-6 space-y-4">
      <div v-for="(address, index) in addresses" :key="index" class="relative">
        <AddressInput
          :address="address"
          :address-input="addressInputs[index]"
          :index="index"
          :show-extensions="index !== 0 && index !== addresses.length - 1"
          :start-date="startDate"
          :start-time="startTime"
          @update:address="updateAddress(index, $event)"
          @update:address-input="updateAddressInput(index, $event)"
          @update:start-time="updateStartTime"
          @update:start-date="updateStartDate"
          @remove="removeAddress"
        />
      </div>
    </div>

    <div class="mt-6 flex gap-4 border-t border-gray-200 pt-6">
      <button
        @click="addAddress"
        class="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200"
        type="button"
        :disabled="isLoading"
        :class="{ 'cursor-not-allowed opacity-50': isLoading }"
      >
        Adresse hinzufügen
      </button>
      <button
        @click="calculate"
        class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 disabled:hover:bg-blue-600"
        :disabled="addresses.length < 2 || isLoading || hasEmptyAddresses"
        :class="{
          'cursor-not-allowed opacity-50': addresses.length < 2 || isLoading || hasEmptyAddresses,
          'cursor-pointer': !isLoading && !hasEmptyAddresses,
        }"
      >
        {{ isLoading ? 'Berechne...' : 'Route berechnen' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AddressDuration } from '@/types/AddressDuration'
import AddressInput from '@/components/AddressInput.vue'
import moment from 'moment'

interface AddressInputState extends AddressDuration {
  durationInput: string
}

const emit = defineEmits<{
  calculate: [addresses: Array<AddressDuration>, startTime: number]
}>()

const isLoading = ref(false)
const startTime = ref(moment().format('HH:mm'))
const startDate = ref(moment().format('YYYY-MM-DD'))

const addresses = ref<Array<AddressDuration>>([
  { address: '', duration: 0 },
  { address: '', duration: 0 },
])

const addressInputs = ref<Array<AddressInputState>>([
  { address: '', duration: 0, durationInput: '' },
  { address: '', duration: 0, durationInput: '' },
])

const hasEmptyAddresses = computed(() => addresses.value.some((address) => !address.address.trim()))

const updateAddress = (index: number, newAddress: AddressDuration) => {
  addresses.value[index] = newAddress
}

const updateAddressInput = (index: number, newAddressInput: AddressInputState) => {
  addressInputs.value[index] = newAddressInput
}

const updateStartTime = (newTime: string) => {
  startTime.value = newTime
}

const updateStartDate = (newDate: string) => {
  startDate.value = newDate
}

const addAddress = () => {
  addresses.value.push({ address: '', duration: 0 })
  addressInputs.value.push({ address: '', duration: 0, durationInput: '' })
}

const removeAddress = (index: number) => {
  addresses.value.splice(index, 1)
  addressInputs.value.splice(index, 1)
}

const calculate = () => {
  const validAddresses = addresses.value.filter((address) => address.address.trim() !== '')
  const dateTime = moment(startDate.value, 'YYYY-MM-DD').set({
    hour: parseInt(startTime.value.split(':')[0]),
    minute: parseInt(startTime.value.split(':')[1]),
  })
  const startTimeSeconds = Math.floor(dateTime.valueOf() / 1000)
  emit('calculate', validAddresses, startTimeSeconds)
}
</script>
