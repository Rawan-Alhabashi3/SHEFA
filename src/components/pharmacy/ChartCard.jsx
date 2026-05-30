import Card from '../common/Card'

function ChartCard({ title, children, right, isEmpty = false, loading = false, emptyText }) {
  return (
    <Card className="p-5 ring-1 ring-slate-200 dark:ring-slate-700/70">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {right}
      </div>
      <div className="relative h-[320px] min-h-[320px] w-full overflow-hidden">
        {loading ? (
          <div className="h-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        ) : isEmpty ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-500 dark:text-slate-400">
            {emptyText}
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  )
}

export default ChartCard
