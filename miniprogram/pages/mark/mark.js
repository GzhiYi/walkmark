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
    remark: '',
    isEdit: false,
    _id: ''
  },
  onLoad() {
    const self = this
    this.setData({
      statusBarHeight: getApp().globalData.statusBarHeight
    })
    if (getApp().globalData.editMark) {
      self.setData({
        isEdit: true
      })
      // 先获取坐标信息
      wx.getLocation({
        success: function(res) {
          const { markname, addressType, remark, _id } = getApp().globalData.editMark
          self.setData({
            markname,
            latitude: res.latitude,
            longitude: res.latitude,
            addressType,
            remark,
            _id
          })
        },
      })
    } else {
      self.setData({
        isEdit: false
      })
    }
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
    const { markname, address, latitude, longitude, addressType, remark, _id, isEdit } = this.data
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

    wx.showLoading({
      title: '创建中..'
    })
    // 增加标记处理
    wx.cloud.callFunction({
      name: 'mark',
      data: {
        mode: isEdit ? 'edit' : 'add',
        markname,
        address,
        longitude,
        latitude,
        remark,
        addressType,
        _id
      },
      success(res) {
        wx.hideLoading()
        wx.showToast({
          title: isEdit ? '编辑成功' : '创建成功',
          icon: 'success',
          mask: true
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      },
      fail(error) {
        console.log(error, 'edit')
        wx.showToast({
          title: isEdit ? '编辑失败' : '创建失败',
          icon: 'error',
          mask: true
        })
      }
    })
  }
})