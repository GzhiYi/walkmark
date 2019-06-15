Page({
  data: {
    statusBarHeight: 0,
    errorMsg: '',
    markName: '',
    address: '',
    latitude: 0,
    longitude: 0,
    positionType: '',
    showTypeDialog: false
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
  },
  showTypeList() {
    this.setData({
      showTypeDialog: !this.data.showTypeDialog
    })
  },
  selectType(event) {
    this.setData({
      positionType: event.target.dataset.type
    })
    this.showTypeList()
  }
})