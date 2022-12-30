// app.js
App({
  globalData: {
    screenWidth: 375,
    screenHeight: 667
  },
  onLaunch() {
    wx.getSystemInfo().then((res) => {
      this.globalData.screenWidth = res.screenWidth
      this.globalData.screenHeight = res.screenHeight
    })
  }
})
