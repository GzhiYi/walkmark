// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.mode === 'get') {
    const getRes = await db.collection('type').get()
    
    return {
      code: 1,
      data: getRes.data.sort((a, b) => { return a.order - b.order }),
      message: '列表获取成功'
    }
  }
  
}