import { calculateDistanceKm } from '../utils/helpers'

export function buildRouteSummary(userLocation, facility) {
  if (!userLocation || !facility) {
    return { distanceKm: null, etaMinutes: null }
  }

  const distanceKm = calculateDistanceKm(
    userLocation.latitude,
    userLocation.longitude,
    facility.latitude,
    facility.longitude,
  )

  const etaMinutes = Math.max(8, Math.round((distanceKm / 32) * 60))

  return {
    distanceKm,
    etaMinutes,
    destination: facility.name,
    mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`
  }
}
