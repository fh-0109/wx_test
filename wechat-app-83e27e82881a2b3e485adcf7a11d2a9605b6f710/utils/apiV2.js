import * as API from 'request';

const host = 'https://platform.hackerda.com/platform';
// const host = 'http://127.0.0.1:8080/platform';

const app = getApp()

function authStudent(data) {
  return API.POST(
    host + '/authz/student',
    data
  ).then(
    res => {
      return res.data
    }
  )
}

function authCommonStudent(data) {
  return API.POST(
    host + '/authz/commonStudent',
    data
  ).then(
    res => {
      return res.data
    }
  )
}

function getStudentTimeTable() {

  let timetable = wx.getStorageSync('studentTimeTable');
  let token = app.getToken()

  if (isEmptyObject(timetable)) {
    return API.GET(
      host + '/api/timetable', {
        "token": token
      }
    ).then(
      res => {
        return res.data
      }
    )
  } else {
    return Promise.resolve(timetable)
  }
}

function getStudentGrade() {

  let token = app.getToken()

  return API.GET(
    host + '/api/grade', {
      "token": token
    }
  ).then(
    res => {
      return res.data
    }
  )
}

function getStudentGrade() {

  let token = app.getToken()

  return API.GET(
    host + '/api/grade', {
      "token": token
    }
  ).then(
    res => {
      return res.data
    }
  )
}

function unbind() {

  let token = app.getToken()

  return API.GET(
    host + '/api/unbind', {
      "token": token,
      "appId": wx.getAccountInfoSync()['miniProgram']['appId']
    }
  ).then(
    res => {
      return res.data
    }
  )
}

function getBannerAtricle() {

  return API.GET(
    host + '/wechat/material/article',
  ).then(
    res => {
      return res.data
    }
  )
}

function crateUserByStudent(data) {
  return API.POST(
    host + '/crateUserByStudent',
    data
  ).then(
    res => {
      return res.data
    }
  )
}

function getUserByStudent(data) {
  return API.POST(
    host + '/getByStudentAccount',
    data
  ).then(
    res => {
      return res.data
    }
  )
}

function getPostIdentityByStudent(data) {
  return API.GET(
    host + '/community/getPostIdentityByStudent',
    data,
    app.globalCache.user.token

  ).then(
    res => {
      return res.data
    }
  )
}

function createPost(data) {
  return API.POST_JSON(
    host + '/community/createPost',
    data,
    app.globalCache.user.token
  ).then(
    res => {
      return res.data
    }
  )
}

function getPost(data) {
  let token
  if(app.globalCache.user){
    token = app.globalCache.user.token
  } else {
    token = "guest"
  }
  return API.GET(
    host + '/community/getPost',
    data,
    token
  ).then(
    res => {
      return res.data
    }
  )
}

function getPostById(data) {
  let token  
  if(app.globalCache.user){
    token = app.globalCache.user.token
  } else {
    token = "guest"
  }
  return API.GET(
    host + '/community/getPostById',
    data,
    token 
  ).then(
    res => {
      return res.data
    }
  )
}


function getCommentByPostId(data) {
  let token  
  if(app.globalCache.user){
    token = app.globalCache.user.token
  } else {
    token = "guest"
  }  return API.GET(
    host + '/community/getCommentByPostId',
    data,
    token
  ).then(
    res => {
      return res.data
    }
  )
}

function createComment(data) {
  return API.POST_JSON(
    host + '/community/createComment',
    data,
    app.globalCache.user.token
  ).then(
    res => {
      return res.data
    }
  )
}

function addLike(data) {
  return API.GET(
    host + '/community/addLike',
    data,
    app.globalCache.user.token
  ).then(
    res => {
      return res.data
    }
  )

}

function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}



module.exports = {
  authStudent,
  getStudentTimeTable,
  getStudentGrade,
  unbind,
  getBannerAtricle,
  isEmptyObject,
  crateUserByStudent,
  getPostIdentityByStudent,
  getUserByStudent,
  createPost,
  getPost,
  getPostById,
  getCommentByPostId,
  createComment,
  addLike,
  authCommonStudent
}