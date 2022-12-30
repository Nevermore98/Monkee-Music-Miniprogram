import { getSonglistDetail } from '../services/discovery'

class Store {
  data = {
    hotRanking: [],
    hotRankingSlice: []
  }

  async fetchHotRankingAction() {
    const res = await getSonglistDetail(3778678)
    this.data.hotRanking = res.playlist.tracks
    this.data.hotRankingSlice = res.playlist.tracks.slice(0, 6)
    this.update()
  }
}

module.exports = new Store()
