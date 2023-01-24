import throttle from '../../utils/throttle'
import create from 'mini-stores'
import playerStore from '../../stores/playerStore'
import settingStore from '../../stores/settingStore'

const stores = {
  $player: playerStore,
  $setting: settingStore
}

const app = getApp()

create.Page(stores, {
  data: {
    id: 0, // 歌曲 id
    tapLyricIndex: -1,
    lyricScrollTop: 0, // 歌词滚动位置

    currentPage: 0, // 当前 swiper 页
    swiperHeight: 0, // swiper 高度 = screenHeight - 胶囊 top - 胶囊 height
    navBarTitles: ['歌曲', '歌词'], // 导航栏标题数组
    formattedArtist: '' // 格式化歌手名
  },
  onShow() {
    console.log('播放页 onShow')
    stores.$setting.setIsShowNavBarTitle(false)
  },
  onLoad(options) {
    this.setData({ swiperHeight: app.globalData.playerSwiperHeight })
    const id = Number(options.id)
    // 如果点击的歌曲是当前播放歌曲，则无需重新播放
    if (id && id !== stores.$player.data.currentSongID) {
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
    console.log('--滑动结束--')
    console.log(value)

    stores.$player.setIsPlaying(true)
    stores.$player.setIsSliderDragging(true)
    stores.$player.setCurrentTimeByProgress(value, true)
    stores.$player.setIsSliderDragging(false)
    stores.$player.setAudioStatus('play')
  },
  // 拖动进度条，节流
  onSliderDragging: throttle(function (e) {
    console.log('--进度条拖动--')
    stores.$player.setIsSliderDragging(true)
    console.log(
      'stores.$player.data.isSliderDragging',
      stores.$player.data.isSliderDragging
    )
    const value = e.detail.value
    console.log(value)
    stores.$player.setCurrentTimeByProgress(value, false)
  }, 100),
  // 点击播放暂停按钮
  onPlayOrPauseTap() {
    console.log('播放暂停')
    console.log('前isPlaying', stores.$player.data.isPlaying)
    stores.$player.changePlayerStatus()
    console.log('后isPlaying', stores.$player.data.isPlaying)
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
  },
  onPlayListTap() {
    console.log('playlist tap')
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
})
