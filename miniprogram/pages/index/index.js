//index.js
const app = getApp()

Page({
  data: {
    markList: [],
    loaded: false,
    greetWord: '',
    showMarkIndex: 0,
    showMenuDialog: false
  },
  onLoad: function() {
  },
  onShow() {
    this.getMarkList()
    const hour = new Date().getHours()
    let word = ''
    if (hour < 6) { word = "凌晨好" }
    else if (hour < 9) { word = "早上好" }
    else if (hour < 12) { word = "上午好" }
    else if (hour < 14) { word = "中午好" }
    else if (hour < 17) { word = "下午好" }
    else if (hour < 19) { word = "傍晚好" }
    else if (hour < 22) { word = "晚上好" }
    else { word = "夜猫子，早点休息！"  } 
    this.setData({
      greetWord: word
    })
  },
  getMarkList() {
    const self = this
    self.selectComponent('.nav-instance').showLoading()
    // 获取当前位置的经纬度！
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log("lalal", {
          mode: 'get',
          currentLatitude: res.latitude,
          currentLongtitude: res.longitude
        })
        wx.cloud.callFunction({
          name: 'mark',
          data: {
            mode: 'get',
            currentLatitude: res.latitude,
            currentLongtitude: res.longitude
          },
          success(res) {
            console.log(res)
            self.setData({
              markList: res.result.data,
              loaded: true
            })
          },
          complete() {
            self.selectComponent('.nav-instance').hideLoading()
          }
        })
      }
    })
  },
  showLoading () {
    const nav = this.selectComponent('.nav-instance')
    nav.showLoading()
  },
  hideLoading() {
    const nav = this.selectComponent('.nav-instance')
    nav.hideLoading()
  },
  goNext() {
    const markListLength = this.data.markList.length
    this.setData({
      showMarkIndex: this.data.showMarkIndex === markListLength - 1 ? 0 : this.data.showMarkIndex + 1
    })
  },
  goPre() {
    const markListLength = this.data.markList.length
    this.setData({
      showMarkIndex: this.data.showMarkIndex === 0 ? markListLength - 1 : this.data.showMarkIndex - 1
    })
  },
  showMenu() {
    this.setData({
      showMenuDialog: !this.data.showMenuDialog
    })
  }
})
