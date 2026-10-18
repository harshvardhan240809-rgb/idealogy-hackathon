import { useEffect, useState } from 'react'
import { fetchFacilitiesFromApi, getFacilities } from '../services/facilityService'

const STORAGE_KEY = 'vishpath_facilities'

export default function useFacilities() {
  const [facilities, setFacilities] = useState(() => getFacilities())
  const [source, setSource] = useState('local')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadFacilities() {
      let mode = 'local'
      try {
        const response = await fetch('/api/health')
        const health = await response.json()
        mode = health.mode || mode
      } catch {
        mode = 'local'
      }

      const records = await fetchFacilitiesFromApi()
      if (active) {
        setFacilities(records)
        setSource(mode)
        setIsLoading(false)
      }
    }

    function refreshLocalFacilities(event) {
      if (!event.key || event.key === STORAGE_KEY) setFacilities(getFacilities())
    }

    loadFacilities()
    window.addEventListener('storage', refreshLocalFacilities)
    return () => {
      active = false
      window.removeEventListener('storage', refreshLocalFacilities)
    }
  }, [])

  return { facilities, setFacilities, source, isLoading }
}