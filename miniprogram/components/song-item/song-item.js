// components/song-item/song-item.js
import { formatArtist } from '../../utils/utils'
import create from 'mini-stores'
import discoveryStore from '../../stores/discoveryStore'
import playerStore from '../../stores/playerStore'

const stores = {
  $discovery: discoveryStore,
  $player: playerStore
}

create.Component(stores, {
  properties: {
    songItemData: {
      // 有警告，明明传的是对象，可能父组件传值一开始是 null？
      type: Object,
      // type: null,
      value: {}
    },
    rank: {
      type: Number,
      value: 0
    },
    rankingType: {
      type: String,
      value: ''
    }
  },
  data: {
    formattedArtist: '',
    rankClass: ''
  },
  lifetimes: {
    attached() {
      try {
        this.setData({
          formattedArtist: formatArtist(this.properties.songItemData.ar)
        })
        // 根据排名设置样式
        switch (this.properties.rank) {
          case 1:
            this.setData({ rankClass: 'rank-one' })
            break
          case 2:
            this.setData({ rankClass: 'rank-two' })
            break
          case 3:
            this.setData({ rankClass: 'rank-three' })
            break
          default:
            this.setData({ rankClass: '' })
        }
      } catch (error) {}
    }
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.songItemData.id
      // 无法在 ranking-item 中对 song-item 绑定事件，所以在这里通过 rankingType 从 discoverStore 中获取对应榜单作为播放列表
      console.log(this.data.rankingType)
      // console.log(stores.$discovery.data[this.data.rankingType].tracks)
      const playList = stores.$discovery.data[this.data.rankingType].tracks
      const index = this.data.rank - 1
      stores.$player.setPlayList(playList)
      console.log(index)
      stores.$player.setPlayListIndex(index)

      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`
      })
    }
  }
})
