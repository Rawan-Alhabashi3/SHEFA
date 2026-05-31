import {
  ClipboardList,
  HandHeart,
  LayoutDashboard,
  PackageOpen,
  Star,
  Tag,
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardShell from './DashboardShell'

function PharmacyLayout() {
  const { t } = useTranslation('pharmacy')

  const links = useMemo(
    () => [
      {
        to: '/pharmacy/dashboard',
        labelKey: 'sidebar.overview',
        icon: LayoutDashboard,
      },
      {
        to: '/pharmacy/orders',
        labelKey: 'sidebar.orders',
        icon: ClipboardList,
      },
      {
        to: '/pharmacy/medicines',
        labelKey: 'sidebar.medicines',
        icon: PackageOpen,
      },
      {
        to: '/pharmacy/community-requests',
        labelKey: 'sidebar.communityRequests',
        icon: HandHeart,
      },
      {
        to: '/pharmacy/reviews',
        labelKey: 'sidebar.reviews',
        icon: Star,
      },
      {
        to: '/pharmacy/coupon-campaigns',
        labelKey: 'sidebar.couponCampaigns',
        icon: Tag,
      },
    ],
    [],
  )

  return (
    <DashboardShell
      title={t('dashboard.title')}
      links={links}
      translationNamespace="pharmacy"
    />
  )
}

export default PharmacyLayout