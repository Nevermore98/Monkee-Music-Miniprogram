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
export function getSonglistDetail(id) {
  return request.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}

// 获取热门歌单
export function getSongList(cat = '全部', limit = 6, offset = 0) {
  return request.get({
    url: '/top/playlist',
    data: {
      cat,
      limit,
      offset
    }
  })
}

// 获取推荐歌单
export function getRecommendSongList(limit = 6) {
  return request.get({
    url: '/personalized',
    data: {
      limit
    }
  })
}

// 获取歌单分类
export function getSongListAllTags() {
  return request.get({
    url: '/playlist/catlist'
  })
}

// 获取热门歌单分类
export function getSongListHotTags() {
  return request.get({
    url: '/playlist/hot'
  })
}

// 获取歌单所有歌曲
export function getSongListAllSongs(id) {
  return request.get({
    url: '/playlist/track/all',
    data: {
      id
    }
  })
}
