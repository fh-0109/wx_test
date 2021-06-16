// pages/community/register/register.js

const app = getApp()

import {
  isEmptyObject,
  crateUserByStudent
} from '../../../utils/apiV2'


import{
  imgSecCheck,
  msgSecCheck,
  upLoadPicture
} from '../../../utils/wechatOpenApi'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl: null,
    nickName: "",
    gender: "",
    mobile: "",
    signature: "",
    picker: ['男', '女', '保密'],
    tempAvatarURL: null,
    genderIndex: null,
    showLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
        gender: app.globalData.userInfo.gender,
        genderIndex: app.globalData.userInfo.gender == 0 ? 2 : app.globalData.userInfo.gender - 1
      })
    }
  },


  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },

  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res)
        this.setData({
          avatarUrl: res.tempFilePaths[0]
        })
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: [this.data.avatarUrl],
    });
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

  DelImg(e) {
    wx.showModal({
      content: '确定要删除这个头像吗？',
      cancelText: '再看看',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.setData({
            avatarUrl: null
          })
        }
      }
    })
  },


  formSubmit: function (e) {

    // 参数校验
    let emptyParam = []
    if (this.data.avatarUrl == null || this.data.avatarUrl == undefined) {
      emptyParam.push("头像")
    }

    if (isEmptyObject(e.detail.value.nickName)) {
      emptyParam.push("昵称")
    }

    if (e.detail.value.gender === null) {
      emptyParam.push("性别")
    }

    if (isEmptyObject(this.data.mobile)) {
      emptyParam.push("手机号")
    }

    if (!isEmptyObject(emptyParam)) {

      wx.showModal({
        content: '请填写' + emptyParam.join(),
        confirmText: '确定',
        showCancel: false,
      })
      return
    }

    this.setData({
      showLoading: true
    })
    wx.showLoading({
      title: '注册中'
    })

    let data = {
      "gender": this.data.gender,
      "phoneNumber": this.data.mobile,
      "nickName": e.detail.value.nickName,
      "signature": e.detail.value.signature,
      "studentAccount": app.globalCache.studentInfo.account,
      "appId": app.globalData.appId,
      "openId": app.globalData.openid,
    }
    let imgSecFunc

    if(this.data.avatarUrl.indexOf("qlogo") != -1){
      imgSecFunc = imgSecCheck(this.data.avatarUrl, "头像");
    }else {
      imgSecFunc = wx.getImageInfo({src: this.data.avatarUrl}).then(res => {
        imgSecCheck(res.path, "头像")
      }).catch(err => {
        console.error(err)
      })
    }

    Promise.all([msgSecCheck(data.nickName, "昵称"), msgSecCheck(data.signature, "个性签名"), imgSecFunc])
    .then(res => {
      
      let sum = res.map(item => item.isSec).reduce((prev,current,index,arr)=>{
        return prev+current
      })

      if(sum == res.length) {
        upLoadPicture(this.data.avatarUrl, 'avatar/' + app.globalData.openid+ "_"+ new Date().getTime() + '.png')
        .then(res => {
          console.log(res)
          data.avatarUrl = encodeURIComponent(res.fileList[0].tempFileURL)
          this.createUser(data, res.fileList[0].fileID)
        })
        .catch(err => {
          console.error(err)
          this.showUplodAvatalError()
        })
      } else {
        wx.showModal({
          title : '请重新填写',
          content: res.filter(item => !item.isSec).map(item => item.title).join() + '包含敏感信息',
          confirmText: '确定',
          showCancel: false,
        })
      }
    }).catch(err => {
      console.error(err)
      wx.showModal({
        title : '请重试',
        content: '上传资料失败',
        showCancel: false,
      })
    }).then(() => {
      this.setData({showLoading: false})
      wx.hideLoading({ success: (res) => {}, })
    })
  },

  showUplodAvatalError() {
    wx.showModal({
      content: '上传头像失败请重试',
      confirmText: '确定',
      showCancel: false,
      success: res => {
        if (res.confirm) {
          this.setData({
            avatarUrl: null
          })
        }
      }
    })
  },

  createUser(data, fileId) {
    crateUserByStudent(data).then(res => {
      app.addCache("user", res)
      
      wx.showModal({
        content: '注册成功',
        confirmText: '去发帖',
        cancelText : '先去逛逛',
  
        success(res) {
          if(res.confirm) {
            wx.redirectTo({
              url: '/pages/community/edit/edit'
            })
          } else {
            wx.switchTab({
              url: '/pages/community/index/index'
            })
          }
        }
      })
  
    }).catch(err => {

      wx.cloud.deleteFile({
        fileList: [fileId],
        success: res => {
          console.log(res.fileList)
        },
        fail: console.error
      })

      if(err.data.status === 410) {
        wx.showModal({
          title : '注册失败',
          content: '该手机号已经注册',
          confirmText: '确定',
          showCancel: false
        }).then(res => this.setData({
          mobile : ""
        }) )
      } else if(err.data.status === 413) {
        wx.showModal({
          title : '注册失败',
          content: '该微信号已经注册',
          confirmText: '确定',
          showCancel: false
        })
      }
      
      else {
        console.error(err)
        wx.showModal({
          title : '请重试',
          content: '注册失败',
          showCancel: false,
        })
      }
    })
  }
})