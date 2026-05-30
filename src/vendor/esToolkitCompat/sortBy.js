import { iterateeValue } from './shared'

export default function sortBy(collection, iteratee) {
  const list = Array.isArray(collection) ? [...collection] : []
  return list.sort((a, b) => {
    const left = iterateeValue(iteratee, a)
    const right = iterateeValue(iteratee, b)
    if (left == null && right == null) return 0
    if (left == null) return 1
    if (right == null) return -1
    if (left > right) return 1
    if (left < right) return -1
    return 0
  })
}
