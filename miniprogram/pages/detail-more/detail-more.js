// pages/detail-more/detail-more.js
import {
  getSongListAllTags,
  getSongListHotTags,
  getSongList
} from '../../services/discovery'

Page({
  data: {
    moreSongList: []
  },
  onLoad() {
    this.fetchSongListAllTags()
    this.fetchSongListHotTags()
  },
  async fetchSongListAllTags() {
    const res = await getSongListAllTags()
    console.log(res)
  },
  async fetchSongListHotTags() {
    const res = await getSongListHotTags()
    const tags = res.tags

    const allPromises = []

    for (const tag of tags) {
      const promise = getSongList(tag.name, 9)
      allPromises.push(promise)
    }

    Promise.all(allPromises).then((res) => {
      this.setData({ moreSongList: res })
    })
  },
  handlePopupShow() {
    wx.setPageStyle({
      style: {
        overflow: 'hidden'
      }
    })
    console.log('handlePopupShow')
  },
  handlePopupClose() {
    wx.setPageStyle({
      style: {
        overflow: ''
      }
    })
  }
})
