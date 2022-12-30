// components/menu-area/menu-area.js
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    menuData: {
      type: Array,
      value: []
    }
  },
  methods: {
    onMenuMoreClick() {
      wx.navigateTo({
        url: '/pages/detail-more/detail-more'
      })
    }
  }
})
