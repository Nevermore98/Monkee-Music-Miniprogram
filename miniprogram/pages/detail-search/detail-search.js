// pages/detail-search/detail-search.js
import {
  getHotSearch,
  getSuggestSearch,
  getSearchResult
} from '../../services/search'
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/stringToNodes'

const debounceGetSuggestSearch = debounce(getSuggestSearch, 200)

Page({
  data: {
    hotKeywords: [],
    historyKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    defaultSearch: '',
    searchValue: '',
    historyKeywords: [],
    resultSongs: [],
    resultSongLists: [],
    resultVideos: [],
    isSearched: false,
    activeTabIndex: 0,
    activeTabName: 'song',
    isLoading: true,
    isNoResult: false,
    hasMore: {
      song: true,
      songlist: true,
      video: true
    },
    offsetSong: 0,
    offset: {
      song: 0,
      songlist: 0,
      video: 0
    },
    isLoadingMore: false,
    tabHasMore: true,
    songlistCount: 0
    // isLoadingMore: {
    //   song: false,
    //   songlist: false,
    //   video: false
    // }
  },
  onLoad() {
    this.fetchHotSearch()
  },
  onShow() {
    wx.getStorage({ key: 'historyKeywords' })
      .then((res) => {
        if (res) {
          this.setData({
            historyKeywords: res.data
          })
        }
      })
      .catch((err) => {})
  },
  async onScrollBottom(e) {
    console.log('isLoadingMore', this.data.isLoadingMore)
    if (this.data.isLoadingMore) return
    // if (this.data.songlistCount === this.data.resultSongLists.length) return
    if (!this.data.hasMore[this.data.activeTabName]) return
    console.log('---加载更多---')
    this.setData({ isLoadingMore: true })
    await this.fetchSearchResult()
    this.setData({ isLoadingMore: false })
    // if (this.data.isLoadingMore) return
    // if (!this.data.hasMore[this.data.activeTabName]) return
    const isLoadingMore = this.data.isLoadingMore
    const activeTabName = this.data.activeTabName
    console.log('activeTabName', activeTabName)
    console.log('hasMore', this.data.hasMore)
    console.log('offset', this.data.offset)
    console.log('isLoadingMore', this.data.isLoadingMore)

    // 触发两次？？
    // this.data.offset[activeTabName] = this.data.offset[activeTabName] + 30
    // this.fetchSearchResult()
    // if (this.data.isLoadingMore) {
    //   await this.fetchSearchResult()
    //   // this.setData({ isLoadingMore: false })
    // }

    console.log('isLoadingMore', this.data.isLoadingMore)
  },
  async fetchHotSearch() {
    const res = await getHotSearch()
    console.log(res)
    this.setData({
      hotKeywords: res.result.hots
    })
  },
  async fetchSuggestSearch() {
    const searchValue = this.data.searchValue
    const res = await debounceGetSuggestSearch(searchValue)
    console.log('搜索建议', res)
    const suggestSongs = res.result.allMatch
    if (!suggestSongs) {
      this.setData({ suggestSongs: [] })
      return
    }

    const suggestKeywords = suggestSongs.map((item) => item.keyword)
    const suggestSongsNodes = []
    for (const keyword of suggestKeywords) {
      const nodes = stringToNodes(keyword, searchValue)
      suggestSongsNodes.push(nodes)
    }
    this.setData({
      suggestSongs,
      suggestSongsNodes
      // isSearched: false
    })
  },
  async fetchSearchResult() {
    console.log('hasMore', this.data.hasMore)

    const searchValue = this.data.searchValue.trim()
    const activeTabName = this.data.activeTabName
    const offset = this.data.offset[activeTabName]
    const historyKeywords = this.data.historyKeywords

    if (this.data.searchValue.trim() === '') {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 保存搜索关键词
    if (!historyKeywords.includes(searchValue)) {
      wx.setStorageSync('historyKeywords', [searchValue, ...historyKeywords])
      this.setData({
        historyKeywords: wx.getStorageSync('historyKeywords') || []
      })
    }

    // 重置搜索结果
    if (!this.data.isSearched) {
      this.setData({
        resultSongs: [],
        resultSongLists: [],
        resultVideos: [],
        offset: {
          song: 0,
          songlist: 0,
          video: 0
        },
        hasMore: {
          song: true,
          songlist: true,
          video: true
        }
      })
    }

    this.setData({ isLoading: true })
    // this.setData({ isLoadingMore: true })

    console.log('get 时 offset', offset)
    const res = await getSearchResult(searchValue, activeTabName, offset)

    switch (activeTabName) {
      case 'song':
        console.log('歌曲数据', res)
        const newResultSongs = [
          ...this.data.resultSongs,
          ...(res.result.songs || [])
        ]
        this.setData({
          // resultSongs: res.result.songs ? res.result.songs : []
          resultSongs: newResultSongs
        })
        break
      case 'songlist':
        console.log('歌单数据', res)
        const newResultSongLists = [
          ...this.data.resultSongLists,
          ...(res.result.playlists || [])
        ]
        this.setData({
          // resultSongLists: res.result.playlists ? res.result.playlists : []
          resultSongLists: newResultSongLists
        })
        break
      case 'video':
        console.log('视频数据', res)
        const newResultVideos = [
          ...this.data.resultVideos,
          ...(res.result.videos || [])
        ]
        this.setData({
          // resultVideos: res.result.videos ? res.result.videos : []
          resultVideos: newResultVideos
        })
        break
    }
    this.setData({ isLoading: false })
    this.setData({ isSearched: true })
    // this.setData({ isLoadingMore: false })
    this.data.offset[activeTabName] = this.data.offset[activeTabName] + 30
    // TODO 后端返回的 hasMore 有问题，offset 改变后返回的数据也有重复的？
    // this.data.songlistCount = res.result.playlistCount
    this.data.hasMore[activeTabName] = res.result.hasMore
    this.setData({ tabHasMore: res.result.hasMore })
  },
  // 搜索词改变，获取搜索建议
  onSearchChange(e) {
    console.log('search-value-change')
    const searchValue = e.detail.searchValue
    this.setData({
      searchValue,
      isSearched: false
    })
    if (!searchValue.length) {
      this.setData({ suggestSongs: [], resultSongs: [] })
      return
    }
    this.fetchSuggestSearch()
  },
  // 搜索栏按回车时触发
  onSearchAction(e) {
    const defaultSearch = this.data.defaultSearch
    if (!this.data.searchValue) {
      this.setData({
        searchValue: defaultSearch
      })
    }

    console.log('搜索', this.data.searchValue)
    this.fetchSearchResult()
  },
  // 搜索栏聚焦时触发
  onSearchFocus(e) {
    console.log('focus')
    const defaultSearch = e.detail.defaultSearch
    this.setData({ defaultSearch })
  },
  // 取消按钮点击时，如果没有搜索内容则返回上一页，否则清空搜索内容
  onSearchCancel() {
    console.log('cancel')
    if (this.data.searchValue === '') {
      wx.navigateBack()
    }
    this.setData({
      searchValue: '',
      suggestSongs: [],
      resultSongs: [],
      resultSongLists: [],
      resultVideos: [],
      isSearched: false,
      activeTabName: 'song',
      offset: {
        song: 0,
        songlist: 0,
        video: 0
      },
      hasMore: {
        song: true,
        songlist: true,
        video: true
      }
    })
  },
  // 关键词点击，包括搜索建议、热门搜索，历史搜索
  onKeywordTap(e) {
    console.log('keyword-tap')
    const index = e.currentTarget.dataset.index

    const keyword =
      e.currentTarget.dataset.keyword || this.data.historyKeywords[index]
    this.setData({
      searchValue: keyword,
      activeTabName: 'song'
    })
    this.fetchSearchResult()
  },
  // 标签页切换
  onTabChange(e) {
    console.log('tab change')
    const activeTabName = e.detail.name
    this.setData({ activeTabName })
    this.setData({ tabHasMore: this.data.hasMore[activeTabName] })
    if (this.data.offset[activeTabName] === 0) {
      this.fetchSearchResult()
    }
  },
  // 标签页点击
  onTabClick(e) {
    console.log('tab click')
    const activeTabName = e.detail.name
    this.setData({ activeTabName })
  },
  // 删除历史搜索
  onDeleteHistory() {
    wx.removeStorageSync('historyKeywords')
    this.setData({
      historyKeywords: []
    })
  }
})
