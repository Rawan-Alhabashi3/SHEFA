import { useTranslation } from 'react-i18next'
import { getStatusBadgeClasses } from '../../utils/statusBadge'
import { translateEnum } from '../../utils/translateEnum'

function PharmacyBadge({ status }) {
  const { t } = useTranslation('common')
  const label = translateEnum(t, status, { ns: 'common', labelKey: 'statusLabels' })
  return <span className={getStatusBadgeClasses(status)}>{label}</span>
}

export default PharmacyBadge
