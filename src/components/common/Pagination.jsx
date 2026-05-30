import { useTranslation } from 'react-i18next'

function buildPages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  if (start > 2) pages.push('start-ellipsis')
  for (let i = start; i <= end; i += 1) pages.push(i)
  if (end < totalPages - 1) pages.push('end-ellipsis')

  pages.push(totalPages)
  return pages
}

function Pagination({ currentPage = 1, totalPages = 1, onChange = () => {} }) {
  const { t } = useTranslation('common')
  if (totalPages <= 1) return null
  const pages = buildPages(currentPage, totalPages)

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:border-blue-200 dark:border-blue-700/70 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40 hover:text-blue-700 dark:text-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
      >
        {t('ui.previous')}
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, idx) => {
          if (typeof page !== 'number') {
            return (
              <span key={`${page}-${idx}`} className="px-2 text-sm text-slate-500 dark:text-slate-400">
                ...
              </span>
            )
          }

          const active = page === currentPage
          return (
            <button
              key={page}
              type="button"
              onClick={() => onChange(page)}
              className={`h-9 min-w-9 rounded-full px-3 text-sm font-semibold transition ${
                active
                  ? 'bg-blue-600 text-white shadow-sm dark:shadow-slate-950/20'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-blue-200 dark:border-blue-700/70 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40 hover:text-blue-700 dark:text-blue-200'
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:border-blue-200 dark:border-blue-700/70 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40 hover:text-blue-700 dark:text-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        {t('ui.next')}
      </button>
    </div>
  )
}

export default Pagination
