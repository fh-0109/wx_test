// pages/auth/auth.js

import {
  getUserByStudent,
  authCommonStudent,
  isEmptyObject
} from '../../utils/apiV2'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.account = options.account
    getUserByStudent({studentAccount: options.account}).then(res => {
      console.log(res)
      this.setData({
        showMobile : res.mobile
      })
    }).catch(err => {
      console.log(err)
    })
  },

  getPhoneNumber(e) {
    wx.cloud.callFunction({
      name: 'getMobile',
      data: {
        weRunData: wx.cloud.CloudID(e.detail.cloudID),
      }
    }).then(res => {
      this.setData({
        mobile: res.result.event.weRunData.data.purePhoneNumber,
      })

    }).catch(err => {
      console.error(err);
    });
  },

  submit() {

    if (isEmptyObject(this.data.mobile)) {
      wx.showModal({
        content: '手机号未填写',
        showCancel: false
      })
      return
    }



    let data = {
      account: this.data.account,
      phoneNumber: this.data.mobile,
      appid: app.globalData.appId,
      openid: app.globalData.openid,
    }

    authCommonStudent(data).then(res => {
      console.log(res)
    }).catch(err => {
      console.error(err)
      if(err.data.status == 412) {
        wx.showModal({
          title : '认证失败',
          content: '手机号不正确，请重新授权',
          showCancel: false
        }).then(res => {
          this.setData({
            mobile : ''
          })
        })

      }
    })
  }
})