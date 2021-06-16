//xs.js
//获取应用实例
var app = getApp();

import {
  search,
  isEmptyObject,
  searchCourseTimetable
} from '../../../utils/api'

import {
  getCourseOrderName,
  getWeekName
} from '../../../utils/util.js'


Page({
  data: {
    header: {
      defaultValue: '',
      inputValue: '',
      help_status: false
    },
    main: {
      mainDisplay: true, // main 显示的变化标识
      total: 0,
      sum: 0,
      page: 0,
      message: '上滑加载更多'
    },
    testData: [{
      "xb": "男",
      "activeName": "长三",
      "normalXm": "张三"
    }],
    messageObj: { // 查询失败的提示信息展示对象
      messageDisplay: true,
      message: ''
    },
    pageCount: 0
  },

  bindClearSearchTap: function(e) {
    this.setData({
      'main.mainDisplay': true,
      'main.total': 0,
      'main.sum': 0,
      'main.page': 0,
      'main.message': '上滑加载更多',
      'testData': [],
      'header.inputValue': ''
    });
  },

  bindSearchInput: function(e) {
    this.setData({
      'header.inputValue': e.detail.value,
      'main.total': 0,
      'main.sum': 0,
      'main.page': 0,
      'main.message': '上滑加载更多',
      'testData': []
    });
    if (!this.data.messageObj.messageDisplay) {
      this.setData({
        'messageObj.messageDisplay': true,
        'messageObj.message': ''
      });
    }
    return e.detail.value;
  },

  // 点击搜索
  bindConfirmSearchTap: function() {
    this.searchCouse(this.data.header.inputValue, 0)
    // this.setData({
    //   'main.total': 0,
    //   'main.sum': 0,
    //   'main.page': 0,
    //   'main.message': '上滑加载更多',
    //   'testData': []
    // });
    // this.search();
  },

  // 上滑加载更多
  onReachBottom: function() {

    let pageCount = this.data.pageCount + 1
    this.setData({
      pageCount: pageCount
    })

    this.searchCouse(this.data.query, pageCount)
 
  },

  // 搜索
  search1: function(key) {

    var that = this,
      inputValue = key || that.data.header.inputValue,
      messageDisplay = false,
      message = '',
      reDdata = null,
      numberSign = false; // 用户输入的是姓名还是学号的标识

    // 消除字符串首尾的空格
    function trim(str) {

      return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    inputValue = trim(inputValue);

    // 抽离对messageObj的设置成一个单独的函数
    function setMessageObj(messageDisplay, message) {

      that.setData({
        'messageObj.messageDisplay': messageDisplay,
        'messageObj.message': message
      });
    }

    // 对输入的是空格或未进行输入进行处理
    if (inputValue === '') {

      this.setData({
        'main.mainDisplay': true
      });

      return false;
    }

    // 防止注入攻击
    function checkData(v) {

      var temp = v;

      v = v.replace(/\\|\/|\.|\'|\"|\<|\>/g, function(str) {
        return '';
      });
      v = trim(v);

      messageDisplay = v.length < temp.length ? false : true;
      message = '请勿输入非法字符!';

      return v;
    }

    // 对输入进行过滤
    inputValue = checkData(inputValue);

    setMessageObj(messageDisplay, message);
    this.setData({
      'header.inputValue': inputValue
    });

    // 存在非法输入只会提示错误消息而不会发送搜索请求
    if (messageDisplay === false) {
      return false;
    }

    // 对输入类型进行处理 inputValue:String
    if (!isNaN(parseInt(inputValue, 10))) {

      numberSign = true;
    }

    // 处理成功返回的数据
    function doSuccess(data, messageDisplay) {

      var rows = data.rows;
      // 对数据进行自定义加工 给每个数据对象添加一些自定义属性
      function doData(data) {

        var curData = null,
          curXm = null,
          curXh = null,
          len = data.length;

        // 若查询没有查出结果，则直接显示提示信息并退出
        if (len === 0) {
          doFail();
          return false;
        }

        // 对名字的匹配部分进行高亮划分
        function doXm(str, xm) {

          var activeName = '',
            arrXm = xm.split(''),
            strIndex = xm.indexOf(str),
            strLength = str.length;
          if (strIndex == -1) {
            return {
              activeName: '',
              xm: xm
            };
          } else {
            activeName = xm.substr(strIndex, strLength);
            arrXm.splice(strIndex, strLength);
            xm = arrXm.join('');

            return {
              activeName: activeName || '',
              xm: xm || ''
            };
          }
        }

        // 对学号的匹配部分进行高亮划分
        function doXh(str, xh) {

          var activeXh = '',
            arrXh = xh.split(''),
            strIndex = xh.indexOf(str),
            strLength = str.length;
          if (strIndex == -1) {
            return {
              activeXh: '',
              xh: xh
            };
          } else {
            activeXh = xh.substr(strIndex, strLength);
            arrXh.splice(strIndex, strLength);
            xh = arrXh.join('');

            return {
              activeXh: activeXh || '',
              xh: xh || ''
            };
          }
        }

        for (var i = 0; i < len; i++) {

          curData = data[i];
          curXm = numberSign ? curData.xm : doXm(inputValue, curData.xm);
          curXh = !numberSign ? curData.xh : doXh(inputValue, curData.xh);
          curData.display = false; // 添加控制隐藏列表信息显示的标识
          curData.headImg = curData.headImg || '/images/core/xs.png';
          curData.activeName = curXm.activeName || '';
          curData.activeXh = curXh.activeXh || '';
          curData.normalXm = numberSign ? curXm : curXm.xm;
          curData.normalXh = !numberSign ? curXh : curXh.xh;
        }

        return data;
      }

      reDdata = doData(rows);

      // 若reDdata===false, 查询没有结果
      if (reDdata === false) {
        return false;
      }

      that.setData({
        'testData': that.data.testData.concat(reDdata),
        'main.mainDisplay': false,
        'main.total': data.total,
        'main.sum': that.data.main.sum + data.rows.length,
        'messageObj.messageDisplay': messageDisplay,
        'main.message': '上滑加载更多'
      });
      wx.hideToast();

      if (reDdata.length === 1) {
        that.bindOpenList(0);
      }

      if (data.total <= that.data.main.sum) {
        that.setData({
          'main.message': '已全部加载'
        });
      }

    }

    // 处理没找到搜索到结果或错误情况
    function doFail(err) {

      var message = typeof err === 'undefined' ? '未搜索到相关结果' : err;

      setMessageObj(false, message);
      wx.hideToast();
    }

    that.setData({
      'main.message': '正在加载中',
      'main.page': that.data.main.page + 1
    });
    app.showLoadToast();
    wx.request({
      url: app._server + '/api/get_student_info.php',
      method: 'POST',
      data: app.key({
        openid: app._user.openid,
        key: inputValue,
        page: that.data.main.page
      }),
      success: function(res) {

        if (res.data && res.data.status === 200) {

          doSuccess(res.data.data, true);
        } else {

          app.showErrorModal(res.data.message);
          doFail(res.data.message);
        }
      },
      fail: function(res) {

        app.showErrorModal(res.errMsg);
        doFail(res.errMsg);
      }
    });

  },

  searchCouse: function(query, page) {

    wx.showLoading({
      title: '努力搜索中',
    })

    searchCourseTimetable({
        q: query,
        size: 10,
        page: page
      })
      .then(result => {
        if (page > 0) {
          result = this.data.testData.concat(result)
        }

        let start = 0
        let keyList = []
        let resultList = []
        let resultMap = {}
        // 将相同的课程聚合显示
        for (var i = 0, len = result.length; i < len; i++) {
          result[i].idx = i + 1
          result[i].classOrderName = getCourseOrderName(result[i].classOrder)
          result[i].weekName = getWeekName(result[i].classDay)

          let key = result[i].course.id
          if (resultMap[key] === undefined) {
            keyList.push(key)
            resultMap[key] = [result[i]]
          } else {
            let flag = true
            for (let item of resultMap[key]){
              if (item.weekDescription === result[i].weekDescription){
                flag = false
              }
            }
            if(flag){
              resultMap[key] = resultMap[key].concat(result[i])
            }
          }

        }


        for (let key of keyList) {
          
          let timeList = []
          for (let item of resultMap[key]) {
              timeList.push({
                "weekDescription": item.weekDescription,
                "weekName": item.weekName,
                "classOrderName": item.classOrderName,
                "classDay": item.classDay,
                "classOrder": item.classOrder,
                "classRoomName": item.classroom === null ? "暂无" : item.classroom.name,
                "classRoomNumber": item.classroom === null ? "暂无" : item.classroom.number
              })
          }
          resultMap[key][0]["timeList"] = timeList
          resultList.push(resultMap[key][0])

          timeList.sort(function sort_(a, b) {
            if (a.classDay == b.classDay) {
              return a.order - b.order
            } else {
              return a.classDay - b.classDay
            }
          })
        }


        this.setData({
          testData: result,
          placeholder: query,
          query: query,
          showText: false,
          resultList: resultList,
        })
      })
      .then(wx.hideLoading())
  },

  // main——最优
  bindOpenList: function(e) {
    var index = !isNaN(e) ? e : parseInt(e.currentTarget.dataset.index),
      data = {};
    data['resultList[' + index + '].display'] = !this.data.resultList[index].display;
    this.setData(data);
  },

  onLoad: function(options) {

  },
  //让分享时自动登录
  loginHandler: function(options) {
    if (options.key) {
      this.setData({
        'main.mainDisplay': false,
        'header.defaultValue': options.key,
        'header.inputValue': options.key
      });
      this.search();
    }
  },

  tapHelp: function(e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showHelp: function(e) {
    this.setData({
      'header.help_status': true
    });
  },
  hideHelp: function(e) {
    this.setData({
      'header.help_status': false
    });
  }
});