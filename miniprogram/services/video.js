import { request } from './index'

export function getTopMV(offset = 0, limit = 20) {
  return request.get({
    url: '/top/mv',
    data: {
      limit,
      offset
    }
  })
}

export function getRecommendVideo(offset = 10) {
  return request.get({
    url: '/video/timeline/recommend',
    data: {
      offset
    }
  })
}

export function getAllMV(offset = 0, limit = 30) {
  return request.get({
    url: '/mv/all',
    data: {
      limit,
      offset
    }
  })
}
// 获取 MV 播放地址
export function getMVUrl(id) {
  return request.get({
    url: '/mv/url',
    data: {
      id
    }
  })
}

// 获取视频播放地址
export function getVideoUrl(id) {
  return request.get({
    url: '/video/url',
    data: {
      id
    }
  })
}

export function getMVInfo(id) {
  return request.get({
    url: '/mv/detail',
    data: {
      mvid: id
    }
  })
}

// 获取相关视频
export function getVideoRelated(id) {
  return request.get({
    url: '/related/allvideo',
    data: {
      id
    }
  })
}

export function getVideoDetail(id) {
  return request.get({
    url: '/video/detail',
    data: {
      id
    }
  })
}

export function getMVSimilar(id) {
  return request.get({
    url: '/simi/mv',
    data: {
      mvid: id
    }
  })
}
