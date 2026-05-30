import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Container from '../common/Container'
import EmptyState from '../common/EmptyState'
import SectionTitle from '../common/SectionTitle'
import MedicineGrid from '../medicines/MedicineGrid'

function FeaturedMedicinesSection({
  medicines = [],
  loading = false,
  error = '',
}) {
  const { t } = useTranslation('home')

  return (
    <Container className="pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle
          eyebrow={t('featuredMedicines.eyebrow')}
          title={t('featuredMedicines.title')}
        />

        <Link
          to="/medicines"
          className="mb-6 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
        >
          {t('featuredMedicines.browseAll')}
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900 dark:shadow-slate-950/20"
            >
              <div className="h-44 animate-pulse bg-slate-100 dark:bg-slate-800" />

              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

                <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

                <div className="h-10 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? null : medicines.length === 0 ? (
        <EmptyState
          title={t('featuredMedicines.emptyTitle')}
          description={t('featuredMedicines.emptyDescription')}
        />
      ) : (
        <MedicineGrid medicines={medicines} />
      )}
    </Container>
  )
}

export default FeaturedMedicinesSection
