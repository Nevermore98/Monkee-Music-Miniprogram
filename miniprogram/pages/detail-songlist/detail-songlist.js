// pages/detail-songlist/detail-songlist.js
import create from 'mini-stores'
import {
  getSonglistDetail,
  getSongListAllSongs
} from '../../services/discovery'
import discoveryStore from '../../stores/discoveryStore'
import playerStore from '../../stores/playerStore'
import { pick } from '../../utils/utils'

const stores = {
  $discovery: discoveryStore,
  $player: playerStore
}

create.Page(stores, {
  data: {
    songListInfo: {},
    songListTracks: [],
    type: '',
    rankingType: '',
    id: 0
  },
  onLoad(options) {
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
    } else if (type === 'songlist') {
      // 如果是歌单类型，则清空 $discovery，避免占用内存
      stores.$discovery.data = {}
      // 不需要渲染到页面，所以无需 setData
      this.data.id = options.id
      this.setData({ type })
      this.fetchSongList()
    }
  },
  async fetchSongList() {
    // getSonglistDetail 的 tracks：如果是歌单则只有 20 条数据，排行榜数据为全部
    const res = await getSonglistDetail(this.data.id)
    const songs = await getSongListAllSongs(this.data.id)
    console.log(res)
    console.log(songs)
    // const pickArr = [
    //   'name',
    //   'description',
    //   'coverImgUrl',
    //   'updateTime',
    //   'tracks',
    //   'id',
    //   'playCount',
    //   'creator'
    // ]
    // this.data[key] = pick(res.playlist, pickArr)
    for (let i = 0; i < songs.songs.length; i++) {
      const tracksPickArr = ['name', 'id', 'ar', 'al', 'mv', 'fee', 'dt']
      songs.songs[i] = pick(songs.songs[i], tracksPickArr)
    }
    this.setData({ songListInfo: res.playlist })
    this.setData({ songListTracks: songs.songs })
  },
  onSongItemTap(e) {
    console.log('tap')
    let playList = []
    const index = e.currentTarget.dataset.index

    if (this.data.type === 'ranking') {
      playList = this.data.songListInfo.tracks
    } else {
      playList = this.data.songListTracks
    }
    console.log(index)
    stores.$player.setPlayList(playList)
    stores.$player.setPlayListIndex(index)
  }
})
