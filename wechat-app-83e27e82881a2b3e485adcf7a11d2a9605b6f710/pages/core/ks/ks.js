//ks.js
//获取应用实例
var app = getApp();

import {
  getExamTimetable,
  isEmptyObject,
} from '../../../utils/api'

import {
  dateToText
} from '../../../utils/util.js'

Page({
  data: {
    remind: '加载中',
    list: [],
    first: 1
  },


  togglePage: function(e) {
    var id = e.currentTarget.id,
      data = {};
    data.show = [];
    for (var i = 0, len = this.data.class.length; i < len; i++) {
      data.show[i] = false;
    }
    if (this.data.first) {
      this.setData(data);
      this.data.first = 0;
    }
    data.show[id] = !this.data.show[id];
    this.setData(data);
  },


  //分享
  onShareAppMessage: function() {

  },


  //下拉更新
  onPullDownRefresh: function() {

  },


  onLoad: function(options) {
    this.examTimetableRender()
    let studentInfo = wx.getStorageSync('studentInfo')

    this.setData({
      name: studentInfo.name,
      id: studentInfo.account
    })
  },


  examTimetableRender: function() {

    let studentInfo = wx.getStorageSync('studentInfo')

    let examTimetableList = wx.getStorageSync('examTimetableList')
    
    this.setExamTimetable(examTimetableList)

    getExamTimetable({
        account: studentInfo.account
      })
      .then(data => {
        if(!isEmptyObject(data)){
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
      let examDate = new Date(timeTable.date.replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}).*$/, '$1Z'));

      item.date = dateToText(examDate)
      item.course = timeTable.course.name
      item.place = timeTable.classRoom.name
      item.teacher = timeTable.course.teacherName
      item.examName = timeTable.examName
      item.type = timeTable.course.examType
      item.week = timeTable.examWeekOfTerm
      item.day = timeTable.examDay
      item.start = timeTable.startTime
      item.end = timeTable.endTime
      item.credit = timeTable.course.credit

      let timing = Math.ceil((examDate - new Date()) / (24 * 3600 * 1000))
      
      if (timing > 0) {
        item.countdown = '还有' + timing + '天'
      } else if (timing === 0) {
        item.countdown = '今天考试'
      } else {
        item.countdown = '已经逾期' + -timing + '天'

      }

      result.push(item)
    }


    this.setData({
      list: result,
      remind: ''
    })
  },


  //让分享时自动登录
  loginHandler: function(options) {

    function ksRender(list) {
      if (!list || !list.length) {
        _this.setData({
          remind: '无考试安排'
        });
        return false;
      }
      var days = ['一', '二', '三', '四', '五', '六', '日'];
      for (var i = 0, len = list.length; i < len; ++i) {
        list[i].open = false;
        list[i].index = i;
        list[i].day = days[list[i].day - 1];
        list[i].time = list[i].time.trim().replace('—', '~');
        list[i].lesson = list[i].lesson.replace(',', '-');
        //倒计时提醒
        if (list[i].days > 0) {
          list[i].countdown = '还有' + list[i].days + '天考试';
          list[i].place = '（' + list[i].time + '）' + list[i].room;
          if (!app._user.teacher) {
            list[i].place += '#' + list[i].number;
          }
        } else if (list[i].days < 0) {
          list[i].countdown = '考试已过了' + (-list[i].days) + '天';
          list[i].place = '';
        } else {
          list[i].countdown = '今天考试';
          list[i].place = '（' + list[i].time + '）' + list[i].room;
          if (!app._user.teacher) {
            list[i].place += '#' + list[i].number;
          }
        }
      }
      list[0].open = true;
      _this.setData({
        list: list,
        remind: ''
      });
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: app._server + "/api/get_ks.php",
      method: 'POST',
      data: app.key(data),
      success: function(res) {
        if (res.data && res.data.status === 200) {
          var list = res.data.data;
          if (list) {
            if (!options.name) {
              //保存考试缓存
              app.saveCache('ks', list);
            }
            ksRender(list);
          } else {
            _this.setData({
              remind: '暂无数据'
            });
          }

        } else {
          app.removeCache('ks');
          _this.setData({
            remind: res.data.message || '未知错误'
          });
        }
      },
      fail: function(res) {
        if (_this.data.remind == '加载中') {
          _this.setData({
            remind: '网络错误'
          });
        }
        console.warn('网络错误');
      },
      complete: function() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  // 展示考试详情
  slideDetail: function(e) {
    var id = e.currentTarget.dataset.id,
      list = this.data.list;
    // 每次点击都将当前open换为相反的状态并更新到视图，视图根据open的值来切换css
    for (var i = 0, len = list.length; i < len; ++i) {
      if (i == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData({
      list: list
    });
  }
});