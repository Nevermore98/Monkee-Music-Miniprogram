export default function querySelect(selector) {
  return new Promise((resolve) => {
    let query
    query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec((res) => {
      resolve(res)
    })
  })
}
