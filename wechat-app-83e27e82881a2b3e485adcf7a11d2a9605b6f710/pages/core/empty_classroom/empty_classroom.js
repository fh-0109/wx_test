import {
  getEmptyRoom,
  isEmptyObject,
} from '../../../utils/api'

const app = getApp()
Page({
  data: {
    // 空教室返回
    showMes: '',
    chaxunResult: '',
    //日期选择：
    multiArray: [
      [
        '第一周',
        '第二周',
        '第三周',
        '第四周',
        '第五周',
        '第六周',
        '第七周',
        '第八周',
        '第九周',
        '第十周',
        '第十一周',
        '第十二周',
        '第十三周',
        '第十四周',
        '第十五周',
        '第十六周',
        '第十七周',
        '第十八周'
      ],
      [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期天',
      ]
    ],
    multiIndex: [0, 0],

    locationIndex: 0, //默认选择科厦
    numberindex: 0, //默认显示位置

    locationArray: ['科厦', '主楼(东区)', '主楼(西区)'],
    array: ['上午第一节', '上午第二节', '下午第一节', '下午第二节', '晚上第一节'],

    buildingCode: [
      "02", "01", "03"
    ]
  },

  onLoad: function(options) {
    this.setData({
      multiIndex: [app.getSchoolWeek() - 1, app.getDay() - 1]
    })
  },
  /**
   * 周选择事件
   */
  bindMultiPickerChange: function(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },

  bindPickerChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      locationIndex: e.detail.value
    })
  },

  /**
   * 点击查询
   */
  search: function(event) {
    console.log(this.data.multiIndex[0] + 1, this.data.multiIndex[1] + 1, this.data.locationArray[this.data.locationIndex]);
    let that = this

    wx.showLoading({
      title: '努力查找中',
    })
    let data = {
      "schoolWeek": this.data.multiIndex[0] + 1, //教学周
      "dayOfWeek": this.data.multiIndex[1] + 1, //星期
      "building": this.data.buildingCode[this.data.locationIndex], //建筑
    }

    getEmptyRoom(data).then(data => {
      if (isEmptyObject(data)) {
        wx.showToast({
          title: '没有找到空教室~',
        })
      } else {
        let chaxunResult = []
        for (let item of data){
          for (let order of item.orderList){
            if(order === 0){
              chaxunResult.push(item)
              break
            }
          }

        }


        this.setData({
          chaxunResult: chaxunResult
        })
      }
    }).catch(exception => {
      wx.showToast({
        title: '查询失败~',
      })
    }).finally(x=> {
      wx.hideLoading()
    })


  }

})