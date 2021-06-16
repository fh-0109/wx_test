// pages/community/index.js

const app = getApp();

import {
  getUserByStudent,
  getPost,
  addLike
} from '../../../utils/apiV2'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    startId : 0,
    count : 20,
    postList : []
  },

  onLoad(e) {
    if(app.globalCache.studentInfo) {

      getUserByStudent({
        "studentAccount" : app.globalCache.studentInfo.account
      }).then(res => {
        app.addCache("user", res);
      }).catch (err => {
          console.error(err)
      })
    } else {
      console.warn("学生信息为空")
    }

    this.renderPostList({
      count: this.data.count
    }).then(res => {
      this.setData({
        startId : res.nextMaxId,
        postList : res.postList
      })
      wx.showToast({
        title: res.count == 0 ? '目前没有内容' : '更新了'+res.count+'圈子',
      })
    })

  },

  onShow() {

  },

  onPullDownRefresh() {
    this.renderPostList({
      count: this.data.count
    }).then(res => {
      this.setData({
        startId : res.nextMaxId,
        postList : res.postList
      })
      wx.showToast({
        title: res.count == 0 ? '目前没有内容' : '更新了'+res.count+'圈子',
      })
    }).then(res => wx.stopPullDownRefresh())
  },

  onReachBottom() {
    this.renderPostList({
      startId :this.data.startId,
      count: this.data.count
    }).then(res => {
      if(res.count != 0) {
        this.setData({
          startId : res.nextMaxId,
          postList : this.data.postList.concat(res.postList)
        })
      }else {
        wx.showToast({
          title: '已经到底了',
        })
      }
    })

  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '科大圈',
      path: '/pages/community/index/index'
    }
  }, 

  onShareTimeline(){
    return {
      title: '黑科大第一个匿名社区-科大圈',
      imageUrl : "/images/logo.png"
    }

  },

  isCard(e) {
    this.setData({
      isCard: e.detail.value
    })
  },

  renderPostList(data) {
    return new Promise((resolve, reject) => {
      getPost(data).then(res => {
        console.log(res)
  
        for(let item of res.postList) {
          this.handlerPost(item)
        }
        resolve(res)

      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
  },

  handlerPost(item) {

    item.avatar = decodeURIComponent(item.avatar)
    item.postTime = this.dateToText(new Date(item.postTime.replace(/\-/g, "/"))) 
    item.imageInfoList.forEach(image => {

      image.url = decodeURIComponent(image.url)
    })

    let length = item.imageInfoList.length
    let col = 3

    if (length == 1) col = 2
    if (length == 2 || length == 4) col=2
    item.singlePic = length == 1
    item.col = col
  }, 

  edit() {

    if(app.globalCache.user) {
      wx.navigateTo({
        url: '/pages/community/edit/edit'
      })
    }else {
      wx.showModal({
        content : '要注册一个身份才能发帖哦',
        confirmText : '去注册',
        cancelText : '狠心拒绝',
        success(res) {
          if(res.confirm) {
            wx.navigateTo({
              url: '/pages/community/authLogin/authLogin'
            })
          }
        }
      })
    }
  },

  tapCard(e) {
    let postId = e.currentTarget.dataset.postid
    wx.navigateTo({
      url: '/pages/community/detail/detail?postId=' + postId
    })
  },

  dateToText(formateDate) {

    let current = new Date().getFullYear()
    let year = formateDate.getFullYear()
  
    let month = formateDate.getMonth() + 1
    let day = formateDate.getDate()

    let hour = new String(formateDate.getHours()) 
    let hourStr = hour.length == 1 ? '0' + hour : hour

    let minutes = new String(formateDate.getMinutes())
    let minutesStr = minutes.length == 1 ? '0' + minutes : minutes
    
    let base = month + '月' + day + '日'

    if (current == year) {
      return base + " " + hourStr + ':' + minutesStr
    } else {
      return year + '年' + base
    }
  },

  tapLike(e) {
    if(!app.globalCache.user) {
      wx.showModal({
        content : '要注册一个身份才能点赞哦',
        confirmText : '去注册',
        cancelText : '狠心拒绝',
        success(res) {
          if(res.confirm) {
            wx.navigateTo({
              url: '/pages/community/authLogin/authLogin'
            })
          }
        }
      })
      return
    }

    let postIndex = e.currentTarget.dataset.postIndex
    let hasLike = this.data.postList[postIndex].hasLike
    
    let likeCount = this.data.postList[postIndex].likeCount

    if(hasLike) {
      likeCount -= 1
    }else{
      likeCount += 1
    }
    let path = 'postList[' + postIndex + ']'

    this.setData({
      [path +'.hasLike'] : !hasLike,
      [path +'.likeCount'] : likeCount,
    })

    addLike({
      contentType : 0,
      contentId :this.data.postList[postIndex].id,
      add : !hasLike
    }).then(res => {
      console.log(res)
    }).catch(err => {

    })
  }

})

