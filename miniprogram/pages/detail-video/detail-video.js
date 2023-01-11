// pages/detail-video/detail-video.js
import {
  getMVUrl,
  getMVInfo,
  getVideoRelated,
  getMVSimilar,
  getVideoDetail,
  getVideoUrl
} from '../../services/video'

Page({
  data: {
    id: 0,
    vid: 0,
    mvUrl: '',
    mvInfo: {},
    videoInfo: {},
    relatedList: [],
    videoPublishTime: ''
  },
  onLoad(options) {
    const { id, vid } = options

    if (id) {
      this.setData({ id })
      this.fetchMVUrl()
      this.fetchMVInfo()
      this.fetchVideoRelated(id)
    } else {
      this.setData({ vid })
      this.fetchVideoUrl(vid)
      this.fetchVideoRelated(vid)
      this.fetchVideoInfo(vid)
    }
  },
  async fetchMVUrl() {
    const res = await getMVUrl(this.data.id)
    console.log(res)
    this.setData({ mvUrl: res.data.url })
  },
  async fetchVideoUrl(vid) {
    const res = await getVideoUrl(vid)
    console.log('视频url', res)
    this.setData({ mvUrl: res.urls[0].url })
  },
  async fetchMVInfo() {
    const res = await getMVInfo(this.data.id)
    console.log(res)
    this.setData({ mvInfo: res.data })
  },
  async fetchVideoInfo(vid) {
    const res = await getVideoDetail(vid)
    console.log('视频详情', res)
    this.setData({ videoInfo: res.data })
    console.log(formatDate(res.data.publishTime, false))
    this.setData({
      videoPublishTime: formatDate(res.data.publishTime)
    })

    function formatDate(time, isShowTime) {
      let date = new Date(time)

      let YY = date.getFullYear()
      let MM =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      let DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let mm =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      let ss =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

      if (isShowTime) {
        return YY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss
      } else {
        return YY + '-' + MM + '-' + DD
      }
    }
  },
  async fetchVideoRelated(id) {
    const res = await getVideoRelated(id)
    console.log('相关视频', res)
    // const simi = await getMVSimilar(this.data.id)
    // console.log(simi)
    this.setData({ relatedList: res.data })
  },
  onNavBackTap() {
    wx.navigateBack()
  },
  async onRelatedTap(e) {
    const vid = e.currentTarget.dataset.vid
    const NumberReg = /^\d+$/
    console.log(NumberReg.test(5327432))
    if (NumberReg.test(vid)) {
      wx.navigateTo({
        url: `/pages/detail-video/detail-video?id=${vid}`
      })
    } else {
      wx.navigateTo({
        url: `/pages/detail-video/detail-video?vid=${vid}`
      })
    }
    // const res = await getVideoDetail(vid)
    // console.log('视频详情', res)
  }
})
