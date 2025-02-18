export interface PlaceAutocompletePrediction {
  description: string
  place_id: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export interface PlacesAutocompleteResponse {
  predictions: PlaceAutocompletePrediction[]
  status: string
}
