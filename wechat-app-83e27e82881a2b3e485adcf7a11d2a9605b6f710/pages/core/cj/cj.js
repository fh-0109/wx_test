//cj.js
//获取应用实例

import {
  isEmptyObject,
  subscribe
} from '../../../utils/api'

import {
  formatDate,
} from '../../../utils/util'


import {
  getStudentGrade
} from '../../../utils/apiV2'


var app = getApp();

Page({
  data: {
    header: {
      defaultValue: '',
      inputValue: '',
      help_status: false
    },

    haveGrade: false,
    term: [],
    currentGradeList: [],
    switch1Checked: true,
  },

  onPullDownRefresh: function() {

    wx.showLoading({
      title: '努力刷新中',
    })

    this.getgrades()


    wx.stopPullDownRefresh()
  },

  onLoad: function() {

  },


  subscribeTap: function(){
    let openid = wx.getStorageSync("openid")

    if(openid===null || openid===''){
      return
    }

    wx.requestSubscribeMessage({
      tmplIds: ['dmE0nyulM8OVcUs-KojDxCYECrKTmzOGDkEUUm2T5UE'],
      success(res) { 
        if (res['dmE0nyulM8OVcUs-KojDxCYECrKTmzOGDkEUUm2T5UE'] == 'accept'){
          subscribe({
            "openid": openid,
            "templateId": "dmE0nyulM8OVcUs-KojDxCYECrKTmzOGDkEUUm2T5UE"
          }).then(data =>{
              if(data === "success"){
                wx.showToast({
                  title: '订阅成功',
                  icon: 'success',
                  duration: 2000
                })
              }
          })
        }
      },
      fail(res) { console.log(res) },
    })

  },


  switchChange: function (e) {
      console.log(e)
  },

  onShow: function() {
    if (app.checkLogin()) {
      let studentInfo = wx.getStorageSync('studentInfo')

      this.setData({
        id: studentInfo.account,
        name: studentInfo.name
      });
      this.getgrades();
    }
  },

  getgrades: function() {

    wx.showLoading({
      title: '加载中',
    })

    let _this = this

    getStudentGrade().then(result => {
      let termGradeList = result.termGradeList
      if (!isEmptyObject(termGradeList)) {
        console.log(termGradeList)
        this.setData({
          gpa: result.gpa,
          gpaRank: result.gpaRank,
          gpaRankSize: result.gpaRankSize,
          optionalCredit: result.optionalCourseCredit
        })
        this.gradeListHandler(termGradeList)
      }

    }).then(grade => {
      wx.hideLoading()
      wx.showToast({
        title: '更新成功',
        icon: 'success',
        duration: 2000
      })
    })
  


  },

  gradeListHandler(termGradeList) {
    let currentTermList = []
    let restTermList = []

    termGradeList.forEach(termGrade => {
        if(termGrade.currentTerm){
          termGrade.gradeList.forEach(gradeObject => {
            let grade = {}
            if (gradeObject.score === -1) {
              grade.score = "暂无"
              grade.showDetail = false
            } else {
              grade.score = gradeObject.score
              grade.showDetail = true
            }
            grade.courseName = gradeObject.course.name
            grade.courseNameSize = gradeObject.course.name.length
            grade.coursePropertyName = gradeObject.coursePropertyName

            grade.courseOrder = gradeObject.course.courseOrder
            grade.courseNum = gradeObject.course.num

            grade.credit = gradeObject.course.credit
            grade.rank = gradeObject.rank
            grade.teacher = gradeObject.course.teacherName
            grade.gradePoint = gradeObject.gradePoint
            grade.teacher = gradeObject.course.teacherName
            grade.executiveEducationPlanNumber = gradeObject.termYear + '-' + gradeObject.termOrder + '-1'


            if (!isEmptyObject(gradeObject.operateTime)) {
              grade.operateTime = this.fullDateToText(formatDate(gradeObject.operateTime))
            }
            currentTermList.push(grade)
          })

        }else{
          let gradeList = []

          let restTermGrade = {
            termName : '',
            gradeList: []
          }

          termGrade.gradeList.forEach(gradeObject => {
            let grade = {}
            grade.courseName = gradeObject.course.name
            grade.courseNameSize = gradeObject.course.name.length
            grade.credit = gradeObject.course.credit
            grade.score = gradeObject.score
            grade.gradePoint = gradeObject.gradePoint
            grade.coursePropertyName = gradeObject.coursePropertyName

            grade.courseOrder = gradeObject.course.courseOrder
            grade.courseNum = gradeObject.course.num

            if (!isEmptyObject(gradeObject.operateTime)) {
              grade.operateTime = this.fullDateToText(formatDate(gradeObject.operateTime))
            }

            gradeList.push(grade)
          })

          restTermGrade.termName = termGrade.termYear + '学年第' + termGrade.termOrder + '学期'
          restTermGrade.gradeList = gradeList
          restTermList.push(restTermGrade)
        }


    })



    this.setData({
      currentGradeList: currentTermList,
      restTermList: restTermList,
      haveGrade: true,
    })
  },

  dateToText: function (date) {
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()
    let hour = date.getHours()
    let minutes = date.getMinutes()

    return year + '年' + month + '月' + day + '日'
  },

  fullDateToText: function(date) {

    let hour = date.getHours()
    let minutes = date.getMinutes()

    return this.dateToText(date) + hour +'时' + minutes+'分'
  },

});