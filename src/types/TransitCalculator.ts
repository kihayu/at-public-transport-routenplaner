export interface TransitResult {
  origin: string
  destination: string
  duration: string
  startDateTime: string
  arrivalDateTime: string
  stayTime: string | null
  status: string
}

export interface DistanceMatrixResponse {
  status: string
  rows: Array<{
    elements: Array<{
      status: string
      duration: {
        text: string
        value: number
      }
    }>
  }>
}
