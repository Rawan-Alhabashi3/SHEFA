function DriverStatusBadge({ status }) {
  const key = String(status || '').toLowerCase()
  const colors = {
    pending: 'bg-amber-100 text-amber-700 dark:text-amber-200',
    waiting_pharmacy: 'bg-amber-100 text-amber-700 dark:text-amber-200',
    awaiting_driver: 'bg-amber-100 text-amber-700 dark:text-amber-200',
    assigned: 'bg-sky-100 text-sky-700',
    accepted: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200',
    picking_up: 'bg-violet-100 text-violet-700',
    picked_up: 'bg-violet-100 text-violet-700',
    delivering: 'bg-indigo-100 text-indigo-700',
    on_the_way: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-700 dark:text-emerald-200',
    cancelled: 'bg-rose-100 text-rose-700 dark:text-rose-200',
    rejected: 'bg-rose-100 text-rose-700 dark:text-rose-200',
    failed: 'bg-rose-100 text-rose-700 dark:text-rose-200',
    online: 'bg-emerald-100 text-emerald-700 dark:text-emerald-200',
    offline: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
    busy: 'bg-orange-100 text-orange-700',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[key] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
      {String(status || '-').replaceAll('_', ' ')}
    </span>
  )
}

export default DriverStatusBadge
