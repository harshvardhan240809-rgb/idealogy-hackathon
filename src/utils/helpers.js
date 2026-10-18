export const statusColors = {
  VERIFIED: 'success',
  AGING: 'warning',
  UNAVAILABLE: 'danger',
  UNKNOWN: 'neutral'
}

export function formatFacilityStatus(status) {
  return {
    VERIFIED: 'Verified recently',
    AGING: 'Aging',
    UNAVAILABLE: 'Unavailable',
    UNKNOWN: 'Unknown'
  }[status] || 'Unknown'
}

export function formatDate(value) {
  if (!value) return 'Unknown'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Unknown'
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatShortDate(value) {
  if (!value) return 'Unknown'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Unknown'
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function formatRelativeTime(value) {
  if (!value) return 'Unknown'
  const d = new Date(value)
  const diffMs = Date.now() - d.getTime()
  const mins = Math.max(0, Math.floor(diffMs / 60000))

  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export function getStatusFromVerification(lastVerified, status) {
  if (status === 'UNAVAILABLE') return 'UNAVAILABLE'
  if (status === 'UNKNOWN') return 'UNKNOWN'
  if (!lastVerified) return 'UNKNOWN'
  const ageHours = (Date.now() - new Date(lastVerified).getTime()) / (1000 * 60 * 60)
  if (ageHours <= 72) return 'VERIFIED'
  if (ageHours <= 360) return 'AGING'
  return 'UNKNOWN'
}

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function routeToMaps(lat, lon) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function isTruthy(value) {
  return value === true
}

export function getBooleanLabel(value) {
  if (value === true) return 'Confirmed'
  if (value === false) return 'Not confirmed'
  return 'Unknown'
}
