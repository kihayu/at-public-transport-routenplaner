import { ref } from 'vue'

export interface PlacesAutocompleteResponse {
  predictions: google.maps.places.AutocompletePrediction[]
  status: string
}

export function usePlacesAutocomplete() {
  const predictions = ref<Array<google.maps.places.AutocompletePrediction>>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getPlacePredictions = async (input: string) => {
    if (!input) {
      predictions.value = []
      return
    }

    isLoading.value = true
    error.value = null

    const baseUrl = import.meta.env.VITE_TRANSPORT_PLANNER_BASE_URL || 'http://localhost:5279'
    try {
      const url = new URL('/api/v1/places/autocomplete', baseUrl)
      const params = {
        input,
        components: 'country:at',
        language: 'de',
      }

      url.search = new URLSearchParams(params).toString()

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PlacesAutocompleteResponse = await response.json()

      if (data.status === 'OK') {
        predictions.value = data.predictions
      } else {
        predictions.value = []
        if (data.status !== 'ZERO_RESULTS') {
          throw new Error(`Places API error: ${data.status}`)
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred'
      predictions.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    predictions,
    isLoading,
    error,
    getPlacePredictions,
  }
}
