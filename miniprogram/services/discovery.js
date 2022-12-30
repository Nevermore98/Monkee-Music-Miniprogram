import { request } from './index'

export function getBanner(type = 2) {
  return request.get({
    url: '/banner',
    data: {
      type
    }
  })
}

export function getDefaultSearch() {
  return request.get({
    url: '/search/default'
  })
}

// 获取歌单详情，id 3778678 为热歌榜
export function getPlaylistDetail(id) {
  return request.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}

export function getHotSongList(
  cat = '全部',
  limit = 6,
  offset = 0,
  order = 'hot'
) {
  return request.get({
    url: '/top/playlist',
    data: {
      cat,
      limit,
      offset,
      order
    }
  })
}

export function getRecommendSongList(limit = 6) {
  return request.get({
    url: '/personalized',
    data: {
      limit
    }
  })
}
