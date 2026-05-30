function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 ${className}`}>{children}</div>
}

export default Card
