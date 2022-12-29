export default function throttle(fn, delay = 500) {
  let timer = null
  return function (...args) {
    return new Promise((resolve, reject) => {
      try {
        if (!timer) {
          const res = fn.apply(this, args)
          resolve(res)
          timer = setTimeout(() => {
            timer = null
          }, delay)
        }
      } catch (err) {
        reject(err)
      }
    })
  }
}
