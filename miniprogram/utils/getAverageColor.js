import { FastAverageColor } from 'fast-average-color'
import querySelect from './query-select'

// 提取图片平均色
export default function getAverageColor(selector) {
  return new Promise((resolve, reject) => {
    querySelect(selector).then((img) => {
      if (!img) return
      console.log(img)
      // img.setAttribute('crossOrigin', '')
      const fac = new FastAverageColor()
      img.onload = () => {
        fac
          .getColorAsync(img, { ignoredColor: [255, 255, 255, 255] })
          .then((color) => {
            console.log(color.rgba)
            resolve(color.rgba)
          })
          .catch((e) => {
            reject(e)
          })
      }
    })
  })
}
