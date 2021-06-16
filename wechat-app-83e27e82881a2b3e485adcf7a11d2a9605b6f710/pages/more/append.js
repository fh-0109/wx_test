var app = getApp();
Page({
  data: {
  },
  onLoad: function () {
    this.setData({
      version: app.version,
      year: new Date().getFullYear()
    });
  },
  toggleLog: function () {
    this.setData({
      showLog: !this.data.showLog
    });
  }
});