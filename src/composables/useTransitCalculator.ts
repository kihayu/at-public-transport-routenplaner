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
      const url = new URL('/api/transit/calculate', baseUrl)

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

//       for (let i = 0; i < addresses.length - 1; i++) {
//         const origin = addresses[i]
//         const destination = addresses[i + 1]

//         const params = {
//           origins: origin.address,
//           destinations: destination.address,
//           mode: 'transit',
//           departure_time: departureTime.toString(),
//         }

//         url.search = new URLSearchParams(params).toString()

//         const response = await fetch(url)
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         const data: DistanceMatrixResponse = await response.json()

//         if (data.status === 'OK' && data.rows[0]?.elements[0]) {
//           const element = data.rows[0].elements[0]
//           results.value.push({
//             origin: origin.address,
//             destination: destination.address,
//             duration: element.duration?.text || 'N/A',
//             startDateTime: new Date(departureTime * 1000).toISOString(),
//             arrivalDateTime: new Date(
//               (departureTime + element.duration?.value || 0) * 1000,
//             ).toISOString(),
//             stayTime: destination.duration !== 0 ? destination.duration.toString() : null,
//             status: element.status,
//           })
//           departureTime += destination.duration
//           departureTime += element.duration?.value || 0
//         } else {
//           throw new Error('Failed to calculate distance')
//         }
//       }
//     } catch (e) {
//       error.value = e instanceof Error ? e.message : 'An error occurred'
//     } finally {
//       isLoading.value = false
//     }
//   }

//   return {
//     results,
//     isLoading,
//     error,
//     calculateTransitTimes,
//   }
// }
