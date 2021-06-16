//index.js
//获取应用实例

import {
  isEmptyObject,
  getExamTimetable
} from '../../utils/api'

import {
  getCourseOrderName,
  dateToText
} from '../../utils/util.js'

import {
  getStudentTimeTable,
  getBannerAtricle
} from '../../utils/apiV2'


const app = getApp();
Page({
  data: {

    offline: false,
    remind: '',
    hasCourse: false,
    todayCourse: [],
    showTodayCourse: true,
    mobile: null,
    examShow: false,
    core: [{
        id: 'kb',
        name: '课表',
        disabled: true,
        teacher_disabled: false,
        offline_disabled: false
      },
      {
        id: 'cj',
        name: '成绩',
        disabled: true,
        teacher_disabled: false,
        offline_disabled: true
      },
      {
        id: 'ks',
        name: '考试',
        disabled: true,
        teacher_disabled: false,
        offline_disabled: true
      },
      // {
      //   id: 'xs',
      //   name: '查课',
      //   disabled: true,
      //   teacher_disabled: false,
      //   offline_disabled: true
      // },
      {
        id: 'empty_classroom',
        name: '空教室',
        disabled: true,
        teacher_disabled: false,
        offline_disabled: true
      }
    ],
    card: {
      'kb': {
        show: true,
      },
      'ykt': {
        show: false,
        data: {
          'last_time': '',
          'balance': 0,
          'cost_status': false,
          'today_cost': {
            value: [],
            total: 0
          }
        }
      },

      'jy': {
        show: true,
        data: {}
      },

      'sdf': {
        show: false,
        data: {
          'room': '',
          'record_time': '',
          'cost': 0,
          'spend': 0
        }
      }
    },
    disabledItemTap: false, //点击了不可用的页面,
    background : ["https://mmbiz.qpic.cn/mmbiz_jpg/gFtCum5tiaM0DKJfEqsO6bj5dica3mS6ibv9ZJgPtS1dMqAOYib7cCB9KmRb94CnGhQqhdicFOy5pwiam2SpHOXV4SNw/0?wx_fmt=jpeg"]

  },

  onLoad: function() {
  },

  //分享
  onShareAppMessage: function() {
    return {
      title: '黑科校际Pro',
      desc: '看当天课程啦',
      path: '/pages/index/index'
    };
  },

  //下拉更新
  onPullDownRefresh: function() {
    this.setData({
      remind: '加载中'
    });
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    });
    wx.stopPullDownRefresh();
  },

  onShow: function() {
    if (app.checkLogin()) {
      this.todayCourseRender()
      this.examTimetableRender()
      this.bannerRender()
    }
  },

  onReady: function() {

  },

  /**
   * 渲染今日课表卡片
   */
  todayCourseRender: function() {

    getStudentTimeTable()
      .then(studentTimeTable => {
        this.setTodayCourse(studentTimeTable)
      }).catch(exception => {
        console.log(exception)
      })
  },

  setTodayCourse: function(timeTable) {
    console.log(timeTable)
    let date = new Date()
    let today = parseInt(date.getDay());
    let hour = date.getHours();
    let schoolWeek = app.getSchoolWeek()
    let todayCourse = [];

    //超过7点将课程显示为明天
    if (hour >= 19) {
      today += 1

      if (today > 7) {
        today = 0
      }
      this.setData({
        showTodayCourse: false
      });
    }


    for (let courseObject of timeTable) {
      let course = {}
      let week = courseObject.classDay
      if (courseObject.classInSchoolWeek[schoolWeek - 1] === "1" && week === today) {
        course.name = courseObject.course.name
        course.room = courseObject.roomName
        course.week = courseObject.classDay
        course.order = courseObject.classOrder
        course.teacher = courseObject.attendClassTeacher
        course.weekDescription = courseObject.weekDescription
        course['orderName'] = getCourseOrderName(courseObject.classOrder)
        todayCourse.push(course)
      }
    }
    todayCourse.sort(function sort_(a, b) {
      return a.order - b.order
    })
    if (!isEmptyObject(todayCourse)) {
      this.setData({
        hasCourse: false,
        todayCourse: todayCourse,
        remind: ''
      });
    } else {
      this.setData({
        hasCourse: true,
        remind: ''
      });
    }
  },


  examTimetableRender: function () {

    let studentInfo = wx.getStorageSync('studentInfo')

    let examTimetableList = wx.getStorageSync('examTimetableList')
    if(!isEmptyObject(examTimetableList)) {
      this.setExamTimetable(examTimetableList)
    }

    getExamTimetable({
      account: studentInfo.account
    })
      .then(data => {
        if (!isEmptyObject(data)) {
          wx.setStorageSync('examTimetableList', data)
          this.setExamTimetable(data)
        }
      }).catch(exception => {
        console.log(exception)
      })
  },

  setExamTimetable: function(data) {
    let result = [];


    for (let timeTable of data) {
      let item = {}
      let d = new Date(timeTable.date.replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}).*$/, '$1Z'));

      item.date = dateToText(d)
      item.name = timeTable.course.name
     
      let timing = Math.ceil((d - new Date()) / (24 * 3600 * 1000))
      item.timing = timing
      console.log(timing)
      if(timing<0){
       continue
      }
      result.push(item)
    }
 
      this.setData({
        examTimetable: result,
        examShow: true
      })
  
    
  },

  bannerRender: function () {

    getBannerAtricle().then(articleVO => {
        if (articleVO.count > 0) {
          for (let article of articleVO.articleList) {
            article.thumbUrl = decodeURIComponent(article.thumbUrl)
          }
          
          this.setData({
            showBanner: true,
            articleList: articleVO.articleList
          })
        } else {
          this.setData({
            showBanner: false,
            articleList: articleVO.articleList
          })

        }
    })
  },


});