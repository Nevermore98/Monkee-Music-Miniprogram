// pages/view-mine/view-mine.js
import {
  loginByCaptcha,
  getCaptcha,
  verifyCaptcha,
  getUserDetail,
  getUserInfo,
  getUserPlayList
} from '../../services/user'

const defaultAvatarUrl =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    nickName: '',
    isNickNamePass: false,
    phone: '',
    captcha: '',
    uid: ''
  },
  onShow() {
    this.getTabBar().init()
  },
  onLoad() {
    const avatarUrl = wx.getStorageSync('avatarUrl')
    const nickName = wx.getStorageSync('nickName')
    if (avatarUrl) {
      this.setData({
        avatarUrl
      })
    }
    if (nickName) {
      this.setData({
        nickName
      })
    }
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl
    })
    wx.setStorageSync('avatarUrl', avatarUrl)
  },
  onNickNameBlur(e) {
    if (!this.data.isNickNamePass) return

    const { value } = e.detail
    this.setData({
      nickName: value
    })
    wx.setStorageSync('nickName', this.data.nickName)
  },
  async onNickNameReview(e) {
    if (!e.detail.pass) {
      wx.showToast({
        title: '昵称不合法',
        icon: 'error'
      })
      return
    }
    this.data.isNickNamePass = true
    const { result } = await wx.cloud.callFunction({
      name: 'login'
    })
    console.log(result.openid)
    wx.setStorageSync('openid', result.openid)
  },
  onNickNameConfirm(e) {
    console.log(e)
    const { value } = e.detail
    this.setData({
      nickName: value
    })
  },
  async sendCaptcha() {
    const phone = this.data.phone
    console.log(this.data.phone)
    const res = await getCaptcha(phone)
    wx.showToast({
      title: res.message,
      icon: ''
    })
    console.log(res)
  },
  async login() {
    const phone = this.data.phone
    const captcha = this.data.captcha
    const verifyRes = await verifyCaptcha(phone, captcha)
    console.log(verifyRes)

    const res = await loginByCaptcha(phone, captcha)
    console.log(res)
  },
  async fetchUserDetail() {
    const uid = this.data.uid
    const res = await getUserDetail(uid)
    console.log(res)
  },
  async fetchUserPlayList() {
    const uid = this.data.uid
    const res = await getUserPlayList(uid)
    console.log(res)
  }
})
