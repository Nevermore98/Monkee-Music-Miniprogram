// components/player-bar/player-bar.js
import create from 'mini-stores'
import playerStore from '../../stores/playerStore'
import { formatArtist } from '../../utils/utils'
import getMainColor from '../../utils/getMainColor'

const stores = {
  $player: playerStore
}

create.Component(stores, {
  data: {
    isLoop: false,
    currentSong: {},
    formattedArtist: '',
    isPlaying: false,
    isShowPlayList: false,
    playerBarColor: '',
    isColorWhite: false
  },
  properties: {
    paddingBottom: {
      type: String,
      value: ''
    },
    placeHolderHeight: {
      type: String,
      value: ''
    }
  },
  observers: {
    'currentSong.al.picUrl': function (val) {
      if (!val) return
      this.getCanvasMainColor(val).then((res) => {
        console.log(res)
        const { color, isColorWhite } = res
        this.setData({ playerBarColor: color, isColorWhite })
        console.log(this.data.playerBarColor)
        // stores.$setting.setNavBarColor(color)
        // stores.$setting.setIsMainColorWhite(isColorWhite)
      })
    }
  },
  methods: {
    getCanvasMainColor(imgPath) {
      return new Promise((resolve) => {
        const query = this.createSelectorQuery()
        query
          .select('#myCanvas')
          .fields({
            node: true,
            size: true
          })
          .exec((res) => {
            console.log(res)
            getMainColor(res, imgPath).then((ret) => {
              resolve(ret)
            })
          })
      })
    },
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
    onPlayListTap() {
      console.log('playlist tap')
      wx.showToast({
        title: '功能开发中',
        icon: 'none'
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
          } else {
            this.setData({
              isLoop: false
            })
          }
        })
    }
  }
})
