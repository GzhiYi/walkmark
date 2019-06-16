// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数

// 根据两个经纬度计算直线距离
// lat1: 当前定位点的经度, lng1：当前定位点的纬度；
// lat2：计算点的经度, lng2：计算点的纬度
function calDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s.toFixed(2);
}


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
        openId: wxContext.OPENID,
        deleted: false
      }
    })
    console.log(addRes, '新增返回')
    return {
      code: 1,
      data: addRes,
      message: '新增成功'
    }
  }
  // 获取标记列表哦
  if (event.mode === 'get') {
    const { currentLatitude, currentLongtitude } = event
    const getRes = await db.collection('mark')
    .limit(10)
    .where({
      openId: wxContext.OPENID,
      deleted: false
    })
    .get()
    getRes.data.forEach(mark => {
      mark.distance = calDistance(currentLatitude, currentLongtitude, mark.latitude, mark.longitude)
    })
    return {
      code: 1,
      data: getRes.data.sort((a, b) => { return Number(a.distance) - Number(b.distance) }),
      message: '获取列表成功'
    }
  }
}