import { useSearchParams } from 'react-router-dom'

function MedicineFilters({ categories = [] }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const current = searchParams.get('category') || ''

  const setCategory = (value) => {
    const next = new URLSearchParams(searchParams)
    if (!value) next.delete('category')
    else next.set('category', value)
    next.set('page', '1')
    setSearchParams(next)
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {[{ label: 'All', value: '' }, ...categories.map((label) => ({ label, value: label }))].map((f) => {
        const isActive = current === f.value || (!current && !f.value)
        return (
          <button
            key={f.label}
            type="button"
            onClick={() => setCategory(f.value)}
            className={`rounded-full border bg-white dark:bg-slate-900 px-4 py-2 text-sm transition ${
              isActive
                ? 'border-blue-200 dark:border-blue-700/70 text-blue-700 dark:text-blue-200'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-200 dark:border-blue-700/70 hover:text-blue-600 dark:text-blue-300'
            }`}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}

export default MedicineFilters
