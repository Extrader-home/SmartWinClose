//app.js
App({
  globalData:{
    kg:"",
  },
  onLaunch: function(){
    wx.cloud.init({
      env: 'smartwinclose',
      traceUser: true,
  })
  },
})