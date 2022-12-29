import { getDefaultSearch, getBanner } from '../../services/discovery'
import querySelect from '../../utils/query-select'
import throttle from '../../utils/throttle'

const querySelectThrottle = throttle(querySelect, 100)
const app = getApp()

Page({
  data: {
    searchValue: '',
    defaultSearch: '', // 默认搜索关键词
    banners: [], // 轮播图
    bannerHeight: 0, // 轮播图高度
    searchBarTop: 0
  },
  onShow() {
    this.getTabBar().init()
  },
  onLoad() {
    this.fetchDefaultSearch()
    this.fetchBanners()
  },
  onReady() {
    // 搜索框与胶囊按钮的对齐
    const res = wx.getMenuButtonBoundingClientRect()
    this.setData({ searchBarTop: res.top })

    // 获取不到自定义组件的元素？
    // this.createSelectorQuery()
    //   .select('.van-search')
    //   .boundingClientRect((rect) => {
    //     console.log('rect', rect)
    //   })
    //   .exec((rect) => {
    //     console.log('rect', rect)
    //   })
  },
  // 点击搜索框跳转页面
  onSearchTap() {
    wx.navigateTo({ url: '/pages/detail-search/detail-search' })
  },
  // 图片加载完成后，图片 mode="widthFix"，计算出轮播图的高度
  onBannerImageLoad(e) {
    querySelectThrottle('.banner-image').then((res) => {
      this.setData({ bannerHeight: res[0].height })
    })
  },
  // 获取默认搜索关键词
  async fetchDefaultSearch() {
    const res = await getDefaultSearch()
    this.setData({ defaultSearch: res.data.showKeyword })
  },
  // 获取轮播图
  async fetchBanners() {
    const res = await getBanner()
    this.setData({ banners: res.banners })
  }
})
