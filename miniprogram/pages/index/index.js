//index.js
const app = getApp()

Page({
  data: {
  },
  onLoad: function() {
    this.selectComponent('.nav-instance').showLoading()
    setTimeout(() => {
      this.selectComponent('.nav-instance').hideLoading()
    }, 5000)
  },
  showLoading () {
    const nav = this.selectComponent('.nav-instance')
    nav.showLoading()
  },
  hideLoading() {
    const nav = this.selectComponent('.nav-instance')
    nav.hideLoading()
  }
})
