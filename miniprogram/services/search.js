import { request } from './index'

export function getDefaultSearch() {
  return request.get({
    url: '/search/default'
  })
}

export function getHotSearch() {
  return request.get({
    url: '/search/hot'
  })
}

export function getSuggestSearch(keywords) {
  return request.get({
    url: '/search/suggest',
    data: {
      keywords,
      type: 'mobile'
    }
  })
}

export function getSearchResult(keywords, type = 'song', offset = 0) {
  switch (type) {
    // case 'integrated':
    //   type = '1018'
    //   break
    case 'song':
      type = '1'
      break
    case 'songlist':
      type = '1000'
      break
    case 'video':
      type = '1014'
      break
  }
  return request.get({
    url: '/search',
    data: {
      keywords,
      type,
      offset
    }
  })
}
