import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import DashboardSidebar from '../components/layout/DashboardSidebar'
import ThemeToggle from '../components/common/ThemeToggle'
import LanguageSwitcher from '../components/common/LanguageSwitcher'

function DashboardShell({ title, links, translationNamespace = 'admin' }) {
  const { t } = useTranslation([translationNamespace, 'dashboard'])
  const [mobileOpen, setMobileOpen] = useState(false)

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
