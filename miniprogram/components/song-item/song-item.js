// components/song-item/song-item.js
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },
  data: {
    artists: ''
  },

  lifetimes: {
    attached() {
      this.setData({
        artists: this.properties.itemData.ar
          .map((item) => item.name)
          .join(' / ')
      })
    }
  }
})
