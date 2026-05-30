import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Container from '../common/Container'
import EmptyState from '../common/EmptyState'
import SectionTitle from '../common/SectionTitle'
import PharmacyGrid from '../pharmacies/PharmacyGrid'

function NearbyPharmaciesSection({
  pharmacies = [],
  loading = false,
  error = '',
}) {
  const { t } = useTranslation('home')

  return (
    <Container className="pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle title={t('nearbyPharmacies.title')} />

        <Link
          to="/pharmacies"
          className="mb-6 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
        >
          {t('nearbyPharmacies.viewAll')}
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-900 dark:shadow-slate-950/20"
            />
          ))}
        </div>
      ) : error ? null : pharmacies.length === 0 ? (
        <EmptyState
          title={t('nearbyPharmacies.emptyTitle')}
          description={t('nearbyPharmacies.emptyDescription')}
        />
      ) : (
        <PharmacyGrid pharmacies={pharmacies} />
      )}
    </Container>
  )
}

export default NearbyPharmaciesSection
