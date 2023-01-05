// pages/music-player/music-player.js
import { getSongDetail, getSongLyric, getSongUrl } from '../../services/player'
import { formatArtist } from '../../utils/utils'
import throttle from '../../utils/throttle'
import parseLyric from '../../utils/parseLyric'
import create from 'mini-stores'
import playerStore from '../../stores/playerStore'

const stores = {
  $player: playerStore
}

const app = getApp()
const innerAudioContext = wx.createInnerAudioContext({
  useWebAudioImplement: false
})

create.Page(stores, {
  data: {
    id: 0, // 歌曲 id
    currentSong: {}, // 当前播放歌曲
    songUrl: '', // 歌曲播放地址
    isFirstPlay: true, // 是否第一次播放

    lyricInfos: '', // 解析后的歌词
    currentLyricText: '', // 当前歌词
    currentLyricIndex: -1, // 当前歌词索引
    tapLyricIndex: -1,
    lyricScrollTop: 0, // 歌词滚动位置

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
    // this.fetchSongDetail()
    // this.fetchSongLyric()
    this.setupPlaySong(id)
  },
  // 更新播放进度
  updateProgress() {
    const sliderValue =
      (innerAudioContext.currentTime / innerAudioContext.duration) * 100
    this.setData({
      currentTime: innerAudioContext.currentTime * 1000,
      sliderValue
    })
  },
  async setupPlaySong(id) {
    this.setData({ id })
    await this.fetchSongDetail()
    await this.fetchSongLyric()
    // 设置歌曲 src
    innerAudioContext.src = this.data.songUrl
    // innerAudioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`

    innerAudioContext.autoplay = true

    if (this.data.isFirstPlay) {
      this.data.isFirstPlay = false
      const throttleUpdateProgress = throttle(this.updateProgress, 100)

      innerAudioContext.onTimeUpdate(() => {
        if (!this.data.isSliderDragging && !this.data.isWaiting) {
          throttleUpdateProgress()
        }
        this.matchLyric()
      })
      innerAudioContext.onWaiting(() => {
        innerAudioContext.pause()
      })
      innerAudioContext.onCanplay(() => {
        innerAudioContext.play()
      })
    }
  },
  // 根据 id 获取歌曲详情
  async fetchSongDetail() {
    const id = this.data.id
    const songDetail = await getSongDetail(id)
    const songInfo = await getSongUrl(id)
    console.log(songDetail)
    console.log(songInfo)
    this.data.songUrl = songInfo.data[0].url

    this.setData({
      currentSong: songDetail.songs[0],
      durationTime: songInfo.data[0].time
    })
    this.setData({ formattedArtist: formatArtist(this.data.currentSong.ar) })
  },
  // 根据 id 获取歌词
  async fetchSongLyric() {
    const res = await getSongLyric(this.data.id)
    const lyricInfos = parseLyric(res.lrc.lyric)
    this.setData({ lyricInfos })
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
    innerAudioContext.seek(currentTime / 1000)
    this.setData({
      currentTime,
      isSliderDragging: false,
      sliderValue: value,
      isPlaying: true
    })
    // 延时，避免报错，详见：https://segmentfault.com/q/1010000007130230
    setTimeout(() => {
      innerAudioContext.play()
    }, 100)
  },
  // 拖动进度条
  onSliderDragging(e) {
    const value = e.detail.value
    const currentTime = (value / 100) * this.data.durationTime
    this.setData({ currentTime, isSliderDragging: true })
  },
  // 点击播放暂停按钮
  onPlayOrPauseTap() {
    if (!innerAudioContext.paused) {
      innerAudioContext.pause()
      this.setData({ isPlaying: false })
    } else {
      innerAudioContext.play()
      this.setData({ isPlaying: true })
    }
  },
  // 匹配歌词时间
  matchLyric() {
    let index = this.data.lyricInfos.length - 1
    for (let i = 0; i < this.data.lyricInfos.length; i++) {
      const lineLyric = this.data.lyricInfos[i]
      if (lineLyric.lineTime > innerAudioContext.currentTime * 1000) {
        index = i - 1
        break
      }
    }
    if (index === this.data.currentLyricIndex) return
    const currentLyricText = this.data.lyricInfos[index].text
    this.setData({
      currentLyricText,
      currentLyricIndex: index,
      lyricScrollTop: index * 80
    })
  },
  // 点击歌词调整播放进度
  onLyricItemTap(e) {
    const index = e.currentTarget.dataset.index
    const currentTime = this.data.lyricInfos[index].lineTime / 1000
    innerAudioContext.seek(currentTime)
    this.setData({
      tapLyricIndex: index,
      currentTime: this.data.lyricInfos[index].lineTime,
      isSliderDragging: false,
      sliderValue: (currentTime / this.data.durationTime) * 100,
      isPlaying: true
    })
  },
  onPrevBtnTap() {
    this.goPlay(-1)
  },
  onNextBtnTap() {
    this.goPlay(1)
  },
  goPlay(num) {
    const length = stores.$player.data.playList.length
    let index = stores.$player.data.playListIndex

    index = index + num
    if (index === length) {
      index = 0
    }
    if (index === -1) {
      index = length - 1
    }
    const newSong = stores.$player.data.playList[index]
    stores.$player.setPlayListIndex(index)
    console.log(index)
    this.setupPlaySong(newSong.id)
  }
})
