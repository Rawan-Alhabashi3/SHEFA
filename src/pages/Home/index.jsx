import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CategoriesSection from '../../components/ui/CategoriesSection'
import FeaturedMedicinesSection from '../../components/ui/FeaturedMedicinesSection'
import HeroSection from '../../components/ui/HeroSection'
import NearbyPharmaciesSection from '../../components/ui/NearbyPharmaciesSection'
import HomeRewardCampaignsSection from '../../components/ui/HomeRewardCampaignsSection'
import SearchSection from '../../components/ui/SearchSection'
import StatisticsSection from '../../components/ui/StatisticsSection'
import TestimonialsSection from '../../components/ui/TestimonialsSection'
import ServicesSection from '../../components/services/ServicesSection'
import { getHomeOverview } from '../../services/homeService'

function HomePage() {
  const { t } = useTranslation('home')
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')

    getHomeOverview()
      .then((response) => {
        if (!mounted) return
        setHomeData(response?.data || {})
      })
      .catch((err) => {
        if (!mounted) return
        setError(err?.response?.data?.message || true)
        setHomeData(null)
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      <HeroSection stats={homeData?.stats} />
      <SearchSection />
      {error ? (
        <div className="mx-auto mt-8 max-w-7xl px-4">
          <div className="rounded-2xl border border-rose-100 bg-rose-50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-200">
            {error === true ? t('page.loadError') : error}
          </div>
        </div>
      ) : null}
      <CategoriesSection categories={homeData?.categories || []} loading={loading} />
      <FeaturedMedicinesSection medicines={homeData?.medicines || []} loading={loading} error={error} />
      <NearbyPharmaciesSection pharmacies={homeData?.pharmacies || []} loading={loading} error={error} />
      <ServicesSection />
      <HomeRewardCampaignsSection campaigns={homeData?.reward_campaigns || []} communityListings={homeData?.community_listings || []} loading={loading} />
      <TestimonialsSection testimonials={homeData?.testimonials || []} loading={loading} />
      <StatisticsSection stats={homeData?.stats} loading={loading} />
    </>
  )
}

export default HomePage
