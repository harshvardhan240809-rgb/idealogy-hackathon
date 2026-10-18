import { Link } from 'react-router-dom'
import { ArrowRight, Car, MapPin, Phone } from 'lucide-react'
import { formatDate, getBooleanLabel, calculateDistanceKm } from '../utils/helpers'
import StatusBadge from './StatusBadge'

export default function FacilityCard({ facility, userLocation, onRoute, onCall, compact = false }) {
  const distance = userLocation
    ? calculateDistanceKm(userLocation.latitude, userLocation.longitude, facility.latitude, facility.longitude)
    : null

  return (
    <div className={`facility-card ${compact ? 'compact' : ''}`}>
      <div className="facility-card-head">
        <div>
          <h3>{facility.name}</h3>
          <div className="facility-meta">
            <MapPin size={14} /> {facility.district}
          </div>
        </div>
        <StatusBadge status={facility.status} />
      </div>

      <div className="facility-stats">
        <div className="distance-pill"><strong>{distance ? `${distance.toFixed(1)} km away` : 'Distance unavailable'}</strong></div>
        <div><span className="meta-label">ASV</span><span>{getBooleanLabel(facility.asvAvailable)}</span></div>
        <div><span className="meta-label">Staff</span><span>{getBooleanLabel(facility.trainedStaff)}</span></div>
        <div><span className="meta-label">Emergency</span><span>{getBooleanLabel(facility.emergencyCare)}</span></div>
      </div>

      <div className="facility-meta-line">
        <span>Last checked</span>
        <strong>{formatDate(facility.lastVerified)}</strong>
      </div>
      <div className="facility-meta-line">
        <span>Source</span>
        <strong>{facility.verificationSource || 'Unknown'}</strong>
      </div>

      <div className="card-actions">
        <Link to={`/facility/${facility.id}`} className="btn btn-primary small">View Details</Link>
        <button type="button" className="btn btn-secondary small" onClick={() => onRoute?.(facility)}>
          <Car size={15} /> View Route
        </button>
        {facility.phone ? (
          <a href={`tel:${facility.phone}`} className="btn btn-ghost small" onClick={(e) => onCall && onCall(facility, e)}>
            <Phone size={15} /> Call
          </a>
        ) : (
          <button type="button" className="btn btn-ghost small" disabled>
            <Phone size={15} /> Call
          </button>
        )}
      </div>
      <div className="facility-card-footer">
        <span>Verified source: {facility.verificationSource || 'Unknown'}</span>
        <ArrowRight size={16} />
      </div>
    </div>
  )
}
