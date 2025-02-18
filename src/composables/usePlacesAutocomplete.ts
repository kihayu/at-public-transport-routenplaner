import { ref } from 'vue'

interface PlaceAutocompletePrediction {
  description: string
  place_id: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

interface PlacesAutocompleteResponse {
  predictions: PlaceAutocompletePrediction[]
  status: string
}

export function usePlacesAutocomplete() {
  const predictions = ref<PlaceAutocompletePrediction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getPlacePredictions = async (input: string) => {
    if (!input) {
      predictions.value = []
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const url = new URL('/api/google/maps/api/place/autocomplete/json', window.location.origin)
      const params = {
        input,
        components: 'country:at',
        language: 'de',
        types: 'address',
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
