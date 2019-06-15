App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    // 获取手机信息以配置顶栏
    wx.getSystemInfo({
      success: res => {
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.navBarHeight = 44 + res.statusBarHeight
      }
    })
  },
  globalData: {
    statusBarHeight: 0,
    navBarHeight: 0,
    isLoading: false,
    mapKey: '1336441a0caba99fa000ea16c31a816d'
  }
})
