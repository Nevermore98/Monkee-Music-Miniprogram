export default function debounce(fn, delay = 500) {
  let timer = null
  return function (...args) {
    return new Promise((resolve, reject) => {
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        resolve(fn.apply(this, args))
        timer = null
      }, delay)
    })
  }
}
