import { ClipboardList, HandHeart, LayoutDashboard, PackageOpen, Star, Tag } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardShell from './DashboardShell'

function PharmacyLayout() {
  const { t } = useTranslation('pharmacy')
  const links = useMemo(
    () => [
      { to: '/pharmacy/dashboard', labelKey: 'overview', icon: LayoutDashboard },
      { to: '/pharmacy/orders', labelKey: 'orders.title', icon: ClipboardList },
      { to: '/pharmacy/medicines', labelKey: 'medicines.title', icon: PackageOpen },
      { to: '/pharmacy/community-requests', labelKey: 'communityRequests', icon: HandHeart },
      { to: '/pharmacy/reviews', labelKey: 'reviews.title', icon: Star },
      { to: '/pharmacy/coupon-campaigns', labelKey: 'couponCampaigns', icon: Tag },
    ],
    [],
  )

  return <DashboardShell title={t('dashboard.title')} links={links} translationNamespace="pharmacy" />
}

export default PharmacyLayout
