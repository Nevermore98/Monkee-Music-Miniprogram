// components/songlist-header/songlist-header.js
Component({
  properties: {
    songListInfo: {
      type: Object,
      value: {}
    },
    type: {
      type: String,
      value: ''
    }
  },
  methods: {
    onDescTap() {
      console.log('onDescTap')
    }
  }
})
