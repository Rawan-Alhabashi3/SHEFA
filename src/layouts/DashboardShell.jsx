import { Bell, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router-dom'
import { createPortal } from 'react-dom'
import DashboardSidebar from '../components/layout/DashboardSidebar'
import ThemeToggle from '../components/common/ThemeToggle'
import LanguageSwitcher from '../components/common/LanguageSwitcher'
import { useAuth } from '../context/AuthContext'
import {
  getPharmacyNotifications,
  getPharmacyUnreadNotificationsCount,
  markAllPharmacyNotificationsRead,
  markPharmacyNotificationRead,
  getDriverNotifications,
  getDriverUnreadNotificationsCount,
  markAllDriverNotificationsRead,
  markDriverNotificationRead,
} from '../services/notificationsService'

function DashboardShell({ title, links, translationNamespace = 'admin' }) {
  const { t } = useTranslation([translationNamespace, 'dashboard'])
  const { role } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
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

  useEffect(() => {
    if (!isPharmacy && !isDriver) {
      setNotificationOpen(false)
      setNotificationItems([])
      setNotificationError('')
      setUnreadCount(0)
      return () => {}
    }

    let mounted = true
    const loadUnread = async () => {
      try {
        const res = isPharmacy
          ? await getPharmacyUnreadNotificationsCount()
          : await getDriverUnreadNotificationsCount()
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
  }, [isPharmacy, isDriver])

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
      const res = isPharmacy
        ? await getPharmacyNotifications({ status: 'all', page: 1, per_page: 6 })
        : await getDriverNotifications({ status: 'all', page: 1, per_page: 6 })
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
      } else {
        await markDriverNotificationRead(id)
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
      } else {
        await markAllDriverNotificationsRead()
      }
    } catch {
      await loadNotifications()
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <DashboardSidebar title={title} links={links} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} translationNamespace={translationNamespace} />
      <div className="flex h-full min-w-0 flex-col md:ps-72">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label={t('shell.toggleSidebar', { ns: 'dashboard' })}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
          <div className="flex items-center gap-2">
            {(isPharmacy || isDriver) ? (
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
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {mobileOpen ? (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          aria-label={t('shell.closeOverlay', { ns: 'dashboard' })}
        />
      ) : null}
    </div>
  )
}

export default DashboardShell
