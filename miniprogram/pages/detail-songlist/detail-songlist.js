// pages/detail-songlist/detail-songlist.js
import create from 'mini-stores'
import {
  getSonglistDetail,
  getSongListAllSongs
} from '../../services/discovery'
import discoveryStore from '../../stores/discoveryStore'

const stores = {
  $discovery: discoveryStore
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
    if (type === 'ranking') {
      const rankingType = options.rankingType
      this.setData({ type })
      this.setData({ rankingType })

      // 获取排行榜部分数据
      const rankingInfo = discoveryStore.data[options.rankingType]
      this.setData({
        songListInfo: rankingInfo
      })
    } else if (type === 'songlist') {
      // 不需要渲染到页面，所以无需 setData
      this.data.id = options.id
      console.log(this.data.id)
      this.setData({ type })
      this.fetchSongList()
    }
  },
  async fetchSongList() {
    // TODO 所有歌曲
    const res = await getSonglistDetail(this.data.id)
    const songs = await getSongListAllSongs(this.data.id)
    console.log(res)
    console.log(songs)
    this.setData({ songListInfo: res.playlist })
    this.setData({ songListTracks: songs.songs })
  }
})
