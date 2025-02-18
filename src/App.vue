<template>
  <div class="app">
    <h1>Öffi-Routenplaner</h1>
    <AddressInput />
  </div>
</template>

<script setup lang="ts">
import AddressInput from './components/molecules/AddressInput.vue'
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}
</style>
