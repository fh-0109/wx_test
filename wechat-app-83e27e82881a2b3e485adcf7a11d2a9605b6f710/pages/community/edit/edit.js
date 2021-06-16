// pages/community/edit/edit.js

import {
  getPostIdentityByStudent,
  createPost,
  isEmptyObject
} from '../../../utils/apiV2'

const app = getApp()

const promixify = (api) => {

  return (options, ...params) => {

    return new Promise((resolve, reject) => {

      api(Object.assign({}, options, {
        success: resolve,
        fail: reject
      }), ...params)

    })

  }
}

const uploadFile = promixify(wx.cloud.uploadFile)
const getImageInfo = promixify(wx.getImageInfo)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],

    profileList: [],

    text: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    getPostIdentityByStudent({
      "studentAccount": app.globalCache.studentInfo.account,
      "token": app.globalCache.user.token

    }).then(res => {

      let chooseProfileIndex = null

      for (let i = 0; i < res.itemList.length; i++) {
        if (res.itemList[i].checked == true) {
          chooseProfileIndex = i;
        }
      }

      this.setData({
        profileList: res.itemList,
        chooseProfileIndex: chooseProfileIndex,
        showName: res.itemList[chooseProfileIndex].showName
      })
    })

  },

  radioChange: function (e) {
    let index = parseInt(e.detail.value)
    let showName = this.data.profileList[index].showName
    this.setData({
      modalName: null,
      showName: showName,
      chooseProfileIndex: index
    })
  },

  textInput: function (e) {
    this.data.text = e.detail.value
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  ChooseImage() {
    wx.chooseImage({
      count: 9 - this.data.imgList.length, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res)
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFiles)
          })
        } else {
          this.setData({
            imgList: res.tempFiles
          })
        }
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },

  send() {

    if (isEmptyObject(this.data.text) && isEmptyObject(this.data.imgList)) {
      wx.showModal({
        content: "没有可以发布的内容哦",
        showCancel: false
      })
      return
    }

    wx.showLoading({
      title: '数据上传中',
    })

    this.data.imgList.forEach((img, index) => img.order = index + 1)
    let overSizeImageList = this.data.imgList.filter(img => img.size > 1024 * 1024)
    if (!isEmptyObject(overSizeImageList)) {
      wx.showModal({
        title: "发布失败",
        content: "第" + overSizeImageList.map(img => img.order).join() + "张图片过大\n请重新选择（或不勾选原图）",
        showCancel: false
      })
      wx.hideLoading({
        success: (res) => {},
      })
      return
    }

    Promise.all(
      this.data.imgList.map(img => getImageInfo({
        src: img.path
      }))
    ).then((imageInfos) =>
      Promise.all(
        imageInfos.map(img =>
          uploadFile({
            cloudPath: 'post/' + encodeURIComponent(img.path.substring(11)),
            filePath: img.path,
          })
        )
      )
    ).then(res =>
      wx.cloud.getTempFileURL({
        fileList: res.map(img => img.fileID)
      })
    ).then(tempUrlList => {
      let data = {
        content: isEmptyObject(this.data.text) ? '' : this.data.text,
        identityCode: this.data.profileList[this.data.chooseProfileIndex].code,
        model: app.globalData.model,
        imageInfoRequestList: tempUrlList.fileList.map(res => {
          let data = {
            fileID: res.fileID,
            tempFileURL: encodeURIComponent(res.tempFileURL)
          }
          return data
        })
      }

      console.log(data)

      createPost(data).then(res => {
          if (res.release) {
            wx.showModal({
              content: "发布成功",
              showCancel: false,
              success(res) {
                wx.reLaunch({
                  url: '/pages/community/index/index'
                })
              }
            })
          } else {
            wx.showModal({
              content: "发布内容有敏感信息，审核中",
              showCancel: false,
              success(res) {
                wx.reLaunch({
                  url: '/pages/community/index/index'
                })
              }
            })
          }

        })
        .then(() => {
          wx.hideLoading({
            success: (res) => {},
          })
        })
    })
  }
})