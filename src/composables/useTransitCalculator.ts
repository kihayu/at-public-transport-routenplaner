import { ref } from 'vue'
import { Client, TravelMode } from '@googlemaps/google-maps-services-js'

interface TransitResult {
  origin: string
  destination: string
  duration: string
  status: string
}

export function useTransitCalculator() {
  const results = ref<TransitResult[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const client = new Client({})

  const calculateTransitTimes = async (addresses: string[]) => {
    if (addresses.length < 2) {
      error.value = 'At least two addresses are required'
      return
    }

    isLoading.value = true
    error.value = null
    results.value = []

    try {
      for (let i = 0; i < addresses.length - 1; i++) {
        const origin = addresses[i]
        const destination = addresses[i + 1]

        const response = await client.distancematrix({
          params: {
            origins: [origin],
            destinations: [destination],
            mode: TravelMode.transit,
            departure_time: Date.now(),
            key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          },
        })

        if (response.data.status === 'OK' && response.data.rows[0]?.elements[0]) {
          const element = response.data.rows[0].elements[0]
          results.value.push({
            origin,
            destination,
            duration: element.duration?.text || 'N/A',
            status: element.status,
          })
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
