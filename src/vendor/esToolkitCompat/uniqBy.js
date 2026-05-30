import { iterateeValue } from './shared'

export default function uniqBy(collection, iteratee) {
  const seen = new Set()
  return Array.isArray(collection)
    ? collection.filter((item) => {
        const key = iterateeValue(iteratee, item)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    : []
}
