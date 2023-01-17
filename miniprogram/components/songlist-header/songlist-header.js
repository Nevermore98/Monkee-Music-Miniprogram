// components/songlist-header/songlist-header.js
import getMainColor from '../../utils/getMainColor'
import create from 'mini-stores'
import settingStore from '../../stores/settingStore'

const stores = {
  $setting: settingStore
}

create.Component(stores, {
  properties: {
    songListInfo: {
      type: Object,
      value: {}
      // observer: function (newVal, oldVal) {
      //   // 判断空对象
      //   if (Object.keys(newVal).length === 0) return
      //   const imageUrl = newVal.coverImgUrl
      //   this.getCanvasMainColor(imageUrl).then((res) => {
      //     console.log(res)
      //     this.setData({ navBarColor: res })
      //   })
      // }
    },
    type: {
      type: String,
      value: ''
    }
  },
  data: {
    navBarColor: '',
    isLoop: false
  },
  // 数据监听器 observers 和属性的 observer 相比，具有更好的性能
  observers: {
    'songListInfo.coverImgUrl': function (val) {
      if (!val) return
      this.getCanvasMainColor(val).then((res) => {
        console.log(res)
        const { color, isColorWhite } = res
        this.setData({ navBarColor: color })
        stores.$setting.setNavBarColor(color)
        stores.$setting.setIsMainColorWhite(isColorWhite)
      })
    }
  },
  methods: {
    onDescTap() {
      console.log('onDescTap')
    },
    onNavBackTap() {
      wx.navigateBack()
    },
    getCanvasMainColor(imgPath) {
      return new Promise((resolve) => {
        const query = this.createSelectorQuery()
        query
          .select('#myCanvas')
          .fields({
            node: true,
            size: true
          })
          .exec((res) => {
            console.log(res)
            getMainColor(res, imgPath).then((ret) => {
              resolve(ret)
            })
          })
      })
    }
  }
})
