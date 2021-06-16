//more.js
//获取应用实例

import {
  unbind
} from '../../utils/apiV2'


var app = getApp();
Page({
  data: {
    userinfo: {},
    openid: '',
    studentInfo: null,
    nickName: null,
  },

  onLoad: function () {
    
  },

  onShow: function () {
    this.setData({
      studentInfo: app.globalCache.studentInfo,
      userinfo: app.globalData.userInfo
    });
  },


  
  delbind: function () {
    setTimeout(function () 
    {
      wx.showModal({
        title: '切换绑定',
        content: '是否确认解除绑定,可解决数据不同步、异常等问题',
        cancelText: '点错了',
        confirmText: '是',
        success: function (res) {
          if (res.confirm) {
            unbind()
            wx.showToast({
                title: '解绑成功',
                icon: 'success',
                duration: 1000
            });
            app.clearCache()
            wx.reLaunch({
              url: '/pages/more/login'
            });        
          } 
          else {
            wx.showToast({
              title: '取消解绑操作',
              icon: 'success',
              duration: 1000
            });
          }
        }
      });
    }, 100);
  },

});