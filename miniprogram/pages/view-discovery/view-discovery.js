import {
  getDefaultSearch,
  getBanner,
  getSonglistDetail,
  getSongList,
  getRecommendSongList
} from '../../services/discovery'
import discoveryStore from '../../stores/discoveryStore'
import create from 'mini-stores'
// const create = require('mini-stores')
import querySelect from '../../utils/query-select'
import throttle from '../../utils/throttle'

const querySelectThrottle = throttle(querySelect, 100)
const app = getApp()

const stores = {
  $discovery: discoveryStore
}

create.Page(stores, {
  data: {
    searchValue: '',
    defaultSearch: '', // 默认搜索关键词
    banners: [], // 轮播图
    bannerHeight: 0, // 轮播图高度
    searchBarTop: 0, // 搜索框距离顶部高度（与胶囊按钮对齐）
    hotRanking: [], // 热门歌曲排行榜
    hotRankingSlice: [], // 热门歌曲前六截取
    hotSongList: [], // 热门歌单
    recommendSongList: []
  },
  onShow() {
    this.getTabBar().init()
  },
  onLoad() {
    this.fetchDefaultSearch()
    this.fetchBanners()
    this.fetchHotSongList()

    discoveryStore.fetchHotRankingAction()
    // this.fetchHotRanking()
  },
  onReady() {
    // 搜索框与胶囊按钮的对齐
    const res = wx.getMenuButtonBoundingClientRect()
    console.log(res)
    this.setData({ searchBarTop: res.top })
    this.setData({ searchBarHeight: res.height })

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
  // 获取默认搜索关键词
  async fetchDefaultSearch() {
    const res = await getDefaultSearch()
    this.setData({ defaultSearch: res.data.showKeyword })
  },
  // 获取轮播图
  async fetchBanners() {
    const res = await getBanner()
    this.setData({ banners: res.banners })
  },
  async fetchHotSongList() {
    getSongList().then((res) => {
      console.log(res)
      this.setData({ hotSongList: res.playlists })
    })
    getRecommendSongList().then((res) => {
      console.log(res)
      this.setData({ recommendSongList: res.result })
    })
  },
  // 获取热歌榜
  // async fetchHotRanking() {
  //   const res = await getSonglistDetail(3778678)
  //   console.log(res)
  //   this.setData({ hotRanking: res.playlist.tracks })
  //   this.setData({ hotRankingSlice: res.playlist.tracks.slice(0, 6) })
  // },
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
  // 点击排行榜跳转到详情页面
  onRankingTap() {
    wx.navigateTo({
      url: '/pages/detail-ranking/detail-ranking'
    })
  }
})
