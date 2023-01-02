// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from '../../services/player'
import { formatArtist } from '../../utils/utils'
import throttle from '../../utils/throttle'

const app = getApp()
const audioContext = wx.createInnerAudioContext()

Page({
  data: {
    id: 0, // 歌曲 id
    currentSong: {}, // 当前播放歌曲
    lyricStr: '', // 字符串歌词
    currentPage: 0, // 当前 swiper 页
    swiperHeight: 0, // swiper 高度 = screenHeight - 胶囊 top - 胶囊 height
    navBarTitles: ['歌曲', '歌词'], // 导航栏标题数组
    formattedArtist: '', // 格式化歌手名
    currentTime: 0, // 当前播放时间
    durationTime: 0, // 歌曲总时长
    sliderValue: 0,
    isSliderDragging: false,
    isWaiting: false, // 是否正在等待
    isPlaying: true // 是否正在播放
  },
  onLoad(options) {
    this.setData({ swiperHeight: app.globalData.playerSwiperHeight })
    const id = options.id
    this.setData({ id })
    this.fetchSongDetail()
    this.fetchSongLyric()
    // 播放歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true
    audioContext.onWaiting(() => {
      audioContext.pause()
    })
    audioContext.onCanplay(() => {
      audioContext.play()
    })
    const throttleUpdateProgress = throttle(this.updateProgress, 100)
    audioContext.onTimeUpdate(() => {
      if (!this.data.isSliderDragging && !this.data.isWaiting) {
        throttleUpdateProgress()
      }
    })
  },
  // 更新播放进度
  updateProgress() {
    const sliderValue = (audioContext.currentTime / audioContext.duration) * 100
    this.setData({
      currentTime: audioContext.currentTime * 1000,
      sliderValue
    })
  },
  // 根据 id 获取歌曲详情
  async fetchSongDetail() {
    const res = await getSongDetail(this.data.id)
    console.log(res)
    this.setData({
      currentSong: res.songs[0],
      durationTime: res.songs[0].dt
    })
    this.setData({ formattedArtist: formatArtist(this.data.currentSong.ar) })
  },
  // 根据 id 获取歌词
  async fetchSongLyric() {
    const res = await getSongLyric(this.data.id)
    console.log(res)
    this.setData({ lyricStr: res.lrc.lyric })
  },
  // swiper 改变时切换导航栏标题高亮
  onSwiperChange(e) {
    this.setData({ currentPage: e.detail.current })
  },
  // 点击导航栏切换 swiper
  onNavBarItemTap(e) {
    this.setData({ currentPage: e.currentTarget.dataset.index })
  },
  // 进度条改变
  onSliderChange(e) {
    const value = e.detail
    this.data.isWaiting = true
    setTimeout(() => {
      this.data.isWaiting = false
    }, 100)
    const currentTime = (value / 100) * this.data.durationTime
    audioContext.seek(currentTime / 1000)
    this.setData({
      currentTime,
      isSliderDragging: false,
      sliderValue: value,
      isPlaying: true
    })
    audioContext.play()
  },
  // 拖动进度条
  onSliderDragging(e) {
    const value = e.detail.value
    // this.setData({ isSliderDrag: true })
    const currentTime = (value / 100) * this.data.durationTime
    this.setData({ currentTime, isSliderDragging: true })
  },
  // 点击播放暂停按钮
  onPlayOrPauseTap() {
    if (!audioContext.paused) {
      audioContext.pause()
      this.setData({ isPlaying: false })
    } else {
      audioContext.play()
      this.setData({ isPlaying: true })
    }
  }
})
