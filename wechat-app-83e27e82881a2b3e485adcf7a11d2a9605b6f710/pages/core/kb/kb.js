//kb.js

import {
  isEmptyObject,
  getTimeTableByStudent,
  getTimeTableByTeacher,
  getTimeTableByClassroom,
  getTimeTableByCourse,
  getTimeTableByClass
} from '../../../utils/api'

import {
  getStudentTimeTable
} from '../../../utils/apiV2'

//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '',
    nothingclass: false,
    _days: ['日', '一', '二', '三', '四', '五', '六'],
    _weeks: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周', '第八周', '第九周', '第十周', '十一周', '十二周', '十三周', '十四周', '十五周', '十六周', '十七周', '十八周', '十九周', '二十周'],
    _time: [ //课程时间与指针位置的映射，{begin:课程开始,end:结束时间,top:指针距开始top格数}
      {
        begin: '0:00',
        end: '8:30',
        beginTop: -4,
        endTop: -4
      },
      {
        begin: '8:31',
        end: '9:15',
        beginTop: 0,
        endTop: 200
      },
      {
        begin: '9:16',
        end: '10:00',
        beginTop: 204,
        endTop: 204
      },
      {
        begin: '10:01',
        end: '10:25',
        beginTop: 208,
        endTop: 408
      },
      {
        begin: '10:26',
        end: '11:15',
        beginTop: 414,
        endTop: 414
      },
      {
        begin: '11:16',
        end: '12:00',
        beginTop: 420,
        endTop: 620
      },
      {
        begin: '15:21',
        end: '15:29',
        beginTop: 624,
        endTop: 624
      },
      {
        begin: '15:30',
        end: '16:50',
        beginTop: 628,
        endTop: 828
      },
      {
        begin: '16:51',
        end: '16:59',
        beginTop: 834,
        endTop: 834
      },
      {
        begin: '17:00',
        end: '18:20',
        beginTop: 840,
        endTop: 1040
      },
      {
        begin: '18:21',
        end: '18:59',
        beginTop: 1044,
        endTop: 1044
      },
      {
        begin: '19:00',
        end: '20:20',
        beginTop: 1048,
        endTop: 1248
      },
      {
        begin: '20:21',
        end: '20:29',
        beginTop: 1254,
        endTop: 1254
      },
      {
        begin: '20:30',
        end: '21:50',
        beginTop: 1258,
        endTop: 1458
      },
      {
        begin: '21:51',
        end: '23:59',
        beginTop: 1462,
        endTop: 1662
      },
    ],
    timelineTop: 0,
    scroll: {
      left: 0
    },
    targetLessons: [],
    targetX: 0, //target x轴top距离
    targetY: 0, //target y轴left距离
    targetDay: 0, //target day
    targetWid: 0, //target wid
    targetI: 0, //target 第几个active
    targetLen: 0, //target 课程长度
    blur: false,
    today: '', //当前星期数
    currentWeek: app.getSchoolWeek(), //当前周数
    viewsWeek: app.getSchoolWeek(), //视图周数（'*'表示学期视图）
    //当前页面课表数据
    viewsLessons: [],
    dates: [], //本周日期
    teacher: false, //是否为教师课表
    //课表数据
    timeTable: [],
    source: '',
   

  },


  //分享
  onShareAppMessage: function () {
    var name = this.data.name || app._user.we.info.name,
      id = this.data.id || app._user.we.info.id;
    return {
      title: '我的课表',
      desc: '黑科大 - 课表查询',
      path: '/pages/core/kb/kb?id=' + id + '&name=' + name
    };
  },


  onLoad: function (options) {

    if (options.teacherAccount !== undefined) {
      console.log(options.teacherAccount)
      getTimeTableByTeacher({
        account: options.teacherAccount
      })
        .then(studentTimeTable => {
          this.data.timeTable = studentTimeTable
          this.timetableRender(studentTimeTable)
          this.setData({
            source: options.display + '老师'
          })
        }).catch(exception => {
          console.log(exception)
        })
    } else if (options.roomId !== undefined) {
      console.log(options.roomId)
      getTimeTableByClassroom({
        roomId: options.roomId
      })
        .then(studentTimeTable => {
          this.data.timeTable = studentTimeTable
          this.setData({
            source: options.display
          })
          this.timetableRender(studentTimeTable)
        }).catch(exception => {
          console.log(exception)
        })
    } else if (options.urpClassId !== undefined) {
      getTimeTableByClass({
        classNum: options.urpClassId
      })
        .then(studentTimeTable => {
          this.data.timeTable = studentTimeTable
          this.timetableRender(studentTimeTable)
          this.setData({
            source: options.display + '班'
          })
        }).catch(exception => {
          console.log(exception)
        })
    } else if (app.checkLogin()) {
      this.renderTimeTable()
    }

    if (options.display !== undefined) {

    }
    if(this.data.viewsWeek>20){
     this.setData({      
         viewsWeek: 20      
     })
    } else {
      this.setData({
        viewsWeek: this.data.viewsWeek
      })
    }

  },


  //让分享时自动登录
  loginHandler: function (options) {
    var _this = this;
    _this.setData({
      'term': app._time.term,
      'teacher': app._user.teacher
    });
    // onLoad时获取一次课表
    var id = options.id || app._user.we.info.id;
    if (!id) {
      _this.setData({
        remind: '未绑定'
      });
      return false;
    }
    if (options.id && options.name) {
      _this.setData({
        name: options.name
      });
    }
    _this.get_kb();
  },


  onShow: function () {
    var _this = this;

    // 计算timeline时针位置
    function parseMinute(dateStr) {
      return dateStr.split(':')[0] * 60 + parseInt(dateStr.split(':')[1]);
    }

    function compareDate(dateStr1, dateStr2) {
      return parseMinute(dateStr1) <= parseMinute(dateStr2);
    }
    var nowTime = app.util.formatTime(new Date(), 'h:m');
    _this.data._time.forEach(function (e, i) {
      if (compareDate(e.begin, nowTime) && compareDate(nowTime, e.end)) {
        _this.setData({
          timelineTop: Math.round(e.beginTop + (e.endTop - e.beginTop) * (parseMinute(nowTime) - parseMinute(e.begin)) / 100)
        });
      };
    });
    //设置滚动至当前时间附近，如果周末为设置left为其最大值102
    var nowWeek = new Date().getDay();
    _this.setData({
      'scroll.left': (nowWeek === 6 || nowWeek === 0) ? 102 : 0
    });

  },


  scrollXHandle: function (e) {
    this.setData({
      'scroll.left': e.detail.scrollLeft
    });
  },


  showDetail: function (e) {
    // 点击课程卡片后执行
    var _this = this;
    let week = this.data.viewsWeek;
    let dataset = e.currentTarget.dataset;
    let lessons = this.data.viewsLessons
    var targetI = 0;
    var lesson = []
    var day = dataset.day,
      time = dataset.wid;

    for (var course of lessons) {
      if (((course.week === day) && (course.order === time))) {
        lesson = course
        break;
      }
    }

    lesson.target = true;
    lesson.left = 0;
    targetI = 1;
    lesson.length = 2

    if (lesson.length === 1) {
      e.left = 0;
    } else {
      //笼罩层卡片防止超出课表区域
      //周一~周四0~3:n lessons.length>=2*n+1时，设置left0为-n*128，否则设置为-60*(lessons.length-1)；
      //周日~周五6~4:n lessons.length>=2*(6-n)+1时，设置left0为-(7-n-lessons.length)*128，否则设置为-60*(lessons.length-1)；
      var left0 = -60 * (lessons.length - 1);
      if (dataset.day <= 3 && lessons.length >= 2 * dataset.day + 1) {
        left0 = -dataset.day * 128;
      } else
        if (dataset.day >= 4 && lessons.length >= 2 * (6 - dataset.day) + 1) {
          left0 = -(7 - dataset.day - lessons.length) * 128;
        }
      lesson.left = left0 + 128 * 1;
    }

    this.setData({
      targetX: dataset.day * 129 + 35 + 8,
      targetY: dataset.time * 206 + Math.floor(dataset.wid / 2) * 4 + 60 + 8,
      targetDay: dataset.day,
      targetWid: dataset.time,
      targetI: targetI,
      targetLessons: lesson,
      targetLen: lesson.length,
      blur: true
    });
  },


  hideDetail: function () {
    // 点击遮罩层时触发，取消主体部分的模糊，清空target
    this.setData({
      blur: false,
      targetLessons: [],
      targetX: 0,
      targetY: 0,
      targetDay: 0,
      targetWid: 0,
      targetI: 0,
      targetLen: 0
    });

  },


  infoCardTap: function (e) {
    var dataset = e.currentTarget.dataset;
    if (this.data.targetI == dataset.index) {
      return false;
    }
    this.setData({
      targetI: dataset.index
    });
  },


  infoCardChange: function (e) {
    var current = e.detail.current;
    if (this.data.targetI == current) {
      return false;
    }
    this.setData({
      targetI: current
    });
  },


  chooseView: function () {
    //切换视图(周/学期) *表示学期视图
    this.setData({
      viewsWeek: this.data.viewsWeek == '*' ? this.data.currentWeek : '*'
    });
  },


  returnCurrent: function () {
    //返回本周
    this.setData({
      viewsWeek: this.data.currentWeek
    });
  },


  currentChange: function (e) {
    // 更改底部周数时触发，修改当前选择的周数
   
    let current = e.detail.current 

   
    this.timetableRender(this.data.timeTable)
   
    this.setData({
      viewsWeek: current + 1
    });
  },


  catchMoveDetail: function () {
    /*阻止滑动穿透*/
  },


  bindStartDetail: function (e) {
    this.setData({
      startPoint: [e.touches[0].pageX, e.touches[0].pageY]
    });
  },


  //滑动切换课程详情
  bindMoveDetail: function (e) {
    var _this = this;
    var curPoint = [e.changedTouches[0].pageX, e.changedTouches[0].pageY],
      startPoint = _this.data.startPoint,
      i = 0;
    if (curPoint[0] <= startPoint[0]) {
      if (Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])) {
        if (_this.data.targetI != _this.data.targetLen - 1) {
          i = 1; //左滑
        }
      }
    } else {
      if (Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])) {
        if (_this.data.targetI != 0) {
          i = -1; //右滑
        }
      }
    }
    if (!i) {
      return false;
    }
    _this.setData({
      targetI: parseInt(_this.data.targetI) + i
    });
  },


  //点击左右按钮切换swiper
  swiperChangeBtn: function (e) {
    var _this = this;
    var dataset = e.currentTarget.dataset
    var i
    var data = {}

    if (dataset.direction == 'left') {
   
     if (this.data.viewsWeek == 1) {
        i = 0
       } else {
         i = - 1
      }   
     } 
    else if (dataset.direction == 'right' ) {
     if(this.data.viewsWeek==20){
        i=0
      }else{
       i = 1
    }
     }
      
       
      
     
     
   
   
      data[dataset.target] = parseInt(this.data[dataset.target]) + i;
      
     this.setData(data);
      
  
   
  },

  timetableRender: function (timeTable) {
    var now = new Date()
    let today = now.getDay()
    let viewsLessons = []
    // 这个给颜色是按顺序弹出的
    let colors = ['qing', 'bright-yellow', 'sky-blue', 'bright-blue', 'dark', 'red-purple', 'bright-pink', "grey", 'red', 'green', 'purple', 'yellow', 'blue', 'orange', 'pink',];
    let viewsWeek = this.data.viewsWeek  

    let colorMap = {}

    for (let courseObject of timeTable) {
      let course = {}
      if (courseObject.classInSchoolWeek[viewsWeek - 1] === "1") {
        course.name = courseObject.course.name
        course.room = courseObject.roomName
        course.week = courseObject.classDay
        course.order = courseObject.classOrder
        course.teacher = courseObject.attendClassTeacher
        course.weekDescription = courseObject.weekDescription
        course.credit = courseObject.course.credit
        course.studentCount = courseObject.studentCount
        let key = courseObject.course.num
        if (colorMap[key] === undefined) {
          let color = colors.pop()
          colorMap[key] = color
          course.color = color
        } else {
          course.color = colorMap[key]
        }
        viewsLessons.push(course)
      }
    }

    this.setData({
      today: today,
      viewsLessons: viewsLessons,
      remind: ''
    });
  },

  // 这里需要区分访问的来源
  renderTimeTable: function () {

    let data = wx.getStorageSync('studentTimeTableV2')
    if (!isEmptyObject(data)) {
      this.data.timeTable = data
      this.timetableRender(data)
    }

    getStudentTimeTable()
      .then(studentTimeTable => {
        if (!isEmptyObject(studentTimeTable)) {
          wx.setStorageSync('studentTimeTableV2', studentTimeTable)
          this.data.timeTable = studentTimeTable
          this.timetableRender(studentTimeTable)
        }

      }).catch(exception => {
        console.log(exception)
      })
  },


});