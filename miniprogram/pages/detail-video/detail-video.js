// pages/detail-video/detail-video.js
import { getMVUrl, getMVInfo, getMVRelated } from '../../services/video'

Page({
  data: {
    id: 0,
    mvUrl: '',
    mvInfo: {},
    relatedList: []
  },
  onLoad(options) {
    const { id } = options
    this.setData({ id })

    this.fetchMVUrl()
    this.fetchMVInfo()
    this.fetchMVRelated()
  },
  async fetchMVUrl() {
    const res = await getMVUrl(this.data.id)
    console.log(res)
    this.setData({ mvUrl: res.data.url })
  },
  async fetchMVInfo() {
    const res = await getMVInfo(this.data.id)
    console.log(res)
    this.setData({ mvInfo: res.data })
  },
  async fetchMVRelated() {
    const res = await getMVRelated(this.data.id)
    console.log(res)
    this.setData({ relatedList: res.data })
  }
})
