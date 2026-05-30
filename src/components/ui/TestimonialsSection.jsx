import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'

import Container from '../common/Container'
import SectionTitle from '../common/SectionTitle'

function TestimonialsSection({
  testimonials = [],
  loading = false,
}) {
  const { t } = useTranslation('home')

  return (
    <Container className="pb-16">
      <SectionTitle
        title={t('testimonials.title')}
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-900 dark:shadow-slate-950/20"
              />
            )
          )}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          {t('testimonials.empty')}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials
            .slice(0, 3)
            .map((item) => (
              <article
                key={item.id}
                className="card-lift rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900 dark:shadow-slate-950/20"
              >
                <div className="mb-2 flex gap-1">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <Star
                      key={index}
                      size={14}
                      className={
                        index <
                          Number(item.rating || 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }
                    />
                  ))}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item.message}
                </p>

                <div className="mt-4">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {item.name}
                  </p>

                  {item.pharmacy_name ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.pharmacy_name}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
        </div>
      )}
    </Container>
  )
}

export default TestimonialsSection
