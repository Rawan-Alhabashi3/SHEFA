import { MapPin, Search, Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../common/Container'
import Button from '../common/Button'
import healthcareHero from '../../assets/images/healthcare_hero.png'

function HeroSection({ stats }) {
  const { t } = useTranslation('home')
  const navigate = useNavigate()

  const cityCount = Number(stats?.total_pharmacies || 0)
  const deliveryCount = Number(stats?.successful_deliveries || 0)

  return (
    <section className="relative overflow-hidden py-16 md:py-24 text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${healthcareHero})` }}
      />

      {/* Blue Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/82 via-blue-600/55 to-sky-500/70" />

      {/* Subtle Radial Light Effects for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1)_0%,transparent_40%)]" />
      <Container className="relative z-10">
        <p className="mb-3 text-sm text-blue-100 md:text-base">
          {t('hero.eyebrow')}
        </p>

        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-4xl lg:text-6xl">
          {t('hero.title')}
        </h1>

        <p className="mt-4 max-w-xl text-sm text-blue-100 md:text-base">
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

        <div className="mt-6 flex max-w-xl overflow-hidden rounded-full border border-white/30 bg-white/95 p-1 text-slate-700 shadow-xl backdrop-blur-md dark:bg-slate-900/95 dark:text-slate-200 dark:shadow-slate-950/20">
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
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-md"
          >
            <Search size={16} />
            {t('hero.search')}
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-md shadow-lg backdrop-filter">
            <p className="text-xs text-blue-50">
              {t('hero.successfulDeliveries')}
            </p>

            <p className="flex items-center gap-1 font-semibold">
              <Truck size={14} />
              {deliveryCount.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-md shadow-lg backdrop-filter">
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