// pages/mark/mark.js
const amapFile = require('../../src/amap-wx.js')

Page({
  data: {
    statusBarHeight: 0,
    errorMsg: '输入标记名称以继续',
    markName: '标记名称啊',
    position: ''
  },
  onLoad() {
    this.setData({
      statusBarHeight: getApp().globalData.statusBarHeight
    })
    this.getLocation()

  },
  getLocation() {
    const self = this
    const myMap = new amapFile.AMapWX({ key: getApp().globalData.mapKey })
    myMap.getRegeo({
      success: function (data) {
        //成功回调
        console.log(data)
        self.setData({
          position: data[0].name
        })
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  }
})