import { ref } from 'vue'
import type { AddressDuration } from '@/types/AddressDuration'
import type { TransitResult } from '@/types/TransitResult'

export function useTransitCalculator() {
  const results = ref<Array<TransitResult>>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const calculateTransitTimes = async (addresses: Array<AddressDuration>, startTime: number) => {
    if (addresses.length < 2) {
      error.value = 'At least two addresses are required'
      return
    }

    isLoading.value = true
    error.value = null
    results.value = []

    const baseUrl = import.meta.env.VITE_TRANSPORT_PLANNER_BASE_URL || 'http://localhost:5279'
    try {
      const url = new URL('/api/v1/transit/calculate', baseUrl)

      const validatedAddresses: Array<AddressDuration> = []
      addresses.forEach((address) => {
        validatedAddresses.push({
          address: address.address,
          duration: address.duration || 0,
        })
      })

      const params = {
        addresses: validatedAddresses,
        startTime,
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Array<TransitResult> = await response.json()

      results.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    results,
    isLoading,
    error,
    calculateTransitTimes,
  }
}
