import { getSonglistDetail } from '../services/discovery'
import { pick } from '../utils/utils'

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
    // 榜单展示信息，计算属性
    // rankingInfos() {
    //   return {
    //     hotRanking: this.hotRanking,
    //     newRanking: this.newRanking,
    //     upRanking: this.upRanking,
    //     originRanking: this.originRanking
    //   }
    // }
  }
  // 获取榜单数据
  async fetchRankingAction() {
    for (const key in rankingMapId) {
      const res = await getSonglistDetail(rankingMapId[key])
      console.log('榜单数据：', res)
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
      this.data[key] = pick(res.playlist, pickArr)

      for (let i = 0; i < this.data[key].tracks.length; i++) {
        const tracksPickArr = ['name', 'id', 'ar', 'al', 'mv', 'fee', 'dt']
        this.data[key].tracks[i] = pick(this.data[key].tracks[i], tracksPickArr)
      }

      this.update()
    }
  }
}
module.exports = new Store()
