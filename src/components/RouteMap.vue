<template>
  <div class="h-[250px] sm:h-[350px] md:h-[400px] w-full rounded-lg bg-white shadow-md">
    <div ref="mapRef" id="route-map" class="h-full w-full rounded-lg"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useGoogleMaps } from '@/composables/useGoogleMaps'
import type { TransitResult } from '@/types/TransitResult'

export interface RouteMapProps {
  results: Array<TransitResult>
}

const props = defineProps<RouteMapProps>()

const mapRef = ref<HTMLElement | null>(null)
let map: google.maps.Map | null = null
let markers: Array<google.maps.marker.AdvancedMarkerElement> = []
let polylines: Array<google.maps.Polyline> = []

const initMap = () => {
  if (!mapRef.value) {
    return
  }

  map = new google.maps.Map(mapRef.value, {
    zoom: 12,
    center: { lat: 48.2082, lng: 16.3719 }, // Set default location to Vienna
    mapTypeControl: false,
    streetViewControl: false,
    mapId: 'route-map',
  })
}

const clearMap = () => {
  markers.forEach((marker) => (marker.map = null))
  markers = []

  polylines.forEach((line) => line.setMap(null))
  polylines = []
}

const createCustomMarker = (position: google.maps.LatLng, label: string) => {
  const pin = document.createElement('div')
  pin.className =
    'flex items-center justify-center w-7 h-7 relative translate-y-1/2 rounded-full bg-red-500 text-white font-bold text-sm border-2 border-white shadow-md'
  pin.textContent = label

  return new google.maps.marker.AdvancedMarkerElement({
    position,
    map,
    content: pin,
  })
}

const updateRoute = async () => {
  if (!map || props.results.length === 0) {
    return
  }

  clearMap()

  const bounds = new google.maps.LatLngBounds()
  const locations: google.maps.LatLng[] = []
  let markerIndex = 1

  const processLocation = (location: string) => {
    return new Promise<google.maps.LatLng>((resolve) => {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results && results[0].geometry.location) {
          const latLng = results[0].geometry.location
          markers.push(createCustomMarker(latLng, markerIndex.toString()))
          markerIndex++
          bounds.extend(latLng)
          resolve(latLng)
        }
      })
    })
  }

  try {
    for (const result of props.results) {
      locations.push(await processLocation(result.origin))
      if (result === props.results[props.results.length - 1]) {
        locations.push(await processLocation(result.destination))
      }
    }

    for (let i = 0; i < locations.length - 1; i++) {
      const line = new google.maps.Polyline({
        path: [locations[i], locations[i + 1]],
        map,
        strokeColor: '#f87171',
        strokeOpacity: 0.8,
        strokeWeight: 2,
      })
      polylines.push(line)
    }

    map.fitBounds(bounds)
  } catch (error) {
    console.error('Error drawing route:', error)
  }
}

onMounted(async () => {
  const { loadGoogleMaps } = useGoogleMaps()
  await loadGoogleMaps()

  initMap()
  if (props.results.length > 0) {
    updateRoute()
  }
})

watch(
  () => props.results,
  () => {
    if (props.results.length > 0) {
      updateRoute()
    }
  },
  { deep: true },
)
</script>
