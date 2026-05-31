import { useTranslation } from 'react-i18next'

function OrdersStatusBadge({ status }) {
  const { t } = useTranslation('pharmacy')
  const map = {
    pending: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-700/70',
    preparing: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
    ready_for_pickup: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700/70',
    in_delivery: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
    assigned: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
    picked_up: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
    on_the_way: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
    delivered: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700/70',
    cancelled: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-200 border-rose-200 dark:border-rose-700/70',
    rejected: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-200 border-rose-200 dark:border-rose-700/70',
  }
  const cls = map[status] || 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
  const display = status ? t(`dashboard.statusLabels.${status}`) : '-'
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>{display}</span>
}

export default OrdersStatusBadge
