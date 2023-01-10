import querySelect from './utils/query-select'

// app.js
App({
  globalData: {
    screenWidth: 375,
    screenHeight: 667,
    menuButtonInfo: {},
    playerSwiperHeight: 0, // 播放器滑动高度
  },
  onLaunch() {
    wx.getSystemInfo().then((res) => {
      this.globalData.screenWidth = res.screenWidth
      this.globalData.screenHeight = res.screenHeight
      const playerSwiperHeight =
        this.globalData.screenHeight -
        this.globalData.menuButtonInfo.top -
        this.globalData.menuButtonInfo.height
      this.globalData.playerSwiperHeight = playerSwiperHeight
      console.log(res)
    })
    // 获取胶囊按钮信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
    console.log(menuButtonInfo)
    this.globalData.menuButtonInfo = menuButtonInfo
  }
})
