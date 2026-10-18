import { useMemo } from 'react'
import useFacilities from '../hooks/useFacilities'
import { formatDate } from '../utils/helpers'
import StatusBadge from '../components/StatusBadge'

export default function VerificationLogPage() {
  const { facilities } = useFacilities()
  const entries = useMemo(() => {
    return facilities
      .flatMap((facility) => (facility.verificationHistory || []).map((entry) => ({
        facility: facility.name,
        district: facility.district,
        status: entry.status,
        date: entry.date,
        source: entry.source,
        verifiedBy: entry.verifiedBy,
        notes: entry.notes
      })))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [facilities])

  return (
    <div className="page-shell container">
      <section className="section-block intro-block">
        <span className="eyebrow">Verification history</span>
        <h1>Recent updates and follow-ups</h1>
      </section>

      <div className="timeline log-list">
        {entries.map((entry, index) => (
          <div key={`${entry.facility}-${entry.date}-${index}`} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content log-card">
              <div className="log-header">
                <h3>{entry.facility}</h3>
                <StatusBadge status={entry.status} />
              </div>
              <div className="log-meta">
                <span>{entry.district}</span>
                <span>{formatDate(entry.date)}</span>
              </div>
              <p>{entry.notes || 'Verification updated with available information.'}</p>
              <small>Source: {entry.source || 'Unknown'} | Verified by: {entry.verifiedBy || 'Unknown'}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
