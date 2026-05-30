export function getValue(item, path, fallback) {
  if (item == null) return fallback
  if (Array.isArray(path)) {
    return path.reduce((value, key) => value?.[key], item) ?? fallback
  }
  if (typeof path !== 'string') return item ?? fallback
  return path.split('.').reduce((value, key) => value?.[key], item) ?? fallback
}

export function iterateeValue(iteratee, item) {
  return typeof iteratee === 'function' ? iteratee(item) : getValue(item, iteratee)
}
