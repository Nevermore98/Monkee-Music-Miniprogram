// components/song-item-v2/song-item-v2.js
import { formatArtist } from '../../utils/utils'

Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    }
  },
  data: {
    formattedArtist: ''
  },
  lifetimes: {
    attached() {
      this.setData({
        formattedArtist: formatArtist(
          this.properties.itemData.ar || this.properties.itemData.artists
        )
      })
    }
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.itemData.id
      console.log(id)
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`
      })
    },
    onVideoTap() {
      const id = this.properties.itemData.mv || this.properties.itemData.mvid
      wx.navigateTo({
        url: `/pages/detail-video/detail-video?id=${id}`
      })
    },
    onMoreTap() {
      console.log('more')
    }
  }
})
