import { getStatusBadgeClasses, getStatusLabel } from '../../utils/statusBadge'

function PharmacyBadge({ status }) {
  return <span className={getStatusBadgeClasses(status)}>{getStatusLabel(status)}</span>
}

export default PharmacyBadge
