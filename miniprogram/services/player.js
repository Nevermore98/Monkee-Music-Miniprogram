import { request } from './index'

export function getSongDetail(ids) {
  return request.get({
    url: '/song/detail',
    data: {
      ids
    }
  })
}

// 获取歌曲 url
export function getSongUrl(id, level = 'standard') {
  return request.get({
    url: '/song/url/v1',
    data: {
      id,
      level
    }
  })
}

export function getSongLyric(id) {
  return request.get({
    url: '/lyric',
    data: {
      id
    }
  })
}
