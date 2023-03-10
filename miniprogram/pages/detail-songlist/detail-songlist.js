// pages/detail-songlist/detail-songlist.js
import create from 'mini-stores'

import {
  getSonglistDetail,
  getSongListAllSongs
} from '../../services/discovery'
import discoveryStore from '../../stores/discoveryStore'
import playerStore from '../../stores/playerStore'
import settingStore from '../../stores/settingStore'
import { pick } from '../../utils/utils'
import throttle from '../../utils/throttle'
const app = getApp()

const stores = {
  $discovery: discoveryStore,
  $player: playerStore,
  $setting: settingStore
}

create.Page(stores, {
  data: {
    songListInfo: {},
    songListTracks: [],
    type: '',
    rankingType: '',
    id: 0,
    songlistHeaderRef: null,
    navBarColor: '',
    isScrollToShowNavBar: false,
    scrollLock: false
  },
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const type = options.type
    // 榜单类型使用 discoveryStore 的数据，歌单类型需要请求获取歌单全部歌曲接口
    if (type === 'ranking') {
      const rankingType = options.rankingType
      this.setData({ type })
      this.setData({ rankingType })

      // 获取排行榜部分数据
      const rankingInfo = stores.$discovery.data[options.rankingType]
      this.setData({
        songListInfo: rankingInfo
      })
      wx.hideLoading()
    } else if (type === 'songlist') {
      // 不需要渲染到页面，所以无需 setData
      this.data.id = options.id
      this.setData({ type })
      this.fetchSongList()
    }
  },
  onUnload() {
    stores.$setting.setNavBarColor('')
    stores.$setting.setIsMainColorWhite(false)
    stores.$setting.setIsShowNavBarTitle(false)
  },
  onShow() {
    if (this.data.isScrollToShowNavBar) {
      stores.$setting.setIsShowNavBarTitle(true)
    }
  },
  onPageScroll: throttle(function (e) {
    const songListScrollPixel = (app.globalData.screenWidth * 800) / 750
    const rankingScrollPixel = (app.globalData.screenWidth * 300) / 750
    if (this.data.type === 'songlist') {
      if (e.scrollTop > songListScrollPixel) {
        this.data.isScrollToShowNavBar = true
        stores.$setting.setIsShowNavBarTitle(true)
      } else {
        this.data.isScrollToShowNavBar = false
        stores.$setting.setIsShowNavBarTitle(false)
      }
    } else {
      if (e.scrollTop > rankingScrollPixel) {
        this.data.isScrollToShowNavBar = true
        stores.$setting.setIsShowNavBarTitle(true)
      } else {
        this.data.isScrollToShowNavBar = false
        stores.$setting.setIsShowNavBarTitle(false)
      }
    }
  }, 100),
  async fetchSongList() {
    // getSonglistDetail 的 tracks：如果是歌单则只有 20 条数据，排行榜数据为全部
    const res = await getSonglistDetail(this.data.id)
    const songs = await getSongListAllSongs(this.data.id)
    console.log('歌单信息', res)
    console.log('歌单所有歌曲', songs)
    const infoPickArr = [
      'name',
      'description',
      'coverImgUrl',
      'updateTime',
      'id',
      'playCount',
      'creator'
    ]
    res.playlist = pick(res.playlist, infoPickArr)
    this.setData({ songListInfo: res.playlist })
    for (let i = 0; i < songs.songs.length; i++) {
      const tracksPickArr = ['name', 'id', 'ar', 'al', 'mv', 'fee', 'dt']
      songs.songs[i] = pick(songs.songs[i], tracksPickArr)

      const privilegesPickArr = ['subp', 'cp']
      songs.privileges[i] = pick(songs.privileges[i], privilegesPickArr)
      songs.songs[i].privileges = songs.privileges[i]
    }
    this.setData({ songListTracks: songs.songs })
    wx.hideLoading()
  },
  onSongItemTap(e) {
    let playList = []
    const index = e.currentTarget.dataset.index

    if (this.data.type === 'ranking') {
      playList = this.data.songListInfo.tracks
    } else {
      playList = this.data.songListTracks
    }

    stores.$player.setSequencePlayList(playList)
    stores.$player.setPlayList(playList)
    // 歌单列表点击歌曲，播放模式改为顺序
    stores.$player.setPlayModeIndex(0)

    stores.$player.setCurrentPlayIndex(index)
    stores.$player.setIsPlaying(true)
  },
  onPlayAllTap() {
    let playList = []
    if (this.data.type === 'ranking') {
      playList = this.data.songListInfo.tracks
    } else {
      playList = this.data.songListTracks
    }

    stores.$player.setSequencePlayList(playList)
    stores.$player.setPlayList(playList)
    stores.$player.setPlayModeIndex(0)

    stores.$player.setCurrentPlayIndex(0)
    stores.$player.setIsPlaying(true)
    const id = playList[0].id
    wx.navigateTo({
      url: `/pages/music-player/music-player?id=${id}`
    })
  },
  handlePopupShow() {
    wx.setPageStyle({
      style: {
        overflow: 'hidden'
      }
    })
    // console.log('handlePopupShow')
    // this.setData({ scrollLock: true })
  },
  handlePopupClose() {
    wx.setPageStyle({
      style: {
        overflow: ''
      }
    })
    // console.log('handlePopupClose')
    // this.setData({ scrollLock: false })
  }
})
