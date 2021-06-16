// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    const result = await cloud.openapi.security.msgSecCheck({
      content: event.msg,
    })
    return { status: 200, message: 'ok', data: result }

  } catch (err) {
    // 错误处理
    return { status: 500, message: '云函数调用错误', data: err }
  }

}