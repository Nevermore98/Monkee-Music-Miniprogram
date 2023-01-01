// components/song-item/song-item.js
import { formatArtist } from '../../utils/utils'

Component({
  properties: {
    songItemData: {
      // 有警告，明明传的是对象，可能父组件传值一开始是 null？
      type: Object,
      // type: null,
      value: {}
    },
    rank: {
      type: Number,
      value: 0
    }
  },
  data: {
    formattedArtist: ''
  },

  lifetimes: {
    attached() {
      try {
        this.setData({
          formattedArtist: formatArtist(this.properties.songItemData.ar)
        })
      } catch (error) {}
    }
  }
})
