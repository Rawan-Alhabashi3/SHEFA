import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getLanguage } from '../../i18n'

function LanguageSwitcher({ compact = false, className = '' }) {
  const { t, i18n } = useTranslation('common')
  const language = getLanguage()
  const nextLanguage = language === 'ar' ? 'en' : 'ar'
  const label = language === 'ar' ? t('language.english') : t('language.arabic')

  const changeLanguage = () => {
    i18n.changeLanguage(nextLanguage)
  }

  return (
    <button
      type="button"
      onClick={changeLanguage}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/40 dark:hover:bg-blue-950/40 dark:hover:text-blue-200 ${className}`}
      aria-label={nextLanguage === 'ar' ? t('language.switchToArabic') : t('language.switchToEnglish')}
      title={t('language.label')}
    >
      <Languages size={15} />
      {compact ? <span>{nextLanguage.toUpperCase()}</span> : <span>{label}</span>}
    </button>
  )
}

export default LanguageSwitcher
