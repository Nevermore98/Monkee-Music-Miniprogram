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
  onChange(event: any) {
    this.setData({ active: event.detail })
    wx.switchTab({
      url: this.data.list[event.detail].url
    })
  },

  init() {
    const page = getCurrentPages().pop()
    console.log(page?.route)
    this.setData({
      active: this.data.list.findIndex((item) => item.url === `/${page?.route}`)
    })
  }
})
