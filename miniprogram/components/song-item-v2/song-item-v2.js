// components/song-item-v2/song-item-v2.js
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    }
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.itemData.id
      console.log(id)
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`
      })
      this.setData({ isShowPlayer: true })
    }
  }
})
