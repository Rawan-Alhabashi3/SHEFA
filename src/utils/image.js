const API_ORIGIN = (() => {
  const base = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  return base.replace(/\/api\/?$/, '')
})()

export const FALLBACK_PHARMACY_IMAGE = '/images/placeholders/pharmacy.svg'
export const FALLBACK_MEDICINE_IMAGE = '/images/placeholders/medicine.svg'

export function resolveImageUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  if (raw.startsWith('/storage/')) return `${API_ORIGIN}${raw}`
  if (raw.startsWith('storage/')) return `${API_ORIGIN}/${raw}`
  if (raw.startsWith('exchangeAds/')) return `${API_ORIGIN}/storage/${raw}`
  return raw.replace(/\\/g, '/')
}

export function withFallback(event, fallbackSrc) {
  const target = event.currentTarget
  if (!target || target.dataset.fallbackApplied === '1') return
  target.dataset.fallbackApplied = '1'
  target.src = fallbackSrc
}
