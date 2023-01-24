import { getSongDetail, getSongUrl, getSongLyric } from '../services/player'
import parseLyric from '../utils/parseLyric'
import { formatArtist, shuffle } from '../utils/utils'
import throttle from '../utils/throttle'

const audioContext = wx.getBackgroundAudioManager()
// TODO 顺序播放图标名改为 sequence
const playModeNames = ['list', 'single', 'random']
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
      // 似乎不需要
      // audioContext.onPlay(() => {
      //   console.log('onPlay')
      //   // audioContext.play()
      //   // this.data.isPlaying = true
      //   // this.update()
      // })
      // audioContext.onPause(() => {
      //   console.log('onPause')
      //   // audioContext.pause()
      //   // this.data.isPlaying = false
      //   // this.update()
      // })
      // audioContext.onWaiting(() => {
      //   console.log('onWaiting')
      //   // audioContext.pause()
      //   // this.setIsPlaying(false)
      // })
      audioContext.onCanplay(() => {
        console.log('onCanplay')
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
    const currentLyricText = this.data.lyricInfos[index].text

    this.data.currentLyricText = currentLyricText
    this.data.currentLyricIndex = index
    this.data.lyricScrollTop = index * 80
    this.update()
  }
  // 播放暂停
  changePlayerStatus() {
    if (audioContext.paused) {
      audioContext.play()
      // this.data.isPlaying = true
      this.setIsPlaying(true)
    } else {
      audioContext.pause()
      this.data.isPlaying = false
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
        break
      case PLAY_MODE.single:
        // audioContext.loop = true
        this.data.isLoop = true
        console.log('单曲循环')
        this.setPlayList(this.data.sequencePlayList)
        this.setCurrentPlayIndex(currIndex)
        break
      case PLAY_MODE.random:
        // audioContext.loop = false
        this.data.isLoop = false
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
    this.update()
  }
  setPlayModeName(payload) {
    this.data.playModeName = payload
    this.update()
  }
}

module.exports = new Store()
