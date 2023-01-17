// components/nav-bar/nav-bar.js
import create from 'mini-stores'
import settingStore from '../../stores/settingStore'

const stores = {
  $setting: settingStore
}

create.Component(stores, {
  options: {
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    backGround: {
      type: String,
      value: ''
    },
    isTitleCenter: {
      type: Boolean,
      value: true
    }
  },
  data: {
    navBarTop: 0,
    navBarHeight: 0
  },
  attached() {
    this.setData({ navBarTop: app.globalData.menuButtonInfo.top })
    this.setData({ navBarHeight: app.globalData.menuButtonInfo.height })
  },
  methods: {
    onLeftTap() {
      this.triggerEvent('left-tap')
    }
  }
})
const app = getApp()
