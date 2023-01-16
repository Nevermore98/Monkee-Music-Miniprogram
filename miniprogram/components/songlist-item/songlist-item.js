// components/songlist-item/songlist-item.js

Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onSongListTap() {
      const id = this.properties.itemData.id
      wx.navigateTo({
        url: `/pages/detail-songlist/detail-songlist?id=${id}&type=songlist`
      })
    }
  }
})
