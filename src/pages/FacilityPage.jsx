import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import VerificationTimeline from '../components/VerificationTimeline'
import useFacilities from '../hooks/useFacilities'
import { formatDate, formatRelativeTime, getBooleanLabel } from '../utils/helpers'

export default function FacilityPage() {
  const { id } = useParams()
  const { facilities, isLoading } = useFacilities()
  const facility = facilities.find((item) => item.id === id)

  if (!facility) {
    return (
      <div className="page-shell container empty-state-shell">
        <div className="empty-box">
          <h3>{isLoading ? 'Loading facility' : 'Facility not found'}</h3>
          <p>{isLoading ? 'Retrieving facility records.' : 'The requested facility could not be located in the available records.'}</p>
          <Link to="/map" className="btn btn-primary">Back to map</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell container facility-page">
      <div className="page-header-row">
        <Link to="/map" className="btn btn-ghost small"><ArrowLeft size={14} /> Back to map</Link>
      </div>

      <section className="facility-detail-hero">
        <div>
          <span className="eyebrow">Facility overview</span>
          <h1>{facility.name}</h1>
          <p>{facility.address}</p>
          <div className="inline-badges">
            <StatusBadge status={facility.status} />
            <span className="plain-badge">{facility.district}</span>
          </div>
        </div>
        <div className="facility-cta-box">
          <a href={`tel:${facility.phone || ''}`} className="btn btn-primary">Call Facility</a>
          <Link to={`/map?facility=${facility.id}`} className="btn btn-secondary">View Route</Link>
        </div>
      </section>

      <section className="info-grid three-col">
        <div className="info-card">
          <h3>Verification status</h3>
          <div className="info-item"><span>Status</span><strong>{facility.status}</strong></div>
          <div className="info-item"><span>Checked</span><strong>{formatRelativeTime(facility.lastVerified)}</strong></div>
          <div className="info-item"><span>Source</span><strong>{facility.verificationSource || 'Unknown'}</strong></div>
          <div className="info-item"><span>Verified by</span><strong>{facility.verifiedBy || 'Unknown'}</strong></div>
        </div>

        <div className="info-card">
          <h3>What was checked</h3>
          <div className="info-item"><span>ASV availability</span><strong>{getBooleanLabel(facility.asvAvailable)}</strong></div>
          <div className="info-item"><span>Trained staff</span><strong>{getBooleanLabel(facility.trainedStaff)}</strong></div>
          <div className="info-item"><span>Emergency care</span><strong>{getBooleanLabel(facility.emergencyCare)}</strong></div>
          <div className="info-item"><span>Last checked</span><strong>{formatDate(facility.lastVerified)}</strong></div>
        </div>

        <div className="info-card">
          <h3>Location & contact</h3>
          <div className="info-item"><span>Distance</span><strong>Demo route preview</strong></div>
          <div className="info-item"><span>Phone</span><strong>{facility.phone || 'Unknown'}</strong></div>
          <div className="info-item"><span>Address</span><strong>{facility.address}</strong></div>
          <div className="info-item"><span>District</span><strong>{facility.district}</strong></div>
        </div>
      </section>

      <div className="warning-box">
        <AlertTriangle size={18} />
        Facility information can change. Confirm availability when possible. In an emergency, do not delay care while waiting for an app update.
      </div>

      <section className="two-col-grid">
        <div className="info-card">
          <h3>Data freshness</h3>
          <ul className="bullet-list">
            <li>Verification freshness: {facility.status === 'VERIFIED' ? 'Fresh' : 'Needs review'}</li>
            <li>Data confidence: {facility.status === 'UNKNOWN' ? 'Uncertain' : 'Moderate to strong'}</li>
            <li>Information source: {facility.verificationSource || 'Unknown source'}</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>Uncertainty</h3>
          <ul className="bullet-list">
            <li>Missing values are shown as Unknown.</li>
            <li>Availability claims require verification.</li>
            <li>Emergency care should be confirmed directly when possible.</li>
          </ul>
        </div>
      </section>

      <section className="info-card">
        <h3>Verification history</h3>
        <VerificationTimeline history={facility.verificationHistory || []} />
      </section>
    </div>
  )
}
