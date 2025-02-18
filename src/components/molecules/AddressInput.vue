<template>
  <div class="address-input">
    <div v-for="(address, index) in addresses" :key="index" class="address-field">
      <div class="input-group">
        <label :for="'address-' + index">Adresse {{ index + 1 }}</label>
        <input
          :id="'address-' + index"
          v-model="addresses[index]"
          type="text"
          placeholder="Geben Sie eine Adresse ein"
          class="address-input-field"
        />
        <button v-if="index > 1" @click="removeAddress(index)" class="remove-button" type="button">
          Entfernen
        </button>
      </div>
    </div>

    <div class="actions">
      <button @click="addAddress" class="add-button" type="button">Adresse hinzufügen</button>
      <button
        @click="calculate"
        class="calculate-button"
        :disabled="addresses.length < 2 || isLoading"
      >
        {{ isLoading ? 'Berechne...' : 'Berechnen' }}
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="results.length > 0" class="results">
      <h3>Ergebnisse:</h3>
      <div v-for="(result, index) in results" :key="index" class="result-item">
        <p>
          Von: {{ result.origin }}<br />
          Nach: {{ result.destination }}<br />
          Dauer: {{ result.duration }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTransitCalculator } from '@/composables/useTransitCalculator'

const addresses = ref<string[]>(['', '']) // Start with two address fields
const { calculateTransitTimes, results, isLoading, error } = useTransitCalculator()

const addAddress = () => {
  addresses.value.push('')
}

const removeAddress = (index: number) => {
  addresses.value.splice(index, 1)
}

const calculate = async () => {
  const validAddresses = addresses.value.filter((address) => address.trim() !== '')
  await calculateTransitTimes(validAddresses)
}
</script>

<style>
.address-input {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.address-field {
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

label {
  min-width: 100px;
}

.address-input-field {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button {
  background-color: #4caf50;
  color: white;
}

.remove-button {
  background-color: #f44336;
  color: white;
}

.calculate-button {
  background-color: #2196f3;
  color: white;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #f44336;
  margin-top: 10px;
}

.results {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.result-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.result-item:last-child {
  border-bottom: none;
}
</style>
