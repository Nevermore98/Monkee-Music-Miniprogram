// components/ranking-item/ranking-item.js
Component({
  properties: {
    rankingItemData: {
      type: Object,
      value: {}
    },
    rankingType: {
      type: String,
      value: ''
    }
  },
  methods: {
    // 点击排行榜跳转到详情页面
    onRankingItemTap() {
      const rankingType = this.properties.rankingType
      wx.navigateTo({
        url: `/pages/detail-songlist/detail-songlist?type=ranking&rankingType=${rankingType}`
      })
    }
  }
})
