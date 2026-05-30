import { getStatusBadgeClasses, getStatusLabel } from '../../utils/statusBadge'

function StatusBadge({ value }) {
  return <span className={getStatusBadgeClasses(value)}>{getStatusLabel(value)}</span>
}

export default StatusBadge
