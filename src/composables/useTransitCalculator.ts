import { ref } from 'vue'
import type { AddressDuration } from '@/types/AddressDuration'
import type { TransitResult } from '@/types/TransitResult'

interface DistanceMatrixResponse extends google.maps.DistanceMatrixResponse {
  status: string
}

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

    try {
      let departureTime = startTime
      for (let i = 0; i < addresses.length - 1; i++) {
        const origin = addresses[i]
        const destination = addresses[i + 1]

        const url = new URL('/api/google/maps/api/distancematrix/json', window.location.origin)
        const params = {
          origins: origin.address,
          destinations: destination.address,
          mode: 'transit',
          departure_time: departureTime.toString(),
        }

        url.search = new URLSearchParams(params).toString()

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: DistanceMatrixResponse = await response.json()

        if (data.status === 'OK' && data.rows[0]?.elements[0]) {
          const element = data.rows[0].elements[0]
          results.value.push({
            origin: origin.address,
            destination: destination.address,
            duration: element.duration?.text || 'N/A',
            startDateTime: new Date(departureTime * 1000).toISOString(),
            arrivalDateTime: new Date(
              (departureTime + element.duration?.value || 0) * 1000,
            ).toISOString(),
            stayTime: destination.duration !== 0 ? destination.duration.toString() : null,
            status: element.status,
          })
          departureTime += destination.duration
          departureTime += element.duration?.value || 0
        } else {
          throw new Error('Failed to calculate distance')
        }
      }
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
