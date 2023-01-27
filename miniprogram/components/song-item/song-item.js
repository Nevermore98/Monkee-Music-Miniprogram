// components/song-item/song-item.js
import { formatArtist } from '../../utils/utils'

Component({
  properties: {
    songItemData: {
      type: Object,
      value: {}
    },
    rank: {
      type: Number,
      value: 0
    }
  },
  data: {
    formattedArtist: '',
    rankClass: ''
  },
  lifetimes: {
    attached() {
      try {
        this.setData({
          formattedArtist: formatArtist(this.properties.songItemData.ar)
        })
        // 根据排名设置样式
        switch (this.properties.rank) {
          case 1:
            this.setData({ rankClass: 'rank-one' })
            break
          case 2:
            this.setData({ rankClass: 'rank-two' })
            break
          case 3:
            this.setData({ rankClass: 'rank-three' })
            break
          default:
            this.setData({ rankClass: '' })
        }
      } catch (error) {}
    }
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.songItemData.id
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`
      })
    }
  }
})
