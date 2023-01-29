// components/popup-playlist/popup-playlist.js
// import create from 'mini-stores'
// import playerStore from '../../stores/playerStore'
// const stores = {
//   $player: playerStore
// }

const app = getApp()

Component({
  properties: {
    playList: {
      type: Array,
      value: []
    },
    isShow: {
      type: Boolean,
      value: false
    },
    playMode: {
      type: String,
      value: ''
    },
    currentSongID: {
      type: Number,
      value: 0
    },
    currIndex: {
      type: Number,
      value: 0
    },
    isPlaying: {
      type: Boolean,
      value: false
    }
  },
  data: {
    playModeName: ''
  },
  observers: {
    playMode: function (val) {
      switch (val) {
        case 'sequence':
          this.setData({ playModeName: '顺序播放' })
          // this.queryScrollView('.playlist-scroll').then((scrollView) => {
          //   scrollView.scrollIntoView('.isPlaying')
          // })
          break

        case 'single':
          this.setData({ playModeName: '单曲循环' })
          break

        case 'random':
          this.setData({ playModeName: '随机播放' })
          this.queryScrollView('.playlist-scroll').then((scrollView) => {
            scrollView.scrollTo({
              top: 0
            })
          })
          break
      }
    },
    isShow: function (val) {
      if (val) {
        console.log('显示播放列表')
        this.queryScrollView('.playlist-scroll').then((scrollView) => {
          setTimeout(() => {
            // 滚动到当前播放歌曲，延时是为了等待渲染完成
            scrollView.scrollIntoView('.isPlaying')
            // 本来想滚动当前播放歌曲的上面四个的高度，但后面的会有偏差，暂时不用
            // const currIndex = this.properties.currIndex
            // const songItemHeightPixel = (app.globalData.screenWidth / 750) * 80
            // console.log(currIndex)
            // console.log(currIndex * songItemHeightPixel)
            // console.log(songItemHeightPixel)
            // const top = (currIndex - 4) * songItemHeightPixel
            // if (currIndex > 4) {
            //   scrollView.scrollTo({
            //     top
            //   })
            // } else {
            //   scrollView.scrollTo({
            //     top: 0
            //   })
            // }
          }, 200)
        })
      }
    }
  },
  methods: {
    queryScrollView(selector) {
      const _this = this
      return new Promise((resolve) => {
        wx.createSelectorQuery()
          .in(_this)
          .select(selector)
          .node()
          .exec((res) => {
            const scrollView = res[0].node
            resolve(scrollView)
          })
      })
    },
    onClose() {
      this.triggerEvent('close')
    },
    onCloseOverlay() {
      this.triggerEvent('close')
    },
    onModeTap() {
      this.triggerEvent('mode-tap')
    },
    onSongItemTap(e) {
      const id = e.currentTarget.dataset.id
      const index = e.currentTarget.dataset.index
      this.triggerEvent('song-tap', { id, index })
    },
    onClearTap() {
      let _this = this
      wx.showModal({
        title: '',
        content: '确定清空播放列表吗？',
        confirmColor: '#ff0000',
        confirmText: '清空',
        success(res) {
          if (res.confirm) {
            _this.triggerEvent('clear-tap')
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }
})
