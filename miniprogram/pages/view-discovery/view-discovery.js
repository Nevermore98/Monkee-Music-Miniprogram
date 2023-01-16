import {
  getBanner,
  getSongList,
  getRecommendSongList
} from '../../services/discovery'
import discoveryStore from '../../stores/discoveryStore'
import playerStore from '../../stores/playerStore'
import create from 'mini-stores'
import querySelect from '../../utils/query-select'
import throttle from '../../utils/throttle'

const querySelectThrottle = throttle(querySelect, 100)
const app = getApp()

const stores = {
  // $discovery: discoveryStore,
  $player: playerStore
}

create.Page(stores, {
  data: {
    banners: [], // 轮播图
    bannerHeight: 0, // 轮播图高度
    hotSongList: [], // 热门歌单
    recommendSongList: [], // 推荐歌单
    rankingInfos: {}, // 榜单展示信息
    // isRankingEmpty: true, // 榜单是否为空
    // TODO 有问题
    isBannersEmpty: true, // 轮播图是否为空
    paddingBottom: 0
  },
  onShow() {
    this.getTabBar().init()
  },
  async onLoad() {
    this.fetchBanners()
    this.fetchHotSongList()

    await discoveryStore.fetchRankingAction()
    // stores.$player.playSongAction(1807799505)

    this.setData({
      rankingInfos: {
        hotRanking: discoveryStore.data.hotRanking,
        newRanking: discoveryStore.data.newRanking,
        upRanking: discoveryStore.data.upRanking,
        originRanking: discoveryStore.data.originRanking
      }
      // paddingBottom: env(safe-area-inset-bottom)+50px
    })
    // this.setData({ isRankingEmpty: false })
  },
  onReady() {
    // 搜索框与胶囊按钮的对齐
    this.setData({ searchBarTop: app.globalData.menuButtonInfo.top })
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
    this.setData({ isBannersEmpty: false })
  },
  // 获取热门歌单
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
  // 点击搜索框跳转页面
  onSearchTap() {
    wx.navigateTo({ url: '/pages/detail-search/detail-search' })
  },
  // 图片加载完成后，图片 mode="widthFix"，计算出轮播图的高度
  onBannerImageLoad(e) {
    querySelectThrottle('.banner-image').then((res) => {
      this.setData({ bannerHeight: res[0].height })
    })
  }
})
