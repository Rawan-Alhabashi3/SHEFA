export default function last(array) {
  return Array.isArray(array) && array.length ? array[array.length - 1] : undefined
}
