import { Bell, LogOut, Store, UserCircle2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../common/ThemeToggle'
import LanguageSwitcher from '../common/LanguageSwitcher'
import {
  getPharmacyNotifications,
  getPharmacyUnreadNotificationsCount,
  markAllPharmacyNotificationsRead,
  markPharmacyNotificationRead,
  getDriverNotifications,
  getDriverUnreadNotificationsCount,
  markAllDriverNotificationsRead,
  markDriverNotificationRead,
  getAdminNotifications,
  getAdminUnreadNotificationsCount,
  markAllAdminNotificationsRead,
  markAdminNotificationRead,
} from '../../services/notificationsService'

const PROFILE_PLACEHOLDER_KEYS = {
  'Account User': 'user.accountUser',
  'Default Pharmacy': 'user.defaultPharmacy',
  'Healthcare Dashboard': 'user.healthcareDashboard',
  Pharmacy: 'role.pharmacy',
}

function DashboardSidebar({ title, links, mobileOpen = false, onClose = () => {}, translationNamespace = 'dashboard' }) {
  const { t } = useTranslation([translationNamespace, 'dashboard', 'common'])
  const navigate = useNavigate()
  const { user, role, logout } = useAuth()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationLoading, setNotificationLoading] = useState(false)
  const [notificationItems, setNotificationItems] = useState([])
  const [notificationError, setNotificationError] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const notificationRef = useRef(null)
  const buttonRef = useRef(null)
  const isPharmacy = role === 'pharmacy' || role === 'specialist'
  const isDriver = role === 'delivery'
  const isAdmin = role === 'admin'

  const translateProfileValue = (value, fallbackKey) => {
    const raw = String(value || '').trim()
    const key = PROFILE_PLACEHOLDER_KEYS[raw] || fallbackKey
    return key ? t(key, { ns: 'dashboard' }) : raw
  }

  const displayName = translateProfileValue(user?.name || user?.full_name, 'user.accountUser')
  const displayEmail = user?.email || t('user.noEmail', { ns: 'dashboard' })
  const pharmacyName = translateProfileValue(user?.pharmacy_name || user?.pharmacy?.name, 'user.defaultPharmacy')
  const pharmacyMeta = translateProfileValue(user?.pharmacy_phone || user?.pharmacy_address, 'user.healthcareDashboard')
  const normalizedRole = String(role || '').trim().toLowerCase()
  const roleLabel =
    normalizedRole && ['admin', 'pharmacy', 'specialist', 'delivery', 'citizen'].includes(normalizedRole)
      ? t(`roles.${normalizedRole}`, { ns: 'common' })
      : t('roles.teamMember', { ns: 'common' })

  const handleLogout = async () => {
    await logout()
    onClose()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    if (!isPharmacy && !isDriver && !isAdmin) {
      setNotificationOpen(false)
      setNotificationItems([])
      setNotificationError('')
      setUnreadCount(0)
      return () => {}
    }

    let mounted = true
    const loadUnread = async () => {
      try {
        let res
        if (isPharmacy) {
          res = await getPharmacyUnreadNotificationsCount()
        } else if (isDriver) {
          res = await getDriverUnreadNotificationsCount()
        } else if (isAdmin) {
          res = await getAdminUnreadNotificationsCount()
        }
        if (!mounted) return
        const payload = res?.data || {}
        setUnreadCount(Number(payload?.count || 0))
      } catch {
        if (!mounted) return
        setUnreadCount(0)
      }
    }

    loadUnread()
    const timer = window.setInterval(loadUnread, 30000)
    return () => {
      mounted = false
      window.clearInterval(timer)
    }
  }, [isPharmacy, isDriver, isAdmin])

  useEffect(() => {
    if (!notificationOpen) return () => {}
    const onClickOutside = (event) => {
      if (!notificationRef.current) return
      if (!notificationRef.current.contains(event.target)) {
        setNotificationOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [notificationOpen])

  useEffect(() => {
    if (!notificationOpen || !buttonRef.current) return

    const calculatePosition = () => {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const dropdownWidth = 380
      const margin = 12

      const top = buttonRect.bottom + 8
      const left = Math.max(margin, Math.min(buttonRect.left, viewportWidth - dropdownWidth - margin))

      setDropdownPosition({ top, left })
    }

    calculatePosition()
    window.addEventListener('resize', calculatePosition)
    return () => window.removeEventListener('resize', calculatePosition)
  }, [notificationOpen])

  const loadNotifications = async () => {
    setNotificationLoading(true)
    setNotificationError('')
    try {
      let res
      if (isPharmacy) {
        res = await getPharmacyNotifications({ status: 'all', page: 1, per_page: 6 })
      } else if (isDriver) {
        res = await getDriverNotifications({ status: 'all', page: 1, per_page: 6 })
      } else if (isAdmin) {
        res = await getAdminNotifications({ status: 'all', page: 1, per_page: 6 })
      }
      const payload = res?.data || res || {}
      const paginator = payload?.items || payload?.notifications || {}
      const items = Array.isArray(paginator?.data)
        ? paginator.data
        : Array.isArray(paginator)
          ? paginator
          : Array.isArray(payload?.data)
            ? payload.data
            : []
      setNotificationItems(items)
      setUnreadCount(Number(payload?.unread_count || 0))
    } catch (error) {
      setNotificationError(error?.response?.data?.message || t('unableLoadNotifications', { ns: 'navbar' }))
    } finally {
      setNotificationLoading(false)
    }
  }

  const onToggleNotifications = async () => {
    const next = !notificationOpen
    setNotificationOpen(next)
    if (next) {
      await loadNotifications()
    }
  }

  const onMarkSingleRead = async (id) => {
    setNotificationItems((prev) => prev.map((item) => (item.id === id ? { ...item, is_read: true } : item)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
    try {
      if (isPharmacy) {
        await markPharmacyNotificationRead(id)
      } else if (isDriver) {
        await markDriverNotificationRead(id)
      } else if (isAdmin) {
        await markAdminNotificationRead(id)
      }
    } catch {
      await loadNotifications()
    }
  }

  const onMarkAllRead = async () => {
    setNotificationItems((prev) => prev.map((item) => ({ ...item, is_read: true })))
    setUnreadCount(0)
    try {
      if (isPharmacy) {
        await markAllPharmacyNotificationsRead()
      } else if (isDriver) {
        await markAllDriverNotificationsRead()
      } else if (isAdmin) {
        await markAllAdminNotificationsRead()
      }
    } catch {
      await loadNotifications()
    }
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
        <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <img src="/images/logo_shifa.jpg" alt="Shifa Logo" className="h-8 w-auto" />
            <div className="hidden items-center gap-2 md:flex">
              {(isPharmacy || isDriver || isAdmin) ? (
                <div className="relative" ref={notificationRef}>
                  <button
                    ref={buttonRef}
                    type="button"
                    onClick={onToggleNotifications}
                    className="relative rounded-full p-1 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                    aria-label={t('aria.notifications', { ns: 'navbar' })}
                  >
                    <Bell size={18} />
                    {unreadCount > 0 ? (
                      <span className="absolute -end-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    ) : null}
                  </button>

                  {notificationOpen ? createPortal(
                    <div
                      ref={notificationRef}
                      className="fixed z-[60] w-[min(380px,calc(100vw-24px))] max-h-[calc(100vh-120px)] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40 overflow-hidden flex flex-col"
                      style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                    >
                      <div className="mb-3 flex items-center justify-between gap-2 shrink-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{t('notificationsTitle', { ns: 'navbar' })}</p>
                        <button
                          type="button"
                          onClick={onMarkAllRead}
                          className="shrink-0 text-xs font-semibold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:text-blue-200"
                          disabled={unreadCount <= 0}
                        >
                          {t('markAllRead', { ns: 'navbar' })}
                        </button>
                      </div>

                      {notificationLoading ? (
                        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400 shrink-0">{t('loadingNotifications', { ns: 'navbar' })}</div>
                      ) : notificationError ? (
                        <div className="rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-200 break-words shrink-0">{notificationError}</div>
                      ) : notificationItems.length === 0 ? (
                        <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400 shrink-0">{t('noNotifications', { ns: 'navbar' })}</div>
                      ) : (
                        <div className="flex-1 overflow-y-auto space-y-2">
                          {notificationItems.map((item) => (
                            <div
                              key={item.id}
                              className={`rounded-xl border p-2.5 ${item.is_read ? 'border-slate-200 dark:border-slate-700' : 'border-blue-200 bg-blue-50/40 dark:border-blue-500/40 dark:bg-blue-950/30'}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="break-words text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                                  <p className="mt-1 break-words text-xs text-slate-600 dark:text-slate-300">{item.message}</p>
                                  <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
                                </div>
                                {!item.is_read ? (
                                  <button
                                    type="button"
                                    onClick={() => onMarkSingleRead(item.id)}
                                    className="shrink-0 rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-200 dark:hover:bg-blue-950"
                                  >
                                    {t('read', { ns: 'navbar' })}
                                  </button>
                                ) : null}
                              </div>
                              {item.action_url ? (
                                <Link
                                  to={item.action_url}
                                  onClick={() => setNotificationOpen(false)}
                                  className="mt-2 inline-flex text-[11px] font-semibold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:text-blue-200"
                                >
                                  {t('open', { ns: 'navbar' })}
                                </Link>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>,
                    document.body
                  ) : null}
                </div>
              ) : null}
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
                <span className="truncate">{link.labelKey ? t(link.labelKey, { ns: translationNamespace }) : link.label}</span>
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
            {t('logout', { ns: 'dashboard' })}
          </button>
        </div>
      </div>
    </aside>
  )
}

export default DashboardSidebar
