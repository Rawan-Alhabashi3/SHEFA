import { iterateeValue } from './shared'

export default function minBy(collection, iteratee) {
  if (!Array.isArray(collection) || collection.length === 0) return undefined
  return collection.reduce((best, item) => (iterateeValue(iteratee, item) < iterateeValue(iteratee, best) ? item : best))
}
