import { demoFacilities } from '../data/demoData'

const STORAGE_KEY = 'vishpath_facilities'

export function getDefaultFacilities() {
  return structuredClone(demoFacilities)
}

export function getFacilities() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoFacilities))
    return structuredClone(demoFacilities)
  }

  try {
    return JSON.parse(saved)
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoFacilities))
    return structuredClone(demoFacilities)
  }
}

export async function fetchFacilitiesFromApi() {
  try {
    const response = await fetch('/api/facilities')
    if (!response.ok) throw new Error('Failed to fetch facilities')
    const data = await response.json()
    if (Array.isArray(data)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return data
    }
    return getFacilities()
  } catch {
    return getFacilities()
  }
}

export function saveFacilities(facilities) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(facilities))
}

export function getFacilityById(id, facilities = getFacilities()) {
  return facilities.find((facility) => facility.id === id)
}

export async function updateFacility(facility) {
  let savedFacility = facility
  let persisted = false

  try {
    const response = await fetch(`/api/facilities/${encodeURIComponent(facility.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facility)
    })
    // 404/405 means no API is deployed (e.g. static hosting); fall back to browser storage.
    if (response.status === 404 || response.status === 405) throw new Error('Facility API unavailable.')
    if (!response.ok) {
      const error = new Error(`Facility API returned ${response.status}.`)
      error.status = response.status
      throw error
    }
    savedFacility = await response.json()
    persisted = true
  } catch (error) {
    if (error.status) throw error
  }

  const facilities = getFacilities()
  const index = facilities.findIndex((item) => item.id === savedFacility.id)
  if (index >= 0) {
    facilities[index] = savedFacility
    saveFacilities(facilities)
    return { facility: savedFacility, persisted }
  }
  facilities.unshift(savedFacility)
  saveFacilities(facilities)
  return { facility: savedFacility, persisted }
}

export function addVerificationHistoryEntry(facilityId, entry) {
  const facilities = getFacilities()
  const facility = facilities.find((item) => item.id === facilityId)
  if (!facility) return null
  facility.verificationHistory = [entry, ...facility.verificationHistory]
  facility.lastVerified = entry.date
  facility.status = entry.status
  facility.verificationSource = entry.source
  facility.verifiedBy = entry.verifiedBy
  saveFacilities(facilities)
  return facility
}

export async function createFacility(facilityInput) {
  const facility = {
    ...facilityInput,
    id: facilityInput.id || `${facilityInput.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
    verificationHistory: [
      {
        date: facilityInput.lastVerified || new Date().toISOString(),
        status: facilityInput.status,
        source: facilityInput.verificationSource,
        verifiedBy: facilityInput.verifiedBy,
        notes: facilityInput.notes || 'Demo verification created.'
      },
      ...(Array.isArray(facilityInput.verificationHistory) ? facilityInput.verificationHistory : [])
    ]
  }
  return updateFacility(facility)
}
