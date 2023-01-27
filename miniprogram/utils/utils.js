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

// 随机播放，打乱列表
export function shuffle(playList, currSongId) {
  const arr = playList.slice()
  // 若播放列表为空时，搜索页点击歌曲添加到播放列表，只有一首歌。直接返回本身
  if (arr.length === 1) return arr

  for (let i = 0; i < arr.length; i++) {
    // 当前索引元素与随机索引元素 交换位置
    let randomIndex = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
  }

  // 当前播放歌曲与乱序后的列表首位 交换位置
  if (arr[0].id !== currSongId) {
    let currIndex = arr.findIndex((song) => song.id === currSongId)
    ;[arr[0], arr[currIndex]] = [arr[currIndex], arr[0]]
  }
  return arr
}
