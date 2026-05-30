import { Bell, ClipboardList, Heart, Menu, Search, ShoppingCart, Tag, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Link } from 'react-router-dom'
import { NAV_LINKS } from '../../constants/siteConfig'
import Container from '../common/Container'
import Button from '../common/Button'
import ThemeToggle from '../common/ThemeToggle'
import LanguageSwitcher from '../common/LanguageSwitcher'
import { useAuth } from '../../context/AuthContext'
import useAppStore from '../../context/useAppStore'
import {
  getMyNotifications,
  getMyUnreadNotificationsCount,
  markAllMyNotificationsRead,
  markMyNotificationRead,
} from '../../services/notificationsService'

function Navbar() {
  const { t } = useTranslation('navbar')
  const [open, setOpen] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationLoading, setNotificationLoading] = useState(false)
  const [notificationItems, setNotificationItems] = useState([])
  const [notificationError, setNotificationError] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const { isAuthenticated, role, logout } = useAuth()
  const notificationRef = useRef(null)
  const count = useAppStore((s) => s.cart.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0))
  const favoritesCount = useAppStore((s) => s.favorites.length)
  const isCustomer = isAuthenticated && role === 'citizen'

  useEffect(() => {
    if (count <= 0) return
    setPulse(true)
    const pulseTimer = window.setTimeout(() => setPulse(false), 300)
    return () => window.clearTimeout(pulseTimer)
  }, [count])

  useEffect(() => {
    if (!isCustomer) {
      setNotificationOpen(false)
      setNotificationItems([])
      setNotificationError('')
      setUnreadCount(0)
      return () => {}
    }

    let mounted = true
    const loadUnread = async () => {
      try {
        const res = await getMyUnreadNotificationsCount()
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
  }, [isCustomer])

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

  const loadNotifications = async () => {
    setNotificationLoading(true)
    setNotificationError('')
    try {
      const res = await getMyNotifications({ status: 'all', page: 1, per_page: 6 })
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
      setNotificationError(error?.response?.data?.message || t('unableLoadNotifications'))
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
      await markMyNotificationRead(id)
    } catch {
      await loadNotifications()
    }
  }

  const onMarkAllRead = async () => {
    setNotificationItems((prev) => prev.map((item) => ({ ...item, is_read: true })))
    setUnreadCount(0)
    try {
      await markAllMyNotificationsRead()
    } catch {
      await loadNotifications()
    }
  }

  const dashboardPath =
    role === 'admin'
      ? '/admin/dashboard'
      : role === 'delivery'
        ? '/driver/dashboard'
        : role === 'pharmacy' || role === 'specialist'
          ? '/pharmacy/dashboard'
          : '/'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/90">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-extrabold text-blue-600 dark:text-blue-300">{t('brand')}</Link>
        <nav className="hidden gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-blue-600 dark:text-blue-300' : 'text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300'}`}>
              {t(l.labelKey)}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Search size={18} className="cursor-pointer text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300" aria-hidden />
          <ThemeToggle />
          <LanguageSwitcher compact />
          {isCustomer ? (
            <NavLink to="/my-coupons" className="rounded-full p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={t('aria.myCoupons')}>
              {({ isActive }) => (
                <Tag size={18} className={isActive ? 'text-blue-600 dark:text-blue-300' : 'text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300'} />
              )}
            </NavLink>
          ) : null}
          {isCustomer ? (
            <NavLink to="/orders" className="rounded-full p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={t('aria.myOrders')}>
              {({ isActive }) => (
                <ClipboardList size={18} className={isActive ? 'text-blue-600 dark:text-blue-300' : 'text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300'} />
              )}
            </NavLink>
          ) : null}
          {isCustomer ? (
            <NavLink to="/favorites" className="relative rounded-full p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={t('aria.favorites')}>
              {({ isActive }) => (
                <>
                  <Heart size={18} className={isActive ? 'fill-rose-500 text-rose-500' : 'text-slate-600 hover:text-rose-500 dark:text-slate-300 dark:hover:text-rose-300'} />
                  {favoritesCount > 0 ? (
                    <span className="absolute -end-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                      {favoritesCount}
                    </span>
                  ) : null}
                </>
              )}
            </NavLink>
          ) : null}
          <Link to="/cart" className="relative">
            <ShoppingCart size={18} className="cursor-pointer text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300" />
            {count > 0 ? (
              <span className={`absolute -end-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white transition-transform ${pulse ? 'scale-110' : 'scale-100'}`}>
                {count}
              </span>
            ) : null}
          </Link>
          {isCustomer ? (
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={onToggleNotifications}
                className="relative rounded-full p-1 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                aria-label={t('aria.notifications')}
              >
                <Bell size={18} />
                {unreadCount > 0 ? (
                  <span className="absolute -end-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                ) : null}
              </button>

              {notificationOpen ? (
                <div className="absolute end-0 top-11 z-50 w-[360px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('notificationsTitle')}</p>
                    <button
                      type="button"
                      onClick={onMarkAllRead}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:text-blue-200"
                      disabled={unreadCount <= 0}
                    >
                      {t('markAllRead')}
                    </button>
                  </div>

                  {notificationLoading ? (
                    <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">{t('loadingNotifications')}</div>
                  ) : notificationError ? (
                    <div className="rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-200">{notificationError}</div>
                  ) : notificationItems.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">{t('noNotifications')}</div>
                  ) : (
                    <div className="max-h-[360px] space-y-2 overflow-auto">
                      {notificationItems.map((item) => (
                        <div
                          key={item.id}
                          className={`rounded-xl border p-2.5 ${item.is_read ? 'border-slate-200 dark:border-slate-700' : 'border-blue-200 bg-blue-50/40 dark:border-blue-500/40 dark:bg-blue-950/30'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                              <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">{item.message}</p>
                              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
                            </div>
                            {!item.is_read ? (
                              <button
                                type="button"
                                onClick={() => onMarkSingleRead(item.id)}
                                className="shrink-0 rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-200 dark:hover:bg-blue-950"
                              >
                                {t('read')}
                              </button>
                            ) : null}
                          </div>
                          {item.action_url ? (
                            <Link
                              to={item.action_url}
                              onClick={() => setNotificationOpen(false)}
                              className="mt-2 inline-flex text-[11px] font-semibold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:text-blue-200"
                            >
                              {t('open')}
                            </Link>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    to="/notifications"
                    onClick={() => setNotificationOpen(false)}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {t('viewAllNotifications')}
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath}><Button variant="secondary">{t('dashboard')}</Button></Link>
              <Button onClick={logout}>{t('logout')}</Button>
            </>
          ) : (
            <Link to="/login"><Button>{t('login')}</Button></Link>
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LanguageSwitcher compact />
          <button className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" onClick={() => setOpen((v) => !v)}>{open ? <X /> : <Menu />}</button>
        </div>
      </Container>
      {open && (
        <div className="border-t border-slate-200 bg-white p-4 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 md:hidden">
          <div className="flex flex-col gap-3">
            <div className="pb-1">
              <LanguageSwitcher />
            </div>
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>
                {t(l.labelKey)}
              </NavLink>
            ))}
            {isCustomer ? (
              <NavLink to="/my-coupons" onClick={() => setOpen(false)}>
                {t('myCoupons')}
              </NavLink>
            ) : null}
            {isCustomer ? (
              <NavLink to="/orders" onClick={() => setOpen(false)}>
                {t('myOrders')}
              </NavLink>
            ) : null}
            {isCustomer ? (
              <NavLink to="/favorites" onClick={() => setOpen(false)} className="flex items-center justify-between">
                <span>{t('favorites')}</span>
                {favoritesCount > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                    {favoritesCount}
                  </span>
                ) : null}
              </NavLink>
            ) : null}
            {isCustomer ? (
              <NavLink to="/notifications" onClick={() => setOpen(false)} className="flex items-center justify-between">
                <span>{t('notifications')}</span>
                {unreadCount > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                ) : null}
              </NavLink>
            ) : null}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
