// pages/detail-video/detail-video.js
import {
  getMVUrl,
  getMVInfo,
  getVideoRelated,
  getMVSimilar,
  getVideoDetail,
  getVideoUrl
} from '../../services/video'
import formatDate from '../../utils/formatDate'

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
      this.fetchMVUrl(id)
      this.fetchMVInfo(id)
      this.fetchVideoRelated(id)
    } else {
      this.setData({ vid })
      this.fetchVideoUrl(vid)
      this.fetchVideoRelated(vid)
      this.fetchVideoInfo(vid)
    }
  },
  async fetchMVUrl(id) {
    const res = await getMVUrl(id)
    console.log('MV url', res)
    this.setData({ mvUrl: res.data.url })
  },
  async fetchMVInfo(id) {
    const res = await getMVInfo(id)
    console.log('MV 详情', res)
    this.setData({ mvInfo: res.data })
  },
  async fetchVideoUrl(vid) {
    const res = await getVideoUrl(vid)
    console.log('视频url', res)
    this.setData({ mvUrl: res.urls[0].url })
  },
  async fetchVideoInfo(vid) {
    const res = await getVideoDetail(vid)
    console.log('视频详情', res)
    this.setData({ videoInfo: res.data })
    this.setData({
      videoPublishTime: formatDate(res.data.publishTime)
    })
  },
  async fetchVideoRelated(id) {
    const res = await getVideoRelated(id)
    console.log('相关视频', res)
    this.setData({ relatedList: res.data })
  },
  onNavBackTap() {
    wx.navigateBack()
  },
  async onRelatedTap(e) {
    const vid = e.currentTarget.dataset.vid
    const NumberReg = /^\d+$/
    // 纯数字为 MV，非纯数字为视频
    if (NumberReg.test(vid)) {
      wx.navigateTo({
        url: `/pages/detail-video/detail-video?id=${vid}`
      })
    } else {
      wx.navigateTo({
        url: `/pages/detail-video/detail-video?vid=${vid}`
      })
    }
  }
})
