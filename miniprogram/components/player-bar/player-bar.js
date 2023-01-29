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
    // 无法直接监听 store 数据，需要从 stores 取得数据，赋值给组件属性，再监听
    'currentSong.al.picUrl': function (val) {
      if (!val) return
      this.getCanvasMainColor(val).then((res) => {
        console.log(res)
        const { color, isColorWhite } = res
        this.setData({ playerBarColor: color, isColorWhite })
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
      this.setData({ isShowPlayList: true })
      this.triggerEvent('show-popup')
    },
    onClosePopup() {
      this.setData({ isShowPlayList: false })
      this.triggerEvent('close-popup')
    },
    onModeTap() {
      stores.$player.changePlayMode()
    },
    onSongItemTap(e) {
      console.log(e)
      const { id, index } = e.detail
      if (id !== stores.$player.data.currentSong.id) {
        stores.$player.playSongAction(id)
        stores.$player.setCurrentPlayIndex(index)
      }
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`
      })
      this.setData({ isShowPlayList: false })
    },
    onClearTap() {
      this.setData({ isShowPlayList: false })
      stores.$player.clearPlayList()
      this.triggerEvent('close-popup')
      wx.showToast({
        title: '已清空播放列表',
        icon: 'none'
      })
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
      // if(stores.$player.currentSong.name)
      let wrapperWidth
      let textWidth
      // 组件内 createSelectorQuery 需要 in(this)
      wx.createSelectorQuery()
        .in(this)
        .select('.info-wrapper')
        .boundingClientRect()
        .exec((res) => {
          try {
            wrapperWidth = res[0].width
            console.log(wrapperWidth)
          } catch (error) {}
        })
      wx.createSelectorQuery()
        .in(this)
        .select('.info-text')
        .boundingClientRect()
        .exec((res) => {
          try {
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
          } catch (error) {}
        })
    }
  }
})
