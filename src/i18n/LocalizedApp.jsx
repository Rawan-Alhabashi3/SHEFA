import { useEffect } from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import i18n, { applyDocumentLanguage, getDirection } from './index'

function DirectionBoundary({ children }) {
  const { i18n: instance } = useTranslation()
  const language = instance.resolvedLanguage || instance.language

  useEffect(() => {
    applyDocumentLanguage(language)
  }, [language])

  return (
    <div dir={getDirection(language)} className="min-h-screen">
      {children}
    </div>
  )
}

function LocalizedApp({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <DirectionBoundary>{children}</DirectionBoundary>
    </I18nextProvider>
  )
}

export default LocalizedApp
