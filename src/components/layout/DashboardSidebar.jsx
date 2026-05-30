import { LogOut, Store, UserCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../common/ThemeToggle'
import LanguageSwitcher from '../common/LanguageSwitcher'

function DashboardSidebar({ title, links, mobileOpen = false, onClose = () => {}, translationNamespace = 'dashboard' }) {
  const { t } = useTranslation(translationNamespace)
  const navigate = useNavigate()
  const { user, role, logout } = useAuth()

  const displayName = user?.name || user?.full_name || t('user.accountUser')
  const displayEmail = user?.email || t('user.noEmail')
  const pharmacyName = user?.pharmacy_name || user?.pharmacy?.name || t('user.defaultPharmacy')
  const pharmacyMeta = user?.pharmacy_phone || user?.pharmacy_address || t('user.healthcareDashboard')
  const roleLabel =
    role && ['admin', 'pharmacy', 'specialist', 'delivery'].includes(role) ? t(`role.${role}`) : t('role.teamMember')

  const handleLogout = async () => {
    await logout()
    onClose()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={`fixed inset-y-0 z-40 w-72 border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40 start-0 border-e md:shadow-none ${
        mobileOpen
          ? 'translate-x-0 ltr:translate-x-0 rtl:translate-x-0'
          : '-translate-x-full ltr:-translate-x-full rtl:translate-x-full md:translate-x-0 ltr:md:translate-x-0 rtl:md:translate-x-0'
      }`}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-5 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{t('brandShort')}</p>
              <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-300">{title}</p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <LanguageSwitcher compact />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100 dark:bg-blue-950/40 dark:text-blue-200 dark:shadow-slate-950/20 dark:ring-blue-950'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  }`
                }
              >
                {Icon ? <Icon size={17} className="shrink-0" /> : null}
                <span className="truncate">{link.labelKey ? t(link.labelKey) : link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/60">
            <div className="flex items-start gap-2">
              <UserCircle2 size={18} className="mt-0.5 shrink-0 text-slate-500 dark:text-slate-400" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{displayName}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{displayEmail}</p>
              </div>
            </div>
            <span className="mt-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
              {roleLabel}
            </span>
            <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
              <div className="flex items-start gap-2">
                <Store size={16} className="mt-0.5 shrink-0 text-slate-500 dark:text-slate-400" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{pharmacyName}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{pharmacyMeta}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-rose-500/40 dark:hover:bg-rose-950/40 dark:hover:text-rose-200"
          >
            <LogOut size={16} />
            {t('logout')}
          </button>
        </div>
      </div>
    </aside>
  )
}

export default DashboardSidebar
