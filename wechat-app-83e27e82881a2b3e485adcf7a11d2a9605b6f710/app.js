//app.js


App({
  today: '',
  openid: '',
  beginweek: new Date(2020, (8 - 1), 24),
  schoolWeek: '',
  util: require('./utils/util'),
  userinfo: {},
  _user: {},

  globalData: {
    userInfo: null,
    openid: null,
    appId: null,
  },

  globalCache: {
    studentInfo : null
  },

  onLaunch: function () {
    wx.cloud.init()
    this.checkLogin()
    this.initGloableData()

    wx.cloud.callFunction({
        name: 'getAppInfo'
      })
      .then(res => {
        this.globalData.appId = res.result.appid
        this.globalData.openid = res.result.openid
      })
      .catch(err => console.error(err))


    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.model = e.model
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })


  },

  initGloableData() {
    let res = wx.getStorageInfoSync()
    for(let key of res.keys) {
      this.globalCache[key] = wx.getStorageSync(key)
    }
    console.log(this.globalCache)
  },

  clearCache() {
      wx.clearStorageSync()
      this.globalCache = {}
  },

  addCache(key, value) {
    wx.setStorageSync(key, value)
    this.globalCache[key] = value
  },


  checkLogin: function () {

    let studentInfo = wx.getStorageSync('studentInfo')

    if (studentInfo === null || studentInfo === '') {
      wx.reLaunch({
        url: '/pages/more/login'
      });

      return false
    }
    return true
  },


  getToken: function () {
    let token = wx.getStorageSync("TOKEN")

    if (token === null || token === '') {
      wx.reLaunch({
        url: '/pages/more/login'
      });
    }
    return token
  },


  /**
   * 获取当前时间是第几个教学周
   */
  getSchoolWeek: function () {
    let now = new Date()
    let thisweek = parseInt((now - this.beginweek) / (24 * 60 * 60 * 1000 * 7) + 1)

    return thisweek < 1 ? 1 : thisweek
  },

  /**
   * 获取当前星期几
   */
  getDay: function () {
    let now = new Date()
    return now.getDay()
  },

  formatTime: function (date, t) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (t === 'h:m') {
      return [hour, minute].map(formatNumber).join(':');
    } else {
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
    }
  },

  formatNumber: function (n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },

});