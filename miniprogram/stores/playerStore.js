import { getSongDetail, getSongUrl, getSongLyric } from '../services/player'
import parseLyric from '../utils/parseLyric'
import { formatArtist, shuffle } from '../utils/utils'
import throttle from '../utils/throttle'

const audioContext = wx.getBackgroundAudioManager()
const playModeNames = ['sequence', 'single', 'random']
export const PLAY_MODE = { sequence: 0, single: 1, random: 2 }

class Store {
  data = {
    currentSong: {},
    currentSongID: 0, // 当前播放歌曲 id，用于歌单页 song-item-v2 匹配当前歌曲
    songUrl: '',
    formattedArtist: '',

    currentTime: 0, // 当前播放时间（毫秒）
    durationTime: 0, // 歌曲总时长（毫秒）
    progressValue: 0, // 进度条百分值

    isFirstPlay: true, // 是否第一次播放，用于添加绑定事件
    isPlaying: false, // 是否正在播放
    isSliderDragging: false, // 进度条是否正在拖动
    isLoop: false, // 是否循环播放

    playModeIndex: PLAY_MODE.sequence, // 播放模式索引
    playModeName: 'sequence',

    lyricInfos: {},
    currentLyricText: '',
    currentLyricIndex: -1,
    lyricScrollTop: 0,

    playList: [], // 播放列表
    sequencePlayList: [], // 顺序播放列表
    currentPlayIndex: 0, // 当前播放歌曲在播放列表中的索引

    isShowPlayerBar() {
      return this.currentSongID !== 0
    }
  }
  async playSongAction(id) {
    this.data.currentSong = {}
    this.data.durationTime = 0
    this.data.currentLyricIndex = 0
    this.data.currentLyricText = ''
    this.data.lyricInfos = []
    this.data.lyricScrollTop = 0
    this.data.isPlaying = true

    const songDetail = await getSongDetail(id)
    console.log('当前播放歌曲', songDetail.songs[0])
    this.data.currentSong = songDetail.songs[0]
    this.data.currentSongID = songDetail.songs[0].id
    this.data.formattedArtist = formatArtist(this.data.currentSong.ar)
    this.update()

    const songUrl = await getSongUrl(id)
    console.log('歌曲链接', songUrl.data[0].url)
    this.data.songUrl = songUrl.data[0].url
    this.data.durationTime = songUrl.data[0].time

    // 设置歌曲 src
    audioContext.stop()
    try {
      audioContext.src = this.data.songUrl
      this.setIsPlaying(true)
    } catch {
      wx.showToast({
        title: '暂无版权，自动播放下一首',
        icon: 'none',
        duration: 2000
      })
      audioContext.stop()
      this.setIsPlaying(false)
      setTimeout(() => {
        this.changePlaySong(1)
      }, 2000)
      return
    }
    audioContext.title = this.data.currentSong.name
    audioContext.epname = this.data.currentSong.name
    audioContext.singer = this.data.formattedArtist
    audioContext.coverImgUrl = this.data.currentSong.al.picUrl
    // innerAudioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true

    const songLyric = await getSongLyric(id)
    this.data.lyricInfos = parseLyric(songLyric.lrc.lyric)
    this.update()

    if (this.data.isFirstPlay) {
      this.data.isFirstPlay = false

      const updateProgress = () => {
        this.data.currentTime = audioContext.currentTime * 1000
        this.data.progressValue =
          (this.data.currentTime / this.data.durationTime) * 100
        this.update()
      }
      const throttleUpdateProgress = throttle(updateProgress, 500)
      audioContext.onTimeUpdate(() => {
        throttleUpdateProgress()
        this.matchLyric()
        this.update()
      })
      // 音频播放，或用户在系统中点击播放暂停都会监听到
      audioContext.onPlay(() => {
        console.log('播放')
        if (!this.data.isSliderDragging) {
          this.setIsPlaying(true)
        }
      })
      audioContext.onPause(() => {
        console.log('暂停')
        if (!this.data.isSliderDragging) {
          this.setIsPlaying(false)
        }
      })
      // audioContext.onWaiting(() => {
      //   console.log('onWaiting')
      //   // audioContext.pause()
      //   // this.setIsPlaying(false)
      // })
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      audioContext.onEnded(() => {
        if (this.data.playModeIndex === PLAY_MODE.single) {
          this.setIsPlaying(true)
          this.data.currentLyricIndex = 0
          this.data.currentTime = 0
          audioContext.src = this.data.songUrl
          audioContext.title = this.data.currentSong.name
          audioContext.epname = this.data.currentSong.name
          audioContext.singer = this.data.formattedArtist
          audioContext.coverImgUrl = this.data.currentSong.al.picUrl
          return
        }
        this.changePlaySong(1)
      })
      audioContext.onStop(() => {
        this.setIsPlaying(false)
      })
      audioContext.onNext(() => {
        this.changePlaySong(1)
      })
      audioContext.onPrev(() => {
        this.changePlaySong(-1)
      })
    }
    this.update()
  }
  // 匹配歌词时间
  matchLyric() {
    if (!this.data.lyricInfos.length) return
    let index = this.data.lyricInfos.length - 1
    for (let i = 0; i < this.data.lyricInfos.length; i++) {
      const lineLyric = this.data.lyricInfos[i]
      if (lineLyric.lineTime > audioContext.currentTime * 1000) {
        index = i - 1
        break
      }
    }
    if (index === this.data.currentLyricIndex) return
    if (this.data.lyricInfos.length === 1) {
      this.data.currentLyricText = this.data.lyricInfos[0].text
      return
    }
    try {
      const currentLyricText = this.data.lyricInfos[index].text
      this.data.currentLyricText = currentLyricText
      this.data.currentLyricIndex = index
      this.data.lyricScrollTop = index * 80
    } catch (error) {}

    // TODO 歌词每句高度不一样，需要获取
    // let height = 0
    // let tmp = this.data.lyricScrollTop
    // wx.createSelectorQuery()
    //   .select('.current-active')
    //   .boundingClientRect()
    //   .exec((res) => {
    //     height = res[0].height
    //     console.log(height)
    //     this.data.lyricScrollTop = tmp + height
    //   })
    this.update()
  }
  // 播放暂停
  changePlayerStatus() {
    if (audioContext.paused) {
      audioContext.play()
      this.setIsPlaying(true)
    } else {
      audioContext.pause()
      this.setIsPlaying(false)
    }
    this.update()
  }
  // 切换播放模式
  changePlayMode() {
    let modeIndex = (this.data.playModeIndex + 1) % 3
    this.setPlayModeIndex(modeIndex)
    this.setPlayModeName(playModeNames[modeIndex])

    const sequencePlayList = this.data.sequencePlayList
    const currSongId = this.data.currentSong.id
    const currIndex = sequencePlayList.findIndex(
      (song) => song.id === currSongId
    )

    switch (modeIndex) {
      case PLAY_MODE.sequence:
        // audioContext.loop = false
        this.data.isLoop = false
        this.setPlayList(sequencePlayList)
        this.setCurrentPlayIndex(currIndex)
        this.data.playModeChineseName = '顺序播放'
        wx.showToast({
          title: '顺序播放',
          icon: 'none',
          duration: 1000
        })
        break
      case PLAY_MODE.single:
        // audioContext.loop = true
        this.data.isLoop = true
        this.setPlayList(sequencePlayList)
        this.setCurrentPlayIndex(currIndex)
        wx.showToast({
          title: '单曲循环',
          icon: 'none',
          duration: 1000
        })
        break
      case PLAY_MODE.random:
        // audioContext.loop = false
        this.data.isLoop = false
        const randomPlayList = shuffle(sequencePlayList, currSongId)
        this.setPlayList(randomPlayList)
        this.setCurrentPlayIndex(0)
        wx.showToast({
          title: '随机播放',
          icon: 'none',
          duration: 1000
        })
        break
    }
    this.update()
  }
  // 切换歌曲
  changePlaySong(num) {
    const length = this.data.playList.length
    let index = this.data.currentPlayIndex
    index = index + num

    // 最后一首的下一首跳转到第一首，第一首的上一首跳转到最后一首
    if (index === length) {
      index = 0
    }
    if (index === -1) {
      index = length - 1
    }

    const newSong = this.data.playList[index]
    this.setCurrentPlayIndex(index)
    this.playSongAction(newSong.id)
    this.setIsPlaying(true)
    this.setCurrentTime(0)

    this.update()
  }
  // 拖动、点击进度条改变当前时间
  setCurrentTimeByProgress(payload, isSeek = true) {
    this.data.currentTime = (payload / 100) * this.data.durationTime
    // 拖动进度条时，不需要 seek
    console.log(this.data.currentTime)
    audioContext.pause()
    this.data.isPlaying = true
    if (isSeek) {
      audioContext.seek(this.data.currentTime / 1000)
      audioContext.onSeeked(() => {
        audioContext.play()
      })
    }
    this.update()
  }
  updateProgress = () => {
    this.data.currentTime = audioContext.currentTime * 1000
    this.data.progressValue =
      (this.data.currentTime / this.data.durationTime) * 100
    this.update()
  }
  addSearchSongToPlayList(song) {
    const playList = this.data.playList
    const currIndex = this.data.currentPlayIndex
    const index = playList.findIndex((item) => item.id === song.id)

    if (index !== -1) {
      console.log('include')
      setTimeout(() => {
        wx.showToast({
          title: '当前播放列表包含该歌曲',
          icon: 'none',
          duration: 2000
        })
      }, 1000)
      this.setCurrentPlayIndex(index)
      return
    }
    if (this.data.playList.length === 0) {
      this.setSequencePlayList([song])
    }
    // splice 会修改原数组
    playList.splice(currIndex + 1, 0, song)
    this.setCurrentPlayIndex(currIndex + 1)
    this.update()
  }
  clearPlayList() {
    this.data.playList = []
    this.data.sequencePlayList = []
    this.data.currentPlayIndex = 0
    this.data.currentSong = {}
    this.data.currentSongID = 0
    this.data.currentTime = 0
    this.data.durationTime = 0
    this.data.progressValue = 0
    this.data.isPlaying = false
    this.data.isLoop = false
    this.data.playModeIndex = 0
    this.data.playModeName = 'sequence'
    this.data.currentLyricIndex = 0
    this.data.lyricScrollTop = 0
    this.data.isSliderDragging = false
    audioContext.stop()
    this.update()
  }
  setCurrentTime(payload) {
    this.data.currentTime = payload
    audioContext.seek(this.data.currentTime / 1000)
    this.setIsPlaying(true)
    this.update()
  }
  setAudioStatus(payload) {
    if (payload === 'play') {
      audioContext.play()
    } else {
      audioContext.pause()
    }
  }
  setIsPlaying(payload) {
    this.data.isPlaying = payload
    this.update()
  }
  setIsSliderDragging(payload) {
    this.data.isSliderDragging = payload
    this.update()
  }
  setProgressValue(payload) {
    this.data.progressValue = payload
    this.update()
  }
  setPlayList(payload) {
    this.data.playList = payload
    this.update()
  }
  setSequencePlayList(payload) {
    this.data.sequencePlayList = payload
    this.update()
  }
  setCurrentPlayIndex(payload) {
    this.data.currentPlayIndex = payload
    this.update()
  }
  setPlayModeIndex(payload) {
    this.data.playModeIndex = payload
    this.data.playModeName = playModeNames[payload]
    this.update()
  }
  setPlayModeName(payload) {
    this.data.playModeName = payload
    this.update()
  }
}

module.exports = new Store()
