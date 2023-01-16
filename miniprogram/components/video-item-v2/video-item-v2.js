// components/video-item-v2/video-item-v2.js
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onRelatedTap(e) {
      const vid = e.currentTarget.dataset.vid
      const NumberReg = /^\d+$/
      // 纯数字为 MV，非纯数字为视频
      if (NumberReg.test(vid)) {
        wx.navigateTo({
          url: `/pages/detail-video/detail-video?id=${vid}`
        })
      } else {
        wx.navigateTo({
          url: `/pages/detail-video/detail-video?vid=${vid}`
        })
      }
    }
  }
})
