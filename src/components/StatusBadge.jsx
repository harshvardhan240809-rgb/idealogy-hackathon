import { formatFacilityStatus, statusColors } from '../utils/helpers'

export default function StatusBadge({ status }) {
  const label = formatFacilityStatus(status)
  const variant = statusColors[status] || 'neutral'

  return <span className={`status-badge status-${variant}`}>{label}</span>
}
