export interface TransitResult {
  origin: string
  destination: string
  duration: string
  startDateTime: string
  arrivalDateTime: string
  stayTime: string | null
  status: string
}
