function SearchResultItem({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40"
    >
      {Icon ? <Icon size={16} className="mt-0.5 text-blue-600 dark:text-blue-300" /> : null}
      <span>
        <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">{title}</span>
        {subtitle ? <span className="block text-xs text-slate-500 dark:text-slate-400">{subtitle}</span> : null}
      </span>
    </button>
  )
}

export default SearchResultItem
