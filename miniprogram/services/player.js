import { request } from './index'

export function getSongDetail(ids) {
  return request.get({
    url: '/song/detail',
    data: {
      ids
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
