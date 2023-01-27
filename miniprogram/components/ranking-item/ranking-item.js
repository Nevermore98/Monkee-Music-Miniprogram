// components/ranking-item/ranking-item.js
import create from 'mini-stores'
import playerStore from '../../stores/playerStore'

const stores = {
  $player: playerStore
}

create.Component(stores, {
  properties: {
    rankingItemData: {
      type: Object,
      value: {}
    },
    rankingType: {
      type: String,
      value: ''
    }
  },
  data: {
    rankingItemTracks: []
  },
  lifetimes: {
    attached() {
      const rankingItemTracks = this.properties.rankingItemData.tracks.slice(
        0,
        6
      )
      this.setData({
        rankingItemTracks
      })
    }
  },
  methods: {
    // 点击排行榜跳转到详情页面
    onRankingItemTap() {
      const rankingType = this.properties.rankingType
      console.log(rankingType)
      wx.navigateTo({
        url: `/pages/detail-songlist/detail-songlist?type=ranking&rankingType=${rankingType}`
      })
    },
    onSongItemWrapperTap(e) {
      const index = e.currentTarget.dataset.index
      const playList = this.data.rankingItemData.tracks
      stores.$player.setPlayList(playList)
      stores.$player.setSequencePlayList(playList)
      stores.$player.setCurrentPlayIndex(index)
      stores.$player.setIsPlaying(true)
    }
  }
})
