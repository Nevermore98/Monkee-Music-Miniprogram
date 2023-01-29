// components/song-item-v2/song-item-v2.js
import { formatArtist } from '../../utils/utils'

Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    privileges: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    },
    currentSongID: {
      type: Number,
      value: 0
    },
    isShowPlaying: {
      type: Boolean,
      value: false
    },
    isPlaying: {
      type: Boolean,
      value: false
    }
  },
  data: {
    formattedArtist: '',
    itemActionList: ['功能开发中']
  },
  observers: {
    isShowPlaying: function (val) {
      if (val) {
        let playingSvg
        wx.createSelectorQuery()
          .in(this)
          .select('#svg-playing')
          .node()
          .exec((res) => {
            // console.log(res[0])
            // playingSvg = res[0]
            try {
              console.log(res)

              playingSvg = res[0]
              playingSvg.unpauseAnimations()
            } catch (error) {}
          })
        wx.createSelectorQuery()
          .in(this)
          .select('#svg-playing')
          .boundingClientRect((rect) => {
            console.log(rect)
          })
          .exec()
      }
      // if (val) {
      //   console.log(playingSvg)
      //   playingSvg.unpauseAnimations()
      // } else {
      //   playingSvg.pauseAnimations()
      // }
    }
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
      const song = this.properties.itemData
      const id = song.id
      console.log(id)
      console.log(song)
      if (song.fee === 4) {
        wx.showToast({
          title: '暂无版权或需要会员',
          icon: 'none'
        })
        return
      }
      this.triggerEvent('song-tap', {
        id,
        ar: song.ar || song.artists,
        name: song.name
      })
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
    async onMoreTap() {
      const itemList = this.data.itemActionList
      console.log('more')
      const res = await wx
        .showActionSheet({
          itemList
        })
        .then(() => {
          console.log(res.tapIndex)
        })
        .catch(() => {})
    }
  }
})
