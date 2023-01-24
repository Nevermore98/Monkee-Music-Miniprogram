import { request } from './index'

export function loginByCaptcha(phone, captcha) {
  return request.post({
    url: '/login/cellphone',
    data: {
      phone,
      captcha
    }
  })
}

export function getCaptcha(phone) {
  return request.post({
    url: '/captcha/sent',
    data: {
      phone
    }
  })
}
export function getSonglistDetail(id) {
  return request.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}

export function verifyCaptcha(phone, captcha) {
  return request.post({
    url: '/captcha/verify',
    data: {
      phone,
      captcha
    }
  })
}

export function getUserDetail(uid) {
  return request.get({
    url: '/user/detail',
    data: {
      uid
    }
  })
}

export function getUserInfo() {
  return request.post({
    url: '/user/subcount'
  })
}

export function getUserPlayList(uid, limit = 30, offset = 0) {
  return request.get({
    url: '/user/playlist',
    data: {
      uid,
      limit,
      offset
    }
  })
}
