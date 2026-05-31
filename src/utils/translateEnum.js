/**
 * Translate machine-safe enum values from API/DB using i18next.
 * Never use for user-generated content (names, descriptions, addresses, etc.).
 */
export function normalizeEnumKey(value) {
  return String(value ?? '').trim().toLowerCase()
}

export function translateEnum(t, value, { ns = 'common', labelKey = 'statusLabels', fallback } = {}) {
  const key = normalizeEnumKey(value)
  if (!key) return fallback ?? '-'
  const i18nKey = `${labelKey}.${key}`
  const translated = t(i18nKey, { ns, defaultValue: '__MISSING__' })
  if (translated !== '__MISSING__') return translated
  return fallback ?? String(value).replace(/[_-]+/g, ' ')
}
