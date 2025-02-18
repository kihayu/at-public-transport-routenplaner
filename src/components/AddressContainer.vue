<template>
  <div class="address-input card p-6">
    <div class="address-list mb-6">
      <div v-for="(_, index) in addresses" :key="index" class="address-field relative">
        <AddressInput
          :address="addresses[index]"
          :address-input="addressInputs[index]"
          :index="index"
          :show-extensions="index !== 0 && index !== addresses.length - 1"
          @update:address="updateAddress(index, $event)"
          @update:address-input="updateAddressInput(index, $event)"
          @update:start-time="updateStartTime"
          @remove="removeAddress"
        />
      </div>
    </div>

    <div class="actions border-t pt-6 mt-6 flex gap-4">
      <button
        @click="addAddress"
        class="button button-secondary"
        type="button"
        :disabled="isLoading"
      >
        Adresse hinzufügen
      </button>
      <button
        @click="calculate"
        class="button button-primary"
        :disabled="addresses.length < 2 || isLoading || hasEmptyAddresses"
      >
        {{ isLoading ? 'Berechne...' : 'Route berechnen' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AddressDuration } from '@/types/AddressDuration'
import AddressInput from '@/components/molecules/AddressInput.vue'
import moment from 'moment'

interface AddressInputState extends AddressDuration {
  durationInput: string
}

const emit = defineEmits<{
  calculate: [addresses: Array<AddressDuration>, startTime: number]
}>()

const isLoading = ref(false)
const startTime = ref(moment().format('HH:mm'))

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
  const time = moment(startTime.value, 'HH:mm')
  const startTimeSeconds = Math.floor(time.valueOf() / 1000)
  emit('calculate', validAddresses, startTimeSeconds)
}
</script>

<style>
.address-input {
  max-height: fit-content;
}

.address-field {
  margin-bottom: var(--spacing-4);
}

.address-field:last-child {
  margin-bottom: 0;
}
</style>
