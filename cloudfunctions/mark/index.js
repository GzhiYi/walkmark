// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { markname, address, latitude, longitude, addressType, remark } = event
  // 新增标记操作
  if (event.mode === 'add') {
    const addRes = await db.collection('mark').add({
      data: {
        markname,
        address,
        longitude,
        latitude,
        remark,
        addressType,
        createTime: Date.parse(new Date()),
        undateTime: Date.parse(new Date()),
        nearTimes: 1,
        openId: wxContext.OPENID
      }
    })
    console.log(addRes, '新增返回')
    return {
      code: 1,
      data: addRes,
      message: '新增成功'
    }
  }
}