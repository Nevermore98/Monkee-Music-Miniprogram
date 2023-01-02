// components/nav-bar/nav-bar.js
const app = getApp()

Component({
  options: {
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: ''
    }
  },
  data: {
    navBarTop: 0,
    navBarHeight: 0
  },
  attached() {
    this.setData({ navBarTop: app.globalData.menuButtonInfo.top })
    this.setData({ navBarHeight: app.globalData.menuButtonInfo.height })
  }
})
