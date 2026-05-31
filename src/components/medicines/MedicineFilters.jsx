import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getCategoryName } from '../../utils/category'

function MedicineFilters({ categories = [] }) {
  const { t, i18n } = useTranslation('medicines')
  const [searchParams, setSearchParams] = useSearchParams()
  const current = searchParams.get('category') || ''
  const language = i18n.resolvedLanguage || i18n.language

  const setCategory = value => {
    const next = new URLSearchParams(searchParams)
    if (!value) next.delete('category')
    else next.set('category', value)
    next.set('page', '1')
    setSearchParams(next)
  }

  const filterOptions = [
    { label: t('allCategories', { defaultValue: 'All' }), value: '' },
    ...categories.map(category => ({
      label: getCategoryName(category, language),
      value: category.slug || String(category.id || ''),
    })),
  ]

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {filterOptions.map(filter => {
        const isActive = current === filter.value || (!current && !filter.value)

        return (
          <button
            key={`${filter.value}-${filter.label}`}
            type="button"
            onClick={() => setCategory(filter.value)}
            className={`rounded-full border bg-white dark:bg-slate-900 px-4 py-2 text-sm transition ${
              isActive
                ? 'border-blue-200 dark:border-blue-700/70 text-blue-700 dark:text-blue-200'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-200 dark:border-blue-700/70 hover:text-blue-600 dark:text-blue-300'
            }`}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}

export default MedicineFilters
