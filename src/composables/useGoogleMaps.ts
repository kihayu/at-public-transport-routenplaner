let isLoaded = false
let loadPromise: Promise<void> | null = null

export function useGoogleMaps() {
  const loadGoogleMaps = () => {
    if (isLoaded) {
      return Promise.resolve()
    }

    if (loadPromise) {
      return loadPromise
    }

    loadPromise = new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script')
        const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        script.src = `/api/google/maps/api/js?key=${googleMapsApiKey}&libraries=places,geometry,marker`
        script.async = true
        script.defer = true

        script.addEventListener('load', () => {
          isLoaded = true
          resolve()
        })

        script.addEventListener('error', () => {
          reject(new Error('Failed to load Google Maps API'))
        })

        document.head.appendChild(script)
      } catch (error) {
        reject(error)
      }
    })

    return loadPromise
  }

  return {
    loadGoogleMaps,
  }
}
