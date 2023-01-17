// components/menu-item/menu-item.js
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
    onMenuItemTap() {
      const id = this.properties.itemData.id
      console.log(id)
      console.log(this.data.index)
      wx.navigateTo({
        url: `/pages/detail-songlist/detail-songlist?type=songlist&id=${id}`
      })
    }
  }
})
