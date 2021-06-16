// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    const result = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value: Buffer.from(event.img)   // 这里必须要将小程序端传过来的进行Buffer转化,否则就会报错,接口异常
      }
      
    })
    return { status: 200, message: 'ok', data: result }

  } catch (err) {
    // 错误处理
    return { status: 500, message: '云函数调用错误', data: err }

  }

}