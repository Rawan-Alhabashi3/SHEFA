function Badge({ children, className = '' }) {
  return <span className={`rounded-full bg-blue-100 dark:bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-200 ${className}`}>{children}</span>
}

export default Badge
