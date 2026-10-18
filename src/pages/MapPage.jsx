import { useEffect, useMemo, useState } from 'react'
import { Check, Filter, LocateFixed, MapPin, Navigation, Search, SlidersHorizontal, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import FacilityCard from '../components/FacilityCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import MapView from '../components/MapView'
import useFacilities from '../hooks/useFacilities'
import { buildRouteSummary } from '../services/routingService'
import { calculateDistanceKm } from '../utils/helpers'

const filters = ['All', 'Verified', 'Aging', 'Unavailable', 'Unknown']

export default function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { facilities, isLoading } = useFacilities()
  const requestedFacilityId = searchParams.get('facility')
  const [filter, setFilter] = useState('All')
  const [sortMode, setSortMode] = useState('Nearest')
  const [query, setQuery] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [locationMessage, setLocationMessage] = useState('')
  const [selectedFacilityId, setSelectedFacilityId] = useState(() => requestedFacilityId || facilities[0]?.id || null)
  const [route, setRoute] = useState(null)
  const [error] = useState('')

  useEffect(() => {
    if (requestedFacilityId) {
      setSelectedFacilityId(requestedFacilityId)
    }
  }, [requestedFacilityId])

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationMessage('Location access unavailable in this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLocationMessage('Your location is active and route calculations are using it.')
      },
      () => {
        setLocationMessage('Location permission denied — continuing with demo location.')
        setUserLocation({ latitude: 23.2051, longitude: 77.085 })
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const filteredFacilities = useMemo(() => {
    const matchFilter = (facility) => {
      const normalized = facility.status
      if (filter === 'All') return true
      if (filter === 'Verified') return normalized === 'VERIFIED'
      if (filter === 'Aging') return normalized === 'AGING'
      if (filter === 'Unavailable') return normalized === 'UNAVAILABLE'
      if (filter === 'Unknown') return normalized === 'UNKNOWN'
      return true
    }

    const results = facilities.filter((facility) => {
      const haystack = [facility.name, facility.district, facility.village, facility.town].join(' ').toLowerCase()
      const includes = haystack.includes(query.trim().toLowerCase())
      return matchFilter(facility) && includes
    })

    if (sortMode === 'Nearest' && userLocation) {
      return results.sort((a, b) => {
        const da = calculateDistanceKm(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude)
        const db = calculateDistanceKm(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude)
        return da - db
      })
    }

    if (sortMode === 'Recently Verified') {
      return results.sort((a, b) => new Date(b.lastVerified) - new Date(a.lastVerified))
    }

    if (sortMode === 'Best Verification Confidence') {
      return results.sort((a, b) => {
        const scoreA = ((a.asvAvailable ? 1 : 0) + (a.trainedStaff ? 1 : 0) + (a.emergencyCare ? 1 : 0))
        const scoreB = ((b.asvAvailable ? 1 : 0) + (b.trainedStaff ? 1 : 0) + (b.emergencyCare ? 1 : 0))
        return scoreB - scoreA
      })
    }

    return results
  }, [facilities, filter, query, sortMode, userLocation])

  const activeFacilityId = requestedFacilityId || selectedFacilityId || facilities[0]?.id || null
  const selectedFacility = filteredFacilities.find((facility) => facility.id === activeFacilityId) || filteredFacilities[0] || facilities[0]
  const routeSummary = selectedFacility ? buildRouteSummary(userLocation || { latitude: 23.2051, longitude: 77.085 }, selectedFacility) : null

  useEffect(() => {
    if (!filteredFacilities.length) {
      setSelectedFacilityId(null)
      return
    }

    const stillVisible = filteredFacilities.some((facility) => facility.id === selectedFacilityId)
    if (!stillVisible && filteredFacilities[0]) {
      setSelectedFacilityId(filteredFacilities[0].id)
    }
  }, [filteredFacilities, selectedFacilityId])

  function handleRoute(facility) {
    setSelectedFacilityId(facility.id)
    setSearchParams({ facility: facility.id })
    if (!userLocation) {
      setRoute([
        [24.0, 77.0],
        [facility.latitude, facility.longitude]
      ])
      return
    }
    setRoute([
      [userLocation.latitude, userLocation.longitude],
      [facility.latitude, facility.longitude]
    ])
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported on this device.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLocationMessage('Using your live location to sort facilities.')
      },
      () => setLocationMessage('Permission denied; using demo location instead.')
    )
  }

  const statusSummary = {
    verified: facilities.filter((f) => f.status === 'VERIFIED').length,
    aging: facilities.filter((f) => f.status === 'AGING').length,
    unavailable: facilities.filter((f) => f.status === 'UNAVAILABLE').length,
    unknown: facilities.filter((f) => f.status === 'UNKNOWN').length
  }

  if (error) {
    return <div className="page-shell container"><ErrorState title="Map unavailable" message={error} action={() => window.location.reload()} /></div>
  }

  return (
    <div className="page-shell map-page-shell">
      <div className="container map-layout">
        <aside className="map-panel">
          <div className="panel-toolbar">
            <div className="panel-search">
              <Search size={15} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search village, town, district..."
                aria-label="Search facilities"
              />
            </div>
            <button type="button" className="icon-button" onClick={handleUseLocation} aria-label="Use current location">
              <LocateFixed size={15} />
            </button>
          </div>

          <div className="filter-row">
            {filters.map((item) => (
              <button key={item} type="button" className={`chip ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="toolbar-row">
            <div className="select-wrap">
              <SlidersHorizontal size={14} />
              <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} aria-label="Sort facilities">
                <option>Nearest</option>
                <option>Recently Verified</option>
                <option>Best Verification Confidence</option>
              </select>
            </div>
            <button type="button" className="btn btn-primary small" onClick={() => setRoute(null)}>
              Clear route
            </button>
          </div>

          {locationMessage && <div className="status-banner">{locationMessage}</div>}

          <div className="summary-strip">
            <span><Check size={14} />{statusSummary.verified} Verified</span>
            <span><Filter size={14} />{statusSummary.aging} Aging</span>
            <span><X size={14} />{statusSummary.unavailable} Unavailable</span>
            <span><MapPin size={14} />{statusSummary.unknown} Unknown</span>
          </div>

          <div className="facility-list">
            {isLoading ? <LoadingSkeleton rows={4} /> : filteredFacilities.length ? filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className={`facility-select ${selectedFacility?.id === facility.id ? 'active' : ''}`}
                onClick={() => setSelectedFacilityId(facility.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedFacilityId(facility.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <FacilityCard facility={facility} userLocation={userLocation} onRoute={handleRoute} onCall={() => {}} compact />
              </div>
            )) : (
              <div className="empty-box">No matching facilities found for your search.</div>
            )}
          </div>
        </aside>

        <main className="map-stage">
          <div className="map-header-bar">
            <div>
              <span className="eyebrow">Emergency map</span>
              <h2>Capable facility visibility</h2>
            </div>
            <div className="header-meta">
              {selectedFacility ? <><Navigation size={14} /> {selectedFacility.name}</> : 'No facility selected'}
            </div>
          </div>
          <MapView facilities={filteredFacilities} selectedFacility={selectedFacility} onSelect={(facility) => setSelectedFacilityId(facility.id)} userLocation={userLocation} routePath={route} />

          {selectedFacility && (
            <div className="route-panel">
              <div>
                <span className="eyebrow">Selected facility</span>
                <h3>{selectedFacility.name}</h3>
              </div>
              <div className="route-meta">
                <div>
                  <small>Your Location</small>
                  {userLocation ? 'Live location detected' : 'Demo location'}
                </div>
                <div>
                  <small>Distance</small>
                  {routeSummary?.distanceKm ? `${routeSummary.distanceKm.toFixed(1)} km` : 'Distance preview'}
                </div>
                <div>
                  <small>Estimated travel time</small>
                  {routeSummary?.etaMinutes ? `${routeSummary.etaMinutes} mins` : 'Pending'}
                </div>
              </div>
              <div className="route-actions">
                <a href={routeSummary?.mapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.latitude},${selectedFacility.longitude}`} className="btn btn-primary" target="_blank" rel="noreferrer">Start Navigation</a>
                <Link to={`/facility/${selectedFacility.id}`} className="btn btn-secondary">Open Facility Details</Link>
                <a href={`tel:${selectedFacility.phone || ''}`} className="btn btn-secondary">Call Facility</a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
