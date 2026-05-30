import { useTranslation } from 'react-i18next'
import {
  Activity,
  Baby,
  Droplets,
  HeartPulse,
  Pill,
  ShieldPlus,
  Stethoscope,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import Container from '../common/Container'
import SectionTitle from '../common/SectionTitle'

const categoryIcons = [
  Pill,
  HeartPulse,
  Baby,
  Activity,
  Droplets,
  ShieldPlus,
  Stethoscope,
]

function CategoriesSection({
  categories = [],
  loading = false,
}) {
  const { t } = useTranslation('home')

  return (
    <Container className="py-16">
      <SectionTitle title={t('categories.title')} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {loading
          ? Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-white shadow-sm dark:bg-slate-900 dark:shadow-slate-950/20"
            />
          ))
          : null}

        {!loading &&
          categories.map((category, index) => {
            const Icon =
              categoryIcons[index % categoryIcons.length]

            return (
              <Link
                key={category.id || category.name}
                to={`/medicines?category=${encodeURIComponent(
                  category.name
                )}`}
                className="card-lift rounded-xl bg-white p-4 text-center shadow-sm dark:bg-slate-900 dark:shadow-slate-950/20"
              >
                <Icon
                  className="mx-auto text-blue-600 dark:text-blue-300"
                  size={20}
                />

                <p className="mt-2 text-sm font-medium">
                  {category.name}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t('categories.itemCount', {
                    count: category.medicines_count || 0,
                  })}
                </p>
              </Link>
            )
          })}
      </div>

      {!loading && categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          {t('categories.empty')}
        </div>
      ) : null}
    </Container>
  )
}

export default CategoriesSection
