import { useTranslation } from 'react-i18next'

function Modal({ title, children, onClose, isOpen, className = '', bodyClassName = '', size = 'default' }) {
  const { t } = useTranslation('common')

  if (!isOpen) return null

  const sizeClasses = {
    default: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-slate-950/70" onClick={onClose}>
      <div 
        className={`w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl dark:shadow-slate-950/50 transition-colors duration-300 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button type="button" className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>
        <div className={`flex-1 overflow-y-auto px-6 py-4 ${bodyClassName}`}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
