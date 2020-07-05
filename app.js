//app.js
App({
  globalData:{
  },
  onLaunch: function(){  // 监听小程序初始化
    wx.cloud.init({
      env: 'smartwinclose',
      traceUser: true,
    });
  },
})