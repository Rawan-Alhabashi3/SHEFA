const BASE_BADGE_CLASSES = 'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold'

const STATUS_CLASS_MAP = {
  active: 'bg-green-100 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700/70',
  open: 'bg-green-100 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700/70',
  approved: 'bg-green-100 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700/70',
  paid: 'bg-green-100 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700/70',
  delivered: 'bg-green-100 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700/70',
  published: 'bg-green-100 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700/70',
  completed: 'bg-green-100 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700/70',

  pending: 'bg-amber-100 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-700/70',
  pending_cash: 'bg-amber-100 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-700/70',
  waiting_pharmacy: 'bg-amber-100 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-700/70',
  awaiting_driver: 'bg-amber-100 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-700/70',
  awaiting_dropoff: 'bg-amber-100 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-700/70',
  partially_accepted: 'bg-amber-100 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-700/70',
  partially_rejected: 'bg-amber-100 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-700/70',
  in_process: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
  preparing: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
  ready_for_pickup: 'bg-green-100 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700/70',
  driver_assigned: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
  in_delivery: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
  picked_up: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
  on_the_way: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
  picking_up: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
  delivering: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
  assigned: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
  approved_by_pharmacy: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',
  received_by_pharmacy: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/70',

  inactive: 'bg-red-100 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700/70',
  closed: 'bg-red-100 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700/70',
  suspended: 'bg-red-100 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700/70',
  disabled: 'bg-red-100 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700/70',
  failed: 'bg-red-100 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700/70',
  rejected: 'bg-red-100 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700/70',
  cancelled: 'bg-red-100 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700/70',
  canceled: 'bg-red-100 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700/70',
  draft: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700',
  closed: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700',
}

export function getStatusBadgeClasses(value) {
  const key = String(value ?? '').trim().toLowerCase()
  return `${BASE_BADGE_CLASSES} ${STATUS_CLASS_MAP[key] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`
}

export function getStatusLabel(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return '-'
  const labels = {
    pending: 'Pending Approval',
    preparing: 'Preparing',
    ready_for_pickup: 'Ready for Pickup',
    in_delivery: 'In Delivery',
    driver_assigned: 'Driver Assigned',
    picked_up: 'Picked Up',
    on_the_way: 'On The Way',
    waiting_pharmacy: 'Waiting for Pharmacy',
    awaiting_driver: 'Awaiting Driver',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
  }
  if (labels[raw.toLowerCase()]) return labels[raw.toLowerCase()]
  return raw
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
