// components/song-item/song-item.js
import { formatArtist } from '../../utils/utils'
import getAverageColor from '../../utils/getAverageColor'
import { FastAverageColor } from 'fast-average-color'
import querySelect from '../../utils/query-select'

Component({
  properties: {
    songItemData: {
      // 有警告，明明传的是对象，可能父组件传值一开始是 null？
      type: Object,
      // type: null,
      value: {}
    },
    rank: {
      type: Number,
      value: 0
    }
  },
  data: {
    formattedArtist: '',
    rankClass: ''
  },
  lifetimes: {
    attached() {
      try {
        this.setData({
          formattedArtist: formatArtist(this.properties.songItemData.ar)
        })
        // 根据排名设置样式
        switch (this.properties.rank) {
          case 1:
            this.setData({ rankClass: 'rank-one' })
            break
          case 2:
            this.setData({ rankClass: 'rank-two' })
            break
          case 3:
            this.setData({ rankClass: 'rank-three' })
            break
          default:
            this.setData({ rankClass: '' })
        }

        // 组件里 createSelectorQuery 使用 this.
        // this.createSelectorQuery()
        //   .select('#myCanvas') // 在 WXML 中填入的 id
        //   .fields({ node: true, size: true })
        //   .exec((res) => {
        //     // Canvas 对象
        //     const canvas = res[0].node
        //     // 渲染上下文
        //     const ctx = canvas.getContext('2d')

        //     // Canvas 画布的实际绘制宽高
        //     const width = res[0].width
        //     const height = res[0].height

        //     // 初始化画布大小
        //     const dpr = wx.getWindowInfo().pixelRatio
        //     canvas.width = width * dpr
        //     canvas.height = height * dpr
        //     ctx.scale(dpr, dpr)
        //     const image = canvas.createImage()
        //     // 图片加载完成回调
        //     image.onload = () => {
        //       // 将图片绘制到 canvas 上
        //       ctx.drawImage(image, 0, 0)
        //     }
        //     // 设置图片src
        //     image.src = this.properties.songItemData.al.picUrl
        //     ctx.getImageData(0, 0, width, height)
        //   })
        // wx.canvasGetImageData({
        //   canvasId: 'myCanvas',
        //   x: 0,
        //   y: 0,
        //   width: 100,
        //   height: 100,
        //   success(res) {
        //     console.log(res.width) // 100
        //     console.log(res.height) // 100
        //     console.log(res.data instanceof Uint8ClampedArray) // true
        //     console.log(res.data.length) // 100 * 100 * 4
        //   }
        // })

        // const query = this.createSelectorQuery()
        // query.select('.song-image').boundingClientRect()
        // query.exec((res) => {
        //   console.log(res)
        // })
        // const fac = new FastAverageColor()

        // console.log(this.properties.songItemData.al.picUrl)
        // fac
        //   .getColorAsync(
        //     'http://p3.music.126.net/jSH_ikeooxveWl0BTc3Xkg==/109951166786983190.jpg'
        //   )
        //   .then((color) => {
        //     // container.style.backgroundColor = color.rgba
        //     // container.style.color = color.isDark ? '#fff' : '#000'

        //     console.log('Average color', color)
        //   })
        //   .catch((e) => {
        //     console.log(e)
        //   })
      } catch (error) {}
    }
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.songItemData.id
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`
      })
      // getAverageColor('.song-image'  ).then((res) => {
      //   console.log(res)
      // })
      // querySelect('.song-image', true).then((res) => {
      //   console.log(res)
      // })
    }
  }
})
