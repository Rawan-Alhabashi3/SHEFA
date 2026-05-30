import { MapPin, Search, Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../common/Container'
import Button from '../common/Button'

function HeroSection({ stats }) {
  const { t } = useTranslation('home')
  const navigate = useNavigate()

  const cityCount = Number(stats?.total_pharmacies || 0)
  const deliveryCount = Number(stats?.successful_deliveries || 0)

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 py-24 text-white">
      <Container className="relative z-10">
        <p className="mb-3 text-sm text-blue-100">
          {t('hero.eyebrow')}
        </p>

        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">
          {t('hero.title')}
        </h1>

        <p className="mt-4 max-w-xl text-blue-100">
          {t('hero.body')}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/medicines">
            <Button variant="secondary">
              {t('hero.browseMedicines')}
            </Button>
          </Link>

          <Link to="/pharmacies">
            <Button variant="light">
              {t('hero.viewPharmacies')}
            </Button>
          </Link>

          <Link to="/marketplace">
            <Button variant="light">
              {t('hero.exploreMarketplace')}
            </Button>
          </Link>

          <Link to="/community-medicines">
            <Button variant="light">
              {t('hero.donationResale')}
            </Button>
          </Link>
        </div>

        <div className="mt-6 flex max-w-xl overflow-hidden rounded-full border border-white/20 bg-white p-1 text-slate-700 shadow-sm dark:bg-slate-900/95 dark:text-slate-200 dark:shadow-slate-950/20">
          <input
            className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm outline-none"
            placeholder={t('hero.searchPlaceholder')}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                event.currentTarget.value.trim()
              ) {
                navigate(
                  `/medicines?search=${encodeURIComponent(
                    event.currentTarget.value.trim()
                  )}`
                )
              }
            }}
          />

          <button
            type="button"
            onClick={(event) => {
              const input =
                event.currentTarget.parentElement?.querySelector('input')

              const value = input?.value?.trim()

              if (value) {
                navigate(
                  `/medicines?search=${encodeURIComponent(value)}`
                )
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Search size={16} />
            {t('hero.search')}
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur">
            <p className="text-xs text-blue-50">
              {t('hero.successfulDeliveries')}
            </p>

            <p className="flex items-center gap-1 font-semibold">
              <Truck size={14} />
              {deliveryCount.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur">
            <p className="text-xs text-blue-50">
              {t('hero.verifiedPharmacies')}
            </p>

            <p className="flex items-center gap-1 font-semibold">
              <MapPin size={14} />
              {cityCount.toLocaleString()}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default HeroSection