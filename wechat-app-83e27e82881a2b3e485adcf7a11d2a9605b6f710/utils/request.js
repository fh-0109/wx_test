const app = getApp()

export const request = (method = 'GET', contentType='application/x-www-form-urlencoded') => (url, data, token='') => {
  let header = {
    'Authorization': token ,
    'content-type': contentType
  } 
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header,

      success: function(res) {
        
        if(res.statusCode == 403) {
          wx.showModal({
            title: '用户身份已过期',
            content: '请重新登录',
            showCancel: false,
            complete: function() {
              app.clearCache()
              wx.redirectTo({
                url: '/pages/more/login'
              });
            }
          })
        }
        else if(res.statusCode == 401) {
          console.log(res)
          wx.showModal({
            title: '没有权限',
            content: '目前不能使用该功能',
            showCancel: false
          })
        }

        else if(res.statusCode == 200) {
          if (res.data.status === 200) {
            resolve(res.data)
          } else if (res.data.status === 402) {
            wx.showModal({
              title: '密码错误',
              content: '忘记密码请到教务网更改',
              showCancel: false,
              complete: function() {
                app.clearCache()
                wx.redirectTo({
                  url: '/pages/more/login'
                });
              }
            })
  
          } else if (res.data.status === 405) {
            wx.showModal({
              title: '无法登录',
              content: '请稍后重试',
              showCancel: false
            })
          } else if (res.data.status === 406) {
            wx.showModal({
              title: '未完成评估',
              content: '请到教务网完成评估',
              showCancel: false
            })
          } else if (res.data.status === 408) {
            wx.showModal({
              title: '账号已被用户绑定',
              content: '如需绑定请点右上角反馈',
              showCancel: false
            })
            
          } else if (res.data.status === 500) {
            wx.showModal({
              title: '请重试',
              content: '服务器出了点问题',
              showCancel: false
            })
          } else {
            reject(res);
          }

        }else {
          reject(res)
        }

      },

      fail: function(err) {
        console.error(err)
        wx.getNetworkType({
          success (res) {
            if(res.networkType == "none"){
              wx.showModal({
                title: '请检查网络',
                content: '你处于没有网络的异次元',
              })
            }else {
              wx.showModal({
                title: '网络繁忙',
                content: '服务器喘不过气啦',
              })

            }
          }
        })


      },

      complete() {
        
        console.log('request ' + url + ' complete.'+ 'header=' + JSON.stringify(header) + ' data=' + JSON.stringify(data))
      }
    });
  })
}

const GET = request('GET');
const POST = request("POST");
const POST_JSON = request("POST", "application/json")
module.exports = {
  GET,
  POST,
  POST_JSON
}