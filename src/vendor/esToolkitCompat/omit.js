export default function omit(object, keys = []) {
  const omitted = new Set(keys)
  return Object.fromEntries(Object.entries(object || {}).filter(([key]) => !omitted.has(key)))
}
