import { ClipboardList, HandHeart, LayoutDashboard, PackageOpen, Star, Tag } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardShell from './DashboardShell'

function PharmacyLayout() {
  const { t } = useTranslation('pharmacy')
  const links = useMemo(
    () => [
      { to: '/pharmacy/dashboard', labelKey: 'pharmacy.overview', icon: LayoutDashboard },
      { to: '/pharmacy/orders', labelKey: 'pharmacy.orders', icon: ClipboardList },
      { to: '/pharmacy/medicines', labelKey: 'pharmacy.medicines', icon: PackageOpen },
      { to: '/pharmacy/community-requests', labelKey: 'pharmacy.communityRequests', icon: HandHeart },
      { to: '/pharmacy/reviews', labelKey: 'pharmacy.reviews', icon: Star },
      { to: '/pharmacy/coupon-campaigns', labelKey: 'pharmacy.couponCampaigns', icon: Tag },
    ],
    [],
  )

  return <DashboardShell title={t('dashboard.title')} links={links} translationNamespace="pharmacy" />
}

export default PharmacyLayout
