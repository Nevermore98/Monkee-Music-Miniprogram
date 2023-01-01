export function formatArtist(artist) {
  // 注意返回
  try {
    return artist
      .map((item) => {
        // 注意返回
        return item.name
      })
      .join(' / ')
  } catch (error) {}
}

export function pick(obj, pickArr) {
  return pickArr.reduce((iter, item) => {
    if (item in obj) {
      iter[item] = obj[item]
    }
    return iter
  }, {})
}
