import { iterateeValue } from './shared'

export default function sumBy(collection, iteratee) {
  return Array.isArray(collection)
    ? collection.reduce((total, item) => total + Number(iterateeValue(iteratee, item) || 0), 0)
    : 0
}
