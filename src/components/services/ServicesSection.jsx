import { useTranslation } from 'react-i18next'

import { services } from '../../data/services'

import Container from '../common/Container'
import SectionTitle from '../common/SectionTitle'

function ServicesSection() {
  const { t } = useTranslation('home')

  return (
    <Container className="pb-16">
      <SectionTitle title={t('services.title')} />

      <div className="grid gap-4 md:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon

          return (
            <article
              key={service.id}
              className="card-lift rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900 dark:shadow-slate-950/20"
            >
              <Icon className="text-blue-600 dark:text-blue-300" />

              <h3 className="mt-3 font-semibold">
                {t(`services.items.${service.id}.title`)}
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {t(`services.items.${service.id}.description`)}
              </p>
            </article>
          )
        })}
      </div>
    </Container>
  )
}

export default ServicesSection