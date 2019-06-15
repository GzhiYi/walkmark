Page({
  data: {
    statusBarHeight: 0,
    errorMsg: '输入标记名称以继续',
    markName: '',
    address: '',
    latitude: 0,
    longitude: 0
  },
  onLoad() {
    this.setData({
      statusBarHeight: getApp().globalData.statusBarHeight
    })
  },
  chooseLocation() {
    const self = this
    wx.chooseLocation({
      success: function(res) {
        self.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  }
})