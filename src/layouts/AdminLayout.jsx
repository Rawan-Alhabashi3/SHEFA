import {
  Bell,
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  PackageOpen,
  Pill,
  ReceiptText,
  Star,
  Tags,
  Truck,
  Users,
  Route,
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardShell from './DashboardShell'

function AdminLayout() {
  const { t } = useTranslation('admin')
  const links = useMemo(
    () => [
      { to: '/admin/dashboard', labelKey: 'sidebar.overview', icon: LayoutDashboard },
      { to: '/admin/users', labelKey: 'sidebar.users', icon: Users },
      { to: '/admin/medicines', labelKey: 'sidebar.medicines', icon: Pill },
      { to: '/admin/orders', labelKey: 'sidebar.orders', icon: ClipboardList },
      { to: '/admin/delivery-missions', labelKey: 'sidebar.deliveryMissions', icon: Route },
      { to: '/admin/pharmacies', labelKey: 'sidebar.pharmacies', icon: Building2 },
      { to: '/admin/drivers', labelKey: 'sidebar.drivers', icon: Truck },
      { to: '/admin/coupon-campaigns', labelKey: 'sidebar.couponCampaigns', icon: Tags },
      { to: '/admin/payments', labelKey: 'sidebar.payments', icon: CreditCard },
      { to: '/admin/notifications', labelKey: 'sidebar.notifications', icon: Bell },
      { to: '/admin/reviews', labelKey: 'sidebar.reviews', icon: Star },
      { to: '/admin/exchange-ads', labelKey: 'sidebar.exchangeAds', icon: Megaphone },
      { to: '/admin/exchange-requests', labelKey: 'sidebar.exchangeRequests', icon: ClipboardList },
      { to: '/admin/coupons', labelKey: 'sidebar.coupons', icon: Tags },
      { to: '/admin/categories', labelKey: 'sidebar.categories', icon: PackageOpen },
      { to: '/admin/reports', labelKey: 'sidebar.reports', icon: ReceiptText },
    ],
    [],
  )

  return <DashboardShell title={t('dashboard.title')} links={links} translationNamespace="admin" />
}

export default AdminLayout
