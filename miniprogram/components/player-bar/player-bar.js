// components/player-bar/player-bar.js
import create from 'mini-stores'
import playerStore from '../../stores/playerStore'
import { formatArtist } from '../../utils/utils'

const stores = {
  $player: playerStore
}

create.Component(stores, {
  data: {
    isLoop: false,
    currentSong: {},
    formattedArtist: '',
    isPlaying: false,
    isShowPlayList: false
  },
  properties: {
    paddingBottom: {
      type: String,
      value: ''
    }
  },
  methods: {
    onPlayOrPauseTap() {
      stores.$player.changePlayerStatus()
      this.setData({
        isPlaying: stores.$player.data.isPlaying
      })
    },
    // 点击播放栏跳转到播放页面
    onPlayerBarTap() {
      wx.navigateTo({
        url: '/pages/music-player/music-player'
      })
    },
    showPopup() {
      this.setData({ isShowPlayList: true })
    },

    onClose() {
      this.setData({ isShowPlayList: false })
    }
  },
  pageLifetimes: {
    show: function () {
      this.setData({
        currentSong: stores.$player.data.currentSong,
        formattedArtist:
          formatArtist(stores.$player.data.currentSong.ar) || null,
        isPlaying: stores.$player.data.isPlaying
      })

      if (!this.data.currentSong.name) return
      let wrapperWidth
      let textWidth
      wx.createSelectorQuery()
        .in(this)
        .select('.info-wrapper')
        .boundingClientRect()
        .exec((res) => {
          wrapperWidth = res[0].width
          console.log(wrapperWidth)
        })
      wx.createSelectorQuery()
        .in(this)
        .select('.info-text')
        .boundingClientRect()
        .exec((res) => {
          textWidth = res[0].width
          console.log(textWidth)
          if (textWidth > wrapperWidth) {
            this.setData({
              isLoop: true
            })
          }
        })
    }
  }
})
