Page({
  data: {
    active: 0,
    list: [
      {
        icon: 'icon-discovery',
        text: '发现',
        url: '/pages/view-discovery/view-discovery'
      },
      {
        icon: 'icon-music',
        text: '我的',
        url: '/pages/view-mine/view-mine'
      },
      {
        icon: 'icon-video',
        text: '视频',
        url: '/pages/view-video/view-video'
      }
    ]
  },

  // 不放在 methods 里
  onChange(event) {
    this.setData({ active: event.detail })
    wx.switchTab({
      url: this.data.list[event.detail].url
    })
  },

  // 初始化，每个页面 onShow 时调用，根据路由设置 active
  init() {
    const page = getCurrentPages().pop()
    console.log(page.route)
    this.setData({
      active: this.data.list.findIndex((item) => item.url === `/${page.route}`)
    })
  }
})
