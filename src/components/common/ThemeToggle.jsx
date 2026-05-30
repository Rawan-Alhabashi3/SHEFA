import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/useTheme'

function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/60 dark:hover:bg-blue-950/50 dark:hover:text-blue-200 dark:focus:ring-blue-900/50 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="relative block h-5 w-5">
        <Sun
          size={20}
          className={`absolute inset-0 transition-all duration-300 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
        />
        <Moon
          size={20}
          className={`absolute inset-0 transition-all duration-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
        />
      </span>
    </button>
  )
}

export default ThemeToggle
