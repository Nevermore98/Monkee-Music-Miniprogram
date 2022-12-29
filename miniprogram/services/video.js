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

export function getMVUrl(id) {
  return request.get({
    url: '/mv/url',
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

export function getMVRelated(id) {
  return request.get({
    url: '/related/allvideo',
    data: {
      id
    }
  })
}
