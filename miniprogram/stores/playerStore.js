class Store {
  data = {
    playList: [], // 播放列表
    playListIndex: 0 // 播放列表的歌曲索引
  }
  setPlayList(payload) {
    this.data.playList = payload
    this.update()
  }
  setPlayListIndex(payload) {
    this.data.playListIndex = payload
    this.update()
  }
}

module.exports = new Store()
