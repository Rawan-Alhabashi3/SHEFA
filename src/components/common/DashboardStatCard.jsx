import Card from './Card'

function DashboardStatCard({ icon: Icon, label, value, hint, className = '' }) {
  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
          {hint ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 p-3 text-blue-700 dark:text-blue-200 dark:bg-blue-950/60 dark:text-blue-200">
            <Icon size={18} />
          </div>
        ) : null}
      </div>
    </Card>
  )
}

export default DashboardStatCard
