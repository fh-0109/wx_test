import {
  search,
  isEmptyObject,
} from '../../../utils/api'

import {
  getCourseOrderName,
  getWeekName
} from '../../../utils/util.js'

var WxSearch = require('../../../wxSearchView/wxSearchView.js');


Page({
  data: {
    text: "This is page data.",
    placeholder: "可以根据课程名，班级名，老师名，教室名进行搜索",
    resultList: [],
    pageCount: 0,
    showText : true,
    resultMap: {},
    keyList: []
  }, 

  onLoad: function (options) {
    let that = this;
    WxSearch.init(
      that,  // 本页面一个引用
      [], // 热点搜索推荐，[]表示不使用
      [],// 搜索匹配，[]表示不使用
      that.mySearchFunction, // 提供一个搜索回调函数
      that.myGobackFunction //提供一个返回回调函数
    );

  },




  onReady: function () {
    // Do something when page ready.
  },
  onShow: function () {
    // Do something when page show.
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
  },
  onReachBottom: function () {
    let pageCount = this.data.pageCount + 1
    this.setData({
      pageCount : pageCount
    })

    this.searchCouse(this.data.query, pageCount)
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  onPageScroll: function () {
    // Do something when page scroll
  },
  onResize: function () {
    // Do something when page resize
  },

  // 3 转发函数，固定部分，直接拷贝即可
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数
  wxSearchBindfocus: WxSearch.wxSearchBindfocus,
  wxSearchBindblur: WxSearch.wxSearchBindblur,

  // 4 搜索回调函数  
  mySearchFunction: function (value) {
    // do your job here
    // 示例：跳转
    this.searchCouse(value, 0)
    this.setData({
      pageCount: 0
    })
  },

  // 5 返回回调函数
  myGobackFunction: function () {
    // do your job here
    // 示例：返回
    wx.redirectTo({
      url: 'pages/index/index'
    })
  },

  searchCouse: function (query, page) {

    wx.showLoading({
      title: '努力搜索中',
    })

    search({
      q: query,
      size: 10,
      page: page
    })
      .then(result => {
        if(page > 0){
          result = this.data.resultList.concat(result) 
        }
        
        let start = 0
        let keyList = []
        let resultMap = {}
        for (var i = 0, len = result.length; i < len; i++) {
          result[i].idx = i+1
          result[i].classOrderName = getCourseOrderName(result[i].classOrder)
          result[i].weekName = getWeekName(result[i].classDay)
          console.log(result[i].courseId)
          let key = result[i].courseId + result[i].courseOrder
          console.log(key)
          if (resultMap[key] === undefined){
            keyList.push(key)
            resultMap[key] = [result[i]]
          }else {
            resultMap[key] = resultMap[key].concat(result[i])
          }
          
        }

        this.setData({
          resultList: result,
          placeholder: query,
          query: query,
          showText: false,
          keyList: keyList,
          resultMap: resultMap
        })
      })
      .then(wx.hideLoading())
  }


})


