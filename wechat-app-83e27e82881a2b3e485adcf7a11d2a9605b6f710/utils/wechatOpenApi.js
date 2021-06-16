import {
  isEmptyObject
} from './api'


function imgSecCheck(img, title) {
  if(isEmptyObject(img) || img.indexOf("qlogo") != -1) {
    return Promise.resolve({
        isSec: true,
        title: title
    })
  }

  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: img,
      success: res => {
        wx.cloud.callFunction({
          name: 'imgSecCheck',
          data: {img: res.data}
        }).then(res => {
          if (res.result.data.errCode.toString() === '0') {
            resolve({
              isSec: true,
              title: title
            })
          }
          if (res.result.data.errCode.toString() === '87014') {
            resolve({
              isSec: false,
              title: title
            })
          }
          reject(res)
        }).catch(err => {
          console.error(err)
          reject(err)
        })
      },
      fail: err => {
        console.error(err)
      }
    })
  })
}


function msgSecCheck(msg, title) {

  if(isEmptyObject(msg)) {

    return Promise.resolve({
        isSec: true,
        title: title
    })
  }

  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'msgSecCheck',
      data: {msg: msg}
    }).then(res => {
      if (res.result.data.errCode.toString() === '0') {
        resolve({
          isSec: true,
          title: title
        })
      }
      if (res.result.data.errCode.toString() === '87014') {
        resolve({
          isSec: false,
          title: title
        })
      }
      reject(res)
    }).catch(err => {
      reject(err)
    })
  })
}

function upLoadPicture (src, cloudPath) {

  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: src
    })
    .then(res => wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: res.path,
    }))

    .then(res => wx.cloud.getTempFileURL({
      fileList: [res.fileID]
    }))
    .then(res => {
      let tempUrl = res.fileList[0].tempFileURL
      if (tempUrl) {
        resolve(res)
      } else {
        reject(res)
      }
    })
    .catch(err => {
      reject(err)
    })
  })
}

module.exports = {
  imgSecCheck,
  msgSecCheck,
  upLoadPicture
}