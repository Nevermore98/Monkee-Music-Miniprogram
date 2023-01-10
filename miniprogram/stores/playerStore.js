import { getSongDetail, getSongUrl, getSongLyric } from '../services/player'
import parseLyric from '../utils/parseLyric'
import { formatArtist, shuffle } from '../utils/utils'
import throttle from '../utils/throttle'

const innerAudioContext = wx.createInnerAudioContext()
// TODO 顺序播放图标名改为 sequence
const playModeNames = ['list', 'single', 'random']
export const PLAY_MODE = { sequence: 0, single: 1, random: 2 }

class Store {
  data = {
    currentSong: {},
    songUrl: '',
    formattedArtist: '',

    currentTime: 0, // 当前播放时间（毫秒）
    durationTime: 0, // 歌曲总时长（毫秒）
    progressValue: 0, // 进度条百分值

    isFirstPlay: true,
    isPlaying: false,

    playModeIndex: PLAY_MODE.sequence,
    // TODO 顺序播放图标名改为 sequence
    playModeName: 'list',

    lyricInfos: {},
    currentLyricText: '',
    currentLyricIndex: -1,
    lyricScrollTop: 0,

    playList: [], // 播放列表
    sequencePlayList: [], // 顺序播放列表
    currentPlayIndex: 0 // 当前播放歌曲在播放列表中的索引
  }
  async playSongAction(id) {
    this.data.currentSong = {}
    this.data.durationTime = 0
    this.data.currentLyricIndex = 0
    this.data.currentLyricText = ''
    this.data.lyricInfos = []

    const songDetail = await getSongDetail(id)
    this.data.currentSong = songDetail.songs[0]
    this.data.formattedArtist = formatArtist(this.data.currentSong.ar)
    console.log(songDetail.songs[0])

    const songUrl = await getSongUrl(id)
    this.data.songUrl = songUrl.data[0].url
    this.data.durationTime = songUrl.data[0].time

    const songLyric = await getSongLyric(id)
    this.data.lyricInfos = parseLyric(songLyric.lrc.lyric)

    // 设置歌曲 src
    innerAudioContext.stop()
    innerAudioContext.src = this.data.songUrl
    // innerAudioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // innerAudioContext.autoplay = true

    if (this.data.isFirstPlay) {
      this.data.isFirstPlay = false

      const updateProgress = () => {
        this.data.currentTime = innerAudioContext.currentTime * 1000
        this.data.progressValue =
          (this.data.currentTime / this.data.durationTime) * 100
        this.update()
      }
      // TODO 滑动条 bug
      const throttleUpdateProgress = throttle(updateProgress, 100)
      innerAudioContext.onTimeUpdate(() => {
        // if (!this.data.isSliderDragging && !this.data.isWaiting) {
        //   throttleUpdateProgress()
        // }
        throttleUpdateProgress()

        this.matchLyric()
        this.update()
      })

      innerAudioContext.onWaiting(() => {
        innerAudioContext.pause()
      })
      innerAudioContext.onCanplay(() => {
        innerAudioContext.play()
      })
      innerAudioContext.onEnded(() => {
        if (innerAudioContext.loop) return
        this.changePlaySong(1)
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
      if (lineLyric.lineTime > innerAudioContext.currentTime * 1000) {
        index = i - 1
        break
      }
    }
    if (index === this.data.currentLyricIndex) return
    const currentLyricText = this.data.lyricInfos[index].text

    this.data.currentLyricText = currentLyricText
    this.data.currentLyricIndex = index
    this.data.lyricScrollTop = index * 80
    this.update()
  }
  // 播放暂停
  changePlayerStatus() {
    if (innerAudioContext.paused) {
      innerAudioContext.play()
      this.data.isPlaying = true
    } else {
      innerAudioContext.pause()
      this.data.isPlaying = false
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
        innerAudioContext.loop = false
        this.setPlayList(sequencePlayList)
        this.setCurrentPlayIndex(currIndex)
        break
      case PLAY_MODE.single:
        innerAudioContext.loop = true
        this.setPlayList(this.data.sequencePlayList)
        this.setCurrentPlayIndex(currIndex)
        break
      case PLAY_MODE.random:
        innerAudioContext.loop = false

        const randomPlayList = shuffle(sequencePlayList, currSongId)
        this.setPlayList(randomPlayList)
        this.setCurrentPlayIndex(0)
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

    console.log(index)
    const newSong = this.data.playList[index]
    this.setCurrentPlayIndex(index)
    this.playSongAction(newSong.id)
    this.setIsPlaying(true)

    this.update()
  }
  // 进度条改变当前时间
  setCurrentTimeByProgress(payload, isSeek) {
    this.data.currentTime = (payload / 100) * this.data.durationTime
    if (isSeek) {
      innerAudioContext.seek(this.data.currentTime / 1000)
      this.setIsPlaying(true)
    }
    console.log('setCurrentTime')
    // TODO 不会暂停？
    // 延时，避免报错，详见：https://segmentfault.com/q/1010000007130230
    innerAudioContext.pause()
    setTimeout(() => {
      innerAudioContext.play()
      console.log('setTimeout')
    }, 1000)
    this.update()
  }
  setCurrentTime(payload) {
    this.data.currentTime = payload
    innerAudioContext.seek(this.data.currentTime / 1000)
    this.setIsPlaying(true)
    this.update()
  }
  setIsPlaying(payload) {
    this.data.isPlaying = payload
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
    this.update()
  }
  setPlayModeName(payload) {
    this.data.playModeName = payload
    this.update()
  }
}

module.exports = new Store()
