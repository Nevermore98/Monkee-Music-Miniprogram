import { getSonglistDetail } from '../services/discovery'

export const rankingMapId = {
  hotRanking: 3778678,
  newRanking: 3779629,
  originRanking: 2884035,
  upRanking: 19723756
}

export const rankingMapName = {
  hotRanking: '热歌榜',
  newRanking: '新歌榜',
  originRanking: '原创榜',
  upRanking: '飙升榜'
}

class Store {
  data = {
    hotRanking: [],
    newRanking: [],
    upRanking: [],
    originRanking: []
    // hotRankingSlice: [],
    // newRankingSlice: [],
    // upRankingSlice: [],
    // originRankingSlice: [],
    // 榜单展示信息，计算属性
    // rankingInfos() {
    //   return {
    //     hotRanking: this.hotRanking,
    //     newRanking: this.newRanking,
    //     upRanking: this.upRanking,
    //     originRanking: this.originRanking
    //   }
    // }
    // rankingSliceInfos() {
    //   return {
    //     hotRanking: this.hotRanking,
    //     newRanking: this.newRanking,
    //     upRanking: this.upRanking,
    //     originRanking: this.originRanking
    //   }
    // }
  }
  // async fetchHotRankingAction() {
  //   const res = await getSonglistDetail(3778678)
  //   this.data.hotRanking = res.playlist.tracks
  //   this.data.hotRankingSlice = res.playlist.tracks.slice(0, 6)
  //   this.update()
  // }
  async fetchRankingAction() {
    for (const key in rankingMapId) {
      const res = await getSonglistDetail(rankingMapId[key])
      console.log(res)
      this.data[key] = res.playlist
      // this.data[key + 'Slice'] = res.playlist.tracks.slice(0, 6)
      this.update()
    }
  }
}
module.exports = new Store()
