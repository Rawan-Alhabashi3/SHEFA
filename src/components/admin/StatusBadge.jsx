import { useTranslation } from 'react-i18next'
import { getStatusBadgeClasses } from '../../utils/statusBadge'
import { translateEnum } from '../../utils/translateEnum'

function StatusBadge({ value, ns = 'common', labelKey = 'statusLabels' }) {
  const { t } = useTranslation(ns)
  const label = translateEnum(t, value, { ns, labelKey })

  return <span className={getStatusBadgeClasses(value)}>{label}</span>
}

export default StatusBadge
