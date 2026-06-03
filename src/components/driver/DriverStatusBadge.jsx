import { useTranslation } from 'react-i18next'
import { translateEnum } from '../../utils/translateEnum'

function DriverStatusBadge({ status, labelKey = 'statusLabels' }) {
  const { t } = useTranslation('common')
  const key = String(status || '').toLowerCase()
  const colors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200',
    waiting_pharmacy: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200',
    awaiting_driver: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200',
    assigned: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-200',
    accepted: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-200',
    picking_up: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200',
    picked_up: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200',
    delivering: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200',
    on_the_way: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200',
    delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200',
    cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200',
    rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200',
    failed: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200',
    online: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200',
    offline: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
    busy: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-200',
    read: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    unread: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-200',
  }

  const label = translateEnum(t, status, { ns: 'common', labelKey })

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[key] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
      {label}
    </span>
  )
}

export default DriverStatusBadge
