// pages/detail-songlist/detail-songlist.js
import create from 'mini-stores'
import { getSonglistDetail } from '../../services/discovery'
import discoveryStore from '../../stores/discoveryStore'
import { pick } from '../../utils/utils'

const stores = {
  $discovery: discoveryStore
}

create.Page(stores, {
  data: {
    songListInfo: {},
    // songListTracks: [],
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
      const pickArr = [
        'name',
        'description',
        'coverImgUrl',
        'updateTime',
        'tracks',
        'id',
        'playCount',
        'creator'
      ]
      this.setData({
        songListInfo: pick(rankingInfo, pickArr)
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
    const res = await getSonglistDetail(this.data.id)
    console.log(res)
    this.setData({ songListInfo: res.playlist })
  }
})
