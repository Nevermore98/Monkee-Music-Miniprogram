// components/search-bar/search-bar.js
import { getDefaultSearch } from '../../services/search'

const app = getApp()
Component({
  data: {
    defaultSearch: '', // 默认搜索关键词
    searchBarTop: 0, // 搜索框距离顶部高度（与胶囊按钮对齐）
    searchValue: ''
  },
  properties: {
    searchValue: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    },
    isFocus: {
      type: Boolean,
      value: false
    },
    marginTop: {
      type: Number,
      value: 0
    },
    width: {
      type: String,
      value: 'calc(100vw - 100px)'
    },
    isShowCancel: {
      type: Boolean,
      value: false
    }
  },
  lifetimes: {
    attached() {
      this.setData({ searchBarTop: app.globalData.menuButtonInfo.top })
      this.fetchDefaultSearch()
    }
  },
  // pageLifetimes: {
  //   show() {
  //     this.setData({ searchBarTop: app.globalData.menuButtonInfo.top })
  //     this.fetchDefaultSearch()
  //   }
  // },
  methods: {
    // 获取默认搜索关键词
    async fetchDefaultSearch() {
      const res = await getDefaultSearch()
      const keyword = res.data.showKeyword
      this.setData({ defaultSearch: keyword })
    },
    onSearchTap() {
      const defaultSearch = this.data.defaultSearch
      this.triggerEvent('search-tap', { defaultSearch })
    },
    onSearchChange(e) {
      console.log(e)
      const searchValue = e.detail
      this.triggerEvent('search-change', { searchValue })
      this.setData({ searchValue: this.properties.searchValue })
    },
    onSearchAction(e) {
      const searchValue = e.detail
      // const defaultSearch = this.data.defaultSearch
      this.triggerEvent('search-action', { searchValue })
    },
    onSearchFocus(e) {
      const defaultSearch = this.data.defaultSearch
      this.triggerEvent('search-focus', { defaultSearch })
    },
    onSearchCancel() {
      // console.log()
      // if (!this.data.searchValue) {
      //   wx.navigateBack()
      // }
      this.triggerEvent('search-cancel')
    }
  }
})
