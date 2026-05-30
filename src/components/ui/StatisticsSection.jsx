import { useTranslation } from 'react-i18next'
import { Pill, Store, Truck, Users } from 'lucide-react'

import Container from '../common/Container'

function StatisticsSection({
  stats = {},
  loading = false,
}) {
  const { t } = useTranslation('home')

  const statConfig = [
    {
      key: 'total_pharmacies',
      label: t('statistics.verifiedPharmacies'),
      icon: Store,
    },
    {
      key: 'medicines_count',
      label: t('statistics.medicinesAvailable'),
      icon: Pill,
    },
    {
      key: 'active_users',
      label: t('statistics.activeUsers'),
      icon: Users,
    },
    {
      key: 'successful_deliveries',
      label: t('statistics.successfulDeliveries'),
      icon: Truck,
    },
  ]

  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-500 py-12 text-white">
      <Container className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {statConfig.map((stat) => {
          const Icon = stat.icon

          return (
            <article
              key={stat.key}
              className="rounded-xl border border-white/15 bg-white/10 p-5 text-center text-white backdrop-blur"
            >
              <Icon className="mx-auto" />

              <p className="mt-2 text-3xl font-bold">
                {loading
                  ? t('statistics.loadingValue')
                  : Number(
                    stats?.[stat.key] || 0
                  ).toLocaleString()}
              </p>

              <p className="text-sm text-blue-50">
                {stat.label}
              </p>
            </article>
          )
        })}
      </Container>
    </section>
  )
}

export default StatisticsSection
