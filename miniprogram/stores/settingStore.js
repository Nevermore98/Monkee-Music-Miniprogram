class Store {
  data = {
    navBarColor: '',
    isMainColorWhite: false,
    isShowNavBarTitle: false,
    isPlaying: false
  }

  setNavBarColor(payload) {
    this.data.navBarColor = payload
    this.update()
  }
  setPlayerBarColor(payload) {
    this.data.playerBarColor = payload
    this.update()
  }
  setIsMainColorWhite(payload) {
    this.data.isMainColorWhite = payload
    this.update()
  }
  setIsShowNavBarTitle(payload) {
    this.data.isShowNavBarTitle = payload
    this.update()
  }
  setIsPlaying(payload) {
    this.data.isPlaying = payload
    this.update()
  }
}

module.exports = new Store()
