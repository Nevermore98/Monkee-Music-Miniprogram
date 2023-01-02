// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from '../../services/player'
const app = getApp()

Page({
  data: {
    id: 0,
    currentSong: {},
    lyricStr: '',
    currentPage: 0,
    swiperHeight: 0
  },
  onLoad(options) {
    this.setData({ swiperHeight: app.globalData.playerSwiperHeight })
    const id = options.id
    this.setData({ id })
    this.fetchSongDetail()
    this.fetchSongLyric()
  },
  async fetchSongDetail() {
    const res = await getSongDetail(this.data.id)
    console.log(res)
    this.setData({ currentSong: res.songs[0] })
  },
  async fetchSongLyric() {
    const res = await getSongLyric(this.data.id)
    console.log(res)
    this.setData({ lyricStr: res.lrc.lyric })
  },
  onSwiperChange(e) {
    this.setData({ currentPage: e.detail.current })
  },
  onNavBarItemTap(e) {
    this.setData({ currentPage: e.currentTarget.dataset.index })
  }
})
