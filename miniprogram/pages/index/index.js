//index.js
const app = getApp()

Page({
  data: {
    markList: [],
    loaded: false,
    greetWord: '',
    showMarkIndex: 0,
    showMenuDialog: false,
    showAuthDialog: false,
    userInfo: {}
  },
  onLoad: function() {
    
  },
  onShow() {
    const self = this
    // 需要清空标记的编辑数据
    getApp().globalData.editMark = null
    wx.getSetting({
      success(res) {
        // 判断用户个人信息授权情况
        if (!res.authSetting['scope.userInfo']) {
          self.setData({
            showAuthDialog: true
          })
        } else {
          wx.getUserInfo({
            success(event) {
              self.setData({
                userInfo: event.userInfo
              })
              getApp().globalData.userInfo = event.userInfo
            }
          })
        }
      }
    })
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
        self.setData({
          showLocationDialog: false
        })
        wx.cloud.callFunction({
          name: 'mark',
          data: {
            mode: 'get',
            currentLatitude: res.latitude,
            currentLongtitude: res.longitude
          },
          success(res) {
            self.setData({
              markList: res.result.data,
              loaded: true
            })
          },
          complete() {
            self.selectComponent('.nav-instance').hideLoading()
          }
        })
      },
      fail(error) {
        if (error.errMsg === 'getLocation:fail auth deny' || error.errMsg === 'getLocation:fail authorize no response') {
          self.setData({
            showAuthDialog: false,
            showLocationDialog: true
          })
        }
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
  },
  showAuth() {
    this.setData({
      showAuthDialog: !this.data.showAuthDialog
    })
  },
  showLocation() {
    this.setData({
      showLocationDialog: !this.data.showLocationDialog
    })
  },
  onGotUserInfo(event) {
    const self = this
    if (event.detail.errMsg === 'getUserInfo:ok') {
      getApp().globalData.userInfo = event.detail.userInfo
      self.setData({
        userInfo: event.detail.userInfo,
        showAuthDialog: false
      })
    }
  },
  // 编辑标记
  goToEdit() {
    getApp().globalData.editMark = this.data.markList[this.data.showMarkIndex]
    this.setData({
      showMenuDialog: false
    })
    wx.navigateTo({
      url: '/pages/mark/mark'
    })
  },
  // 删除标记
  deleteMark() {
    const self = this
    self.setData({
      showMenuDialog: false
    })
    wx.cloud.callFunction({
      name: 'mark',
      data: {
        mode: 'delete',
        _id: this.data.markList[this.data.showMarkIndex]._id
      },
      success() {
        self.getMarkList()
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          mask: true
        })
        self.setData({
          showMarkIndex: 0
        })
      },
      fail() {
        wx.showToast({
          title: '删除失败',
          icon: 'error',
          mask: true
        })
        self.setData({
          showMenuDialog: true
        })
      }
    })
  },
  goTo(event) {
    const { page } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/${page}/${page}`
    })
  },
  onShareAppMessage() {
    return {
      title: '去过的地方还要看地图怎么走？做个标记就行！',
      path: '/pages/index/index',
      imageUrl: '../../images/share-banner.png'
    }
  }
})
