import { getValue } from './shared'

export default function get(item, path, fallback) {
  return getValue(item, path, fallback)
}
