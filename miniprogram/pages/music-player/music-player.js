// pages/music-player/music-player.js
// import { getSongDetail, getSongLyric, getSongUrl } from '../../services/player'
// import { formatArtist } from '../../utils/utils'
import throttle from '../../utils/throttle'
import create from 'mini-stores'
import playerStore from '../../stores/playerStore'

const stores = {
  $player: playerStore
}

const app = getApp()
// const innerAudioContext = wx.createInnerAudioContext({
//   useWebAudioImplement: false
// })
// const playModeNames = ['sequence', 'single', 'random']

create.Page(stores, {
  data: {
    id: 0, // 歌曲 id
    // currentSong: {}, // 当前播放歌曲
    // songUrl: '', // 歌曲播放地址
    // isFirstPlay: true, // 是否第一次播放

    // lyricInfos: '', // 解析后的歌词
    // currentLyricText: '', // 当前歌词
    // currentLyricIndex: -1, // 当前歌词索引
    tapLyricIndex: -1,
    lyricScrollTop: 0, // 歌词滚动位置

    currentPage: 0, // 当前 swiper 页
    swiperHeight: 0, // swiper 高度 = screenHeight - 胶囊 top - 胶囊 height
    navBarTitles: ['歌曲', '歌词'], // 导航栏标题数组
    formattedArtist: '' // 格式化歌手名

    // currentTime: 0, // 当前播放时间
    // durationTime: 0, // 歌曲总时长
    // sliderValue: 0,
    // isSliderDragging: false,
    // isWaiting: false, // 是否正在等待
    // isPlaying: true, // 是否正在播放
    // playModeIndex: 0, // 播放模式索引
    // playModeName: 'sequence' // 播放模式名称
  },
  onLoad(options) {
    this.setData({ swiperHeight: app.globalData.playerSwiperHeight })
    const id = options.id
    // this.fetchSongDetail()
    // this.fetchSongLyric()
    // this.setupPlaySong(id)
    if (id) {
      stores.$player.playSongAction(id)
    }
  },
  // swiper 改变时切换导航栏标题高亮
  onSwiperChange(e) {
    this.setData({ currentPage: e.detail.current })
  },
  // 点击导航栏切换 swiper
  onNavBarItemTap(e) {
    this.setData({ currentPage: e.currentTarget.dataset.index })
  },
  onNavBackTap() {
    wx.navigateBack()
  },
  // 进度条改变
  onSliderChange(e) {
    const value = e.detail.value
    console.log(e)
    this.data.isWaiting = true
    setTimeout(() => {
      this.data.isWaiting = false
    }, 100)
    // innerAudioContext.seek(currentTime / 1000)
    stores.$player.setCurrentTimeByProgress(value, true)
    // this.setData({
    //   currentTime,
    //   isSliderDragging: false,
    //   sliderValue: value,
    //   isPlaying: true
    // })
    // 延时，避免报错，详见：https://segmentfault.com/q/1010000007130230
    // setTimeout(() => {
    //   innerAudioContext.play()
    // }, 100)
  },
  // 拖动进度条，节流
  onSliderDragging: throttle(function (e) {
    const value = e.detail.value
    console.log(value)
    stores.$player.setCurrentTimeByProgress(value, false)
    this.data.isSliderDragging = true
  }, 100),
  // 点击播放暂停按钮
  onPlayOrPauseTap() {
    stores.$player.changePlayerStatus()
  },
  // 点击播放模式按钮
  onModeTap() {
    stores.$player.changePlayMode()
  },
  // 点击歌词调整播放进度
  onLyricItemTap(e) {
    const index = e.currentTarget.dataset.index
    const currentTime = stores.$player.data.lyricInfos[index].lineTime
    stores.$player.setCurrentTime(currentTime)
  },
  onPrevBtnTap() {
    stores.$player.changePlaySong(-1)
  },
  onNextBtnTap() {
    stores.$player.changePlaySong(1)
  }
})
