import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import resources, { namespaces } from './resources'

export const LANGUAGE_STORAGE_KEY = 'shifa_language'
export const DEFAULT_LANGUAGE = 'ar'
export const FALLBACK_LANGUAGE = 'en'
export const SUPPORTED_LANGUAGES = ['ar', 'en']

const normalizeLanguage = (language) => {
  const code = String(language || '').toLowerCase().split('-')[0]
  return SUPPORTED_LANGUAGES.includes(code) ? code : DEFAULT_LANGUAGE
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: namespaces,
    defaultNS: 'common',
    lng: normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY)),
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
    parseMissingKeyHandler: (key) => {
      const parts = key.split('.')
      const last = parts[parts.length - 1]
      return last.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())
    },
  })

export const getLanguage = () => normalizeLanguage(i18n.resolvedLanguage || i18n.language)
export const isRtlLanguage = (language = getLanguage()) => normalizeLanguage(language) === 'ar'
export const getDirection = (language = getLanguage()) => (isRtlLanguage(language) ? 'rtl' : 'ltr')

export const applyDocumentLanguage = (language = getLanguage()) => {
  const normalized = normalizeLanguage(language)
  document.documentElement.lang = normalized
  document.documentElement.dir = getDirection(normalized)
  document.documentElement.dataset.language = normalized
}

i18n.on('languageChanged', (language) => {
  const normalized = normalizeLanguage(language)
  localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized)
  applyDocumentLanguage(normalized)
})

applyDocumentLanguage(getLanguage())

export default i18n
