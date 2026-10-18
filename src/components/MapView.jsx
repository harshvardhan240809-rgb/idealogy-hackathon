import { MapContainer, Marker, Popup, TileLayer, Polyline, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import { formatDate, formatRelativeTime } from '../utils/helpers'
import StatusBadge from './StatusBadge'

const createMarkerIcon = (status) => {
  const colorMap = {
    VERIFIED: '#2e8b57',
    AGING: '#e0a82a',
    UNAVAILABLE: '#d94e4e',
    UNKNOWN: '#7b7b7b'
  }

  return L.divIcon({
    className: 'custom-marker-container',
    html: `<span class="custom-marker marker-${status.toLowerCase()}" style="background:${colorMap[status] || '#7b7b7b'}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -10]
  })
}

function FitMapToFacilities({ facilities, userLocation }) {
  const map = useMap()

  useEffect(() => {
    if (!facilities.length) return
    const points = facilities.map((facility) => [facility.latitude, facility.longitude])
    if (userLocation) points.push([userLocation.latitude, userLocation.longitude])
    if (points.length > 0) {
      map.fitBounds(points, { padding: [40, 40] })
    }
  }, [facilities, userLocation, map])

  return null
}

export default function MapView({ facilities, onSelect, userLocation, routePath }) {
  return (
    <div className="leaflet-map-wrap">
      <MapContainer center={[23.2, 77.4]} zoom={7} scrollWheelZoom className="leaflet-map">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <>
            <Circle center={[userLocation.latitude, userLocation.longitude]} radius={800} pathOptions={{ color: '#1b62a5', fillColor: '#1b62a5', fillOpacity: 0.12 }} />
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={L.divIcon({
              className: 'custom-marker-container',
              html: '<span class="custom-marker marker-user"></span>',
              iconSize: [18, 18],
              iconAnchor: [9, 18],
              popupAnchor: [0, -10]
            })}>
              <Popup>
                <div className="marker-popup">
                  <strong>Your location</strong>
                  <span>Current estimated user location</span>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {routePath && routePath.length > 1 && (
          <Polyline positions={routePath} pathOptions={{ color: '#0e6b58', weight: 4, opacity: 0.85 }} />
        )}

        {facilities.map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.latitude, facility.longitude]}
            icon={createMarkerIcon(facility.status)}
            eventHandlers={{ click: () => onSelect(facility) }}
          >
            <Popup>
              <div className="marker-popup">
                <div className="popup-head">
                  <strong>{facility.name}</strong>
                  <StatusBadge status={facility.status} />
                </div>
                <span>{facility.district}</span>
                <p>Last checked: {formatDate(facility.lastVerified)}</p>
                <p>Verified {formatRelativeTime(facility.lastVerified)}</p>
                <button type="button" className="btn btn-primary small" onClick={() => onSelect(facility)}>
                  Open Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        <FitMapToFacilities facilities={facilities} userLocation={userLocation} />
      </MapContainer>
    </div>
  )
}
