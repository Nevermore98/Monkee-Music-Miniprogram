Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onItemTap() {
      const { itemData } = this.properties
      wx.navigateTo({
        url: `/pages/detail-video/detail-video?id=${itemData.id}`
      })
    }
  }
})
