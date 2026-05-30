function StatCard({ label, value }) {
  return (
    <article className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </article>
  )
}

export default StatCard
