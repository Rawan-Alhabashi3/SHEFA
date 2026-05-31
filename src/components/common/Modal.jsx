import { useTranslation } from 'react-i18next'

function Modal({ title, children, onClose, className = '', bodyClassName = '' }) {
  const { t } = useTranslation('common')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-slate-950/70">
      <div className={`w-full max-w-lg rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-slate-900 dark:text-slate-100 shadow-2xl dark:shadow-slate-950/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button type="button" className="text-sm font-semibold text-slate-500 dark:text-slate-400 transition hover:text-slate-900 dark:text-slate-100 dark:hover:text-slate-100" onClick={onClose}>
            {t('ui.close')}
          </button>
        </div>
        <div className={bodyClassName}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
