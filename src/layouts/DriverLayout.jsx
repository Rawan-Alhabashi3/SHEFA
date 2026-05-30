import {
  Bell,
  ChartColumnBig,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  Route,
  Settings,
  Truck,
  UserCircle2,
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardShell from './DashboardShell'

function DriverLayout() {
  const { t } = useTranslation('driver')
  const links = useMemo(
    () => [
      { to: '/driver/dashboard', labelKey: 'overview', icon: LayoutDashboard },
      { to: '/driver/orders', labelKey: 'assignedMissions', icon: ClipboardList },
      { to: '/driver/active-deliveries', labelKey: 'activeMissions', icon: Truck },
      { to: '/driver/history', labelKey: 'missionHistory', icon: Route },
      { to: '/driver/earnings', labelKey: 'earnings.title', icon: DollarSign },
      { to: '/driver/analytics', labelKey: 'analytics.title', icon: ChartColumnBig },
      { to: '/driver/notifications', labelKey: 'notifications.title', icon: Bell },
      { to: '/driver/profile', labelKey: 'profile.title', icon: UserCircle2 },
      { to: '/driver/settings', labelKey: 'settings.title', icon: Settings },
    ],
    [],
  )

  return <DashboardShell title={t('dashboard.title')} links={links} translationNamespace="driver" />
}

export default DriverLayout
