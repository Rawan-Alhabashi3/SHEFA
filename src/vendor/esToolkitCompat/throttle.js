export default function throttle(callback, delay = 0) {
  let timeout = null
  let lastArgs = null

  return function throttled(...args) {
    lastArgs = args
    if (timeout) return

    timeout = window.setTimeout(() => {
      timeout = null
      callback(...lastArgs)
    }, delay)
  }
}
