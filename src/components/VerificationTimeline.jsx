import { formatDate } from '../utils/helpers'
import StatusBadge from './StatusBadge'

export default function VerificationTimeline({ history = [] }) {
  if (!history.length) {
    return <div className="empty-box">No verification history available.</div>
  }

  return (
    <div className="timeline">
      {history.map((event, index) => (
        <div key={`${event.date}-${index}`} className="timeline-item">
          <div className="timeline-dot" />
          <div className="timeline-content">
            <div className="timeline-header">
              <StatusBadge status={event.status} />
              <span>{formatDate(event.date)}</span>
            </div>
            <p>{event.notes || 'Verification update recorded.'}</p>
            <small>Source: {event.source || 'Unknown'} | Verified by: {event.verifiedBy || 'Unknown'}</small>
          </div>
        </div>
      ))}
    </div>
  )
}
