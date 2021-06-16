//login.js


import {
  authStudent
} from '../../utils/apiV2'

//获取应用实例
const app = getApp();
Page({
  data: {
    remind: '加载中',
    help_status: false,
    userid_focus: false,
    passwd_focus: false,
    account: '',
    passwd: '',
    openid: '',
    angle: 0
  },

  onLoad: function() {


  },


  onReady: function() {
    var _this = this;
    setTimeout(function() {
      _this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    });
  },


  bind: function() {
    if (!this.data.userid || !this.data.passwd) {
      wx.showModal({
        content: '账号及密码不能为空',
        confirmText: '确定',
        showCancel: false,
      })

      return false;
    }

    if (this.data.userid.length != 10) {
      wx.showModal({
        content: '输入的学号不正确',
        confirmText: '确定',
        showCancel: false,
      })
      
      return false;
    }

    wx.showLoading({
      title: '登录中'
    })


    let data = {
      account: this.data.userid,
      password: this.data.passwd,
      appid: app.globalData.appId,
      openid: app.globalData.openid,
    }

    authStudent(data).then(
      studentInfo => {
        app.addCache("TOKEN", studentInfo.token)
        app.addCache("studentInfo", studentInfo)

        wx.switchTab({
          url: '/pages/index/index'
        })
      }, err => {
        console.log(err)
        wx.showModal({
          title: '未知错误',
          content: '请重试',
          showCancel: false
        })

        if(err.data && err.data.status == 412) {
          wx.showModal({
            title: '非常用微信号登录',
            content: '请验证注册科大圈时手机号',
            confirmText: '去验证',
            cancelText: '取消'
          }).then(res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/auth/auth?account='+data.account,
              })
            } 
          })
        }

      }).then(wx.hideLoading({
        success: (res) => {},
      }))

  },


  useridInput: function(e) {
    this.setData({
      userid: e.detail.value
    });
    if (e.detail.value.length >= 10) {
      wx.hideKeyboard();
    }
  },


  passwdInput: function(e) {
    this.setData({
      passwd: e.detail.value
    });
  },


  inputFocus: function(e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': true
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
    }
  },


  inputBlur: function(e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': false
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
    }
  },
  tapHelp: function(e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showHelp: function(e) {
    this.setData({
      'help_status': true
    });
  },

  hideHelp: function(e) {
    this.setData({
      'help_status': false
    });
  }
});