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
        formattedArtist: formatArtist(this.properties.itemData.ar)
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
    }
  }
})
