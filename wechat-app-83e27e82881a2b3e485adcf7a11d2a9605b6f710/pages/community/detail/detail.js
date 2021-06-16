// pages/community/detail/detail.js
import {
  getPostById,
  getCommentByPostId,
  createComment,
  addLike
} from '../../../utils/apiV2'


const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showComment: false,
    commentList: [],
    replyUserName : '',
    reply : {},
    commentContent : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    getPostById({
      postId: options.postId
    }).then(res => {
      res.avatar = decodeURIComponent(res.avatar)
      res.postTime = this.dateToText(new Date(res.postTime.replace(/\-/g, "/")))
      res.imageInfoList.forEach(image => {

        image.url = decodeURIComponent(image.url)
      })

      let length = res.imageInfoList.length
      let col = 3

      if (length == 1) col = 1
      if (length == 2 || length == 4) col = 2

      res.col = col
      res.singlePic = length == 1


      this.setData({
        post: res
      })
    })

    this.renderComment(options.postId)
  },


  renderComment(postId) {
    getCommentByPostId({
      postId: postId
    }).then(res => {
      res.commentList.forEach(commentList => {

        this.handleComment(commentList.root)

        if (commentList.replyList) {
          commentList.replyList.forEach(reply => {
            this.handleComment(reply)

            if(reply.rootCommentId != reply.replyCommentId &&  reply.postUser.userName != reply.replyUser.userName) {
              reply.showUserName = reply.postUser.showUserName +' 回复 ' + reply.replyUser.showUserName
            }
          })
        }
      })
      this.setData({
        commentList: res.commentList,
        hasComment : res.commentList.length != 0
      })
    })
  },

  handleComment(comment) {

    comment.postTime = this.dateToText(new Date(comment.postTime.replace(/\-/g, "/")))
    comment.postUser.avatar = decodeURIComponent(comment.postUser.avatar)
    this.handlePoster(comment.postUser)
    if(comment.replyUser) {
      this.handlePoster(comment.replyUser)
    }

    comment.showUserName = comment.postUser.showUserName
  },

  handlePoster(poster) {
    if (poster.postAuthor) {
      poster.showUserName = poster.showUserName + '(作者)' 
    } else if(poster.showUserNameOrder != 0) {

      poster.showUserName = poster.showUserName+'['+ poster.showUserNameOrder +']'
    }

  },

  viewImage(e) {
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.post.imageInfoList[index].url,
      urls: this.data.post.imageInfoList.map(image => {
        return image.url
      }),
    })
  },

  reply(e) {
    console.log(e)
    let replyIndex =  e.currentTarget.dataset.replyIndex
    let rootIndex =  e.currentTarget.dataset.rootIndex
    let replyUserName

    let reply = {
      postId : this.data.post.id,
      postUserName : this.data.post.userName,
      identityCode : this.data.post.identityCode,
      rootCommentId : this.data.commentList[rootIndex].root.id
    }

    if(replyIndex != undefined) {
      replyUserName = this.data.commentList[rootIndex].replyList[replyIndex].postUser.showUserName
      reply.replyCommentId = this.data.commentList[rootIndex].replyList[replyIndex].id
    } else {
      replyUserName = this.data.commentList[rootIndex].root.postUser.showUserName
      reply.replyCommentId = reply.rootCommentId
    }

    this.setData({
      showComment: true,
      replyUserName : replyUserName,
      reply : reply
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad({postId : this.data.post.id})
    wx.stopPullDownRefresh()
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

  tapComment(e) {
    let reply = {
      postId : this.data.post.id,
      postUserName : this.data.post.userName,
      identityCode : this.data.post.identityCode
    }
    this.setData({
      showComment: true,
      replyUserName : this.data.post.showUserName,
      reply : reply
    })
  },

  hideModal(e) {
    this.setData({
      showComment: false
    })
  },

  commentInput(e) {
    this.data.commentContent =  e.detail.value
  },

  submitComment() {
    if(!app.globalCache.user) {
      wx.showModal({
        content : '要注册一个身份才能评论哦',
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


    if(this.data.commentContent.trim().length == 0) {
      wx.showToast({
        title: '评论还没有内容',
        icon :'none'
      })
      return;
    }

    this.data.reply.content = this.data.commentContent
    wx.showLoading({
      title: '评论提交中',
    })

    createComment(this.data.reply).then(res=> {
      if (res.release) {
        wx.showToast({
          title: '发布成功',
          duration : 2000
        })
      } else {
        wx.showToast({
          title: '发布内容有敏感信息，审核中',
          duration : 5000
        })
      }

    }).catch(err => {
      console.error(err)
      console.log("error")

    }).then((fi) => {
      wx.hideLoading({
        success: (res) => {},
      })
      this.setData({
        showComment : false
      })
      this.renderComment(this.data.post.id)
    })

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

    let type = e.currentTarget.dataset.content
    let contentId
    let hasLike
    if(type == "0") {

      hasLike = this.data.post.hasLike
      
      let likeCount = this.data.post.likeCount
      contentId = this.data.post.id
      if(hasLike) {
        likeCount -= 1
      }else{
        likeCount += 1
      }
  
      this.setData({
        'post.hasLike' : !hasLike,
        'post.likeCount' : likeCount
      })
    } else {
      let index = e.currentTarget.dataset.replyIndex
      hasLike = this.data.commentList[index].root.hasLike
      
      let likeCount = this.data.commentList[index].root.likeCount
      contentId = this.data.commentList[index].root.id
      let path = 'commentList[' + index + '].root'

      if(hasLike) {
        likeCount -= 1
      }else{
        likeCount += 1
      }
  
      this.setData({
        [path + '.hasLike'] : !hasLike,
        [path + '.likeCount'] : likeCount
      })
    }


    addLike({
      contentType : type,
      contentId : contentId,
      add : !hasLike
    }).then(res => {
      console.log(res)
    }).catch(err => {

    })
  }
})