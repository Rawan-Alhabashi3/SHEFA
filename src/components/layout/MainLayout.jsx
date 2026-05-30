import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'
import useScrollTop from '../../hooks/useScrollTop'
import { useAuth } from '../../context/AuthContext'
import useAppStore from '../../context/useAppStore'
import { getFavorites } from '../../services/favoritesService'
import Footer from './Footer'
import GlobalToastListener from './GlobalToastListener'
import Navbar from './Navbar'
import { useTheme } from '../../context/useTheme'

function MainLayout() {
  useScrollTop()
  const [toastPosition, setToastPosition] = useState('top-right')
  const { isAuthenticated, role } = useAuth()
  const { theme } = useTheme()
  const setFavorites = useAppStore((s) => s.setFavorites)
  const clearFavorites = useAppStore((s) => s.clearFavorites)

  useEffect(() => {
    const apply = () => setToastPosition(window.innerWidth < 640 ? 'top-center' : 'top-right')
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])

  useEffect(() => {
    let mounted = true

    if (!isAuthenticated || role !== 'citizen') {
      clearFavorites()
      return () => {
        mounted = false
      }
    }

    getFavorites()
      .then((res) => {
        if (!mounted) return
        const payload = res?.data || res
        const items = Array.isArray(payload?.data?.items)
          ? payload.data.items
          : Array.isArray(payload?.items)
            ? payload.items
            : []
        setFavorites(items)
      })
      .catch(() => {
        if (!mounted) return
        setFavorites([])
      })

    return () => {
      mounted = false
    }
  }, [isAuthenticated, role, setFavorites, clearFavorites])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <GlobalToastListener />
      <Toaster
        position={toastPosition}
        theme={theme}
        richColors
        closeButton
        toastOptions={{
          duration: 2200,
          style: { zIndex: 1000 },
        }}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
