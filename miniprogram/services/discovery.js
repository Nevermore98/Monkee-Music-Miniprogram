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
