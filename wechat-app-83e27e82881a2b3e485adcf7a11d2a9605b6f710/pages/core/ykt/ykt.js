//ykt.js
import { getECard } from '../../../utils/api'
//获取应用实例
var app = getApp();
Page({
  data: {
    mobile: '',
    password: '',
    userid_focus: false,
    passwd_focus: false
  },

  bind: function(){
    if (!this.data.mobile || !this.data.password) {
      app.showErrorModal('账号及密码不能为空', '提醒');
      return false;
    }

    if (this.data.mobile.length != 11) {
      app.showErrorModal('请输入正确手机号码', '提醒');
    }

    var data = {
      'userid': app.openid,
      'mobile': this.data.mobile,
      'password':this.data.password
    }
    var now = new Date().getTime()
    getECard(data).then(res =>{
      if (res.data.status === 200){
        if (res.data.card.ecard.card_balance != null) {
          app.stuinfo.mobile = data.mobile

          wx.setStorage({
            key: 'mobile',
            data: data.mobile,
          })

          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
  },


  useridInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
    if (e.detail.value.length >= 11) {
      wx.hideKeyboard();
    }
  },
  passwdInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  inputFocus: function (e) {
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
  inputBlur: function (e) {
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
  
});