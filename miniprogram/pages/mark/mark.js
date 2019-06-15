Page({
  data: {
    statusBarHeight: 0,
    errorMsg: '',
    markname: '',
    address: '',
    latitude: 0,
    longitude: 0,
    addressType: '',
    showTypeDialog: false,
    remark: ''
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
        console.log(res)
        // 选择地图有可能未正确选到
        const { address, latitude, longitude, name } = res
        if (!address && !name) {
          self.showValidateMsg('未选到地点哦，可再重新选择')
        }
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
      addressType: event.target.dataset.type
    })
    this.showTypeList()
  },
  showValidateMsg(errorMsg) {
    const self = this
    self.setData({
      errorMsg
    })
    setTimeout(() => {
      self.setData({
        errorMsg: ''
      })
    }, 2000)
  },
  onInputChange(event) {
    this.setData({
      [`${event.target.dataset.name}`]: event.detail.value
    })
  },
  // 保存标记
  save() {
    const { markname, address, latitude, longitude, addressType, remark } = this.data
    const self = this
    // 表单基本验证
    if (!markname) {
      this.showValidateMsg('未填写标记名称')
      return false
    }
    if (!address) {
      this.showValidateMsg('未选择地点')
      return false
    }
    if (!addressType) {
      this.showValidateMsg('未选择类别')
      return false
    }
    if (!remark) {
      this.showValidateMsg('未填写记录')
      return false
    }
    const nav = this.selectComponent('.nav-instance')
    nav.showLoading()
    // 增加标记处理
    wx.cloud.callFunction({
      name: 'mark',
      data: {
        mode: 'add',
        markname,
        address,
        longitude,
        latitude,
        remark,
        addressType
      },
      success(res) {
        console.log(res)
      },
      complete() {
        const nav = self.selectComponent('.nav-instance')
        nav.hideLoading()
      },
    })
  }
})