import { getAllMV } from '../../services/video'

Page({
  data: {
    videoList: [],
    offset: 0,
    hasMore: true
  },
  onShow() {
    this.getTabBar().init()
  },
  onLoad() {
    this.fetchAllMV()
  },
  // 上拉加载
  onReachBottom() {
    if (!this.data.hasMore) return
    this.fetchAllMV()
  },
  // 下拉刷新随机重置 offset
  async onPullDownRefresh() {
    this.data.offset = Math.floor(Math.random() * 1000)
    this.setData({ videoList: [] })
    this.data.hasMore = true
    await this.fetchAllMV()
    // 停止下拉刷新
    wx.stopPullDownRefresh()
  },
  async fetchAllMV() {
    const res = await getAllMV(this.data.offset)
    console.log(res)
    const newVideoList = [...this.data.videoList, ...res.data]
    this.setData({ videoList: newVideoList })
    this.data.offset = this.data.offset + 30
    this.data.hasMore = res.hasMore
  }
})
