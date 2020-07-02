import list from '../../config';
const app = getApp();
Page({
  data: {
    list,
    intervalId: "",
    checked: app.globalData.kg,
  },
  //获取用户的openid
  getOpenid() {
    wx.cloud.callFunction({
      name: "getopenid",
    }).then(res => {
      let openid = res.result.openid;
      let caveattime= "2020/06/18 22:11:29";
      console.log("获取openid成功", openid,"获取时间成功", caveattime);
      // this.send(openid,caveattime);
      wx.request({
        url: 'http://127.0.0.1:5000/index?openid='+openid,  //这里''里面填写你的服务器API接口的路径  
        data: {},  //这里是可以填写服务器需要的参数  
        method: 'GET', // 声明GET请求  
        // header: {}, // 设置请求的 header，GET请求可以不填  
        success: function(res){  
        },
        fail: function(fail) {  
          wx.showModal({
            title: "警告⚠",
            content: "服务器数据无响应，请联系管理员检查后台连接" ,
          });
        },  
        complete: function(arr) {
          //console.log("返回成功的数据:" + arr.data );// 这里是请求以后返回的所有信息，请求方法同上，把res改成arr就行了  
        }  
      })  
    }).catch(res => {
      console.log("获取openid失败", res);
    })
  },
  // //发送模板消息到指定用户,推送之前要先获取用户的openid
  // send(openid,caveattime) {
  //   wx.cloud.callFunction({
  //     name: "app",
  //     data: {
  //       openid: openid,
  //       time: caveattime,
  //     }
  //   }).then(res => {
  //     console.log("推送消息成功", res);
  //     console.log(time);
  //   }).catch(res => {
  //     console.log("推送消息失败", res)
  //   })
  // },
  onClick(event) {
    wx.navigateTo({
      url: event.target.dataset.url
    });
    this.setData({ nocloseflag:[],malfunctionflag:[] });
  },
  SwitchChange({ detail }){
    let fs = wx.getFileSystemManager()
    console.log(detail)
    if(detail == "Y"){
      wx.showModal({
        title: '提示',
        content: '是否开启报警？',
        success: (res) => {
          if (res.confirm) {
            this.setData({ checked: detail });
            this.getOpenid();
            wx.requestSubscribeMessage({
              tmplIds: ['rAGivRB2e62iTigvoHj2vkamvR_0RxCViytS1IolHOo'],  //这里填入我们生成的模板id
              success (res) {
                
                console.log('授权成功',res);
               },
               fail(res){
                console.log('授权失败',res);
               }
            })
          }
        },
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '是否关闭报警？',
        success: (res) => {
          if (res.confirm) {
            this.setData({ checked: detail });
          }
        },
      });
    }
  },
  subscription(key){
    if(key == "Y"){

    }else{

    }
  },
  onLoad: function (){
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://wlaport.top/apitest.php?floor=1',
        methods: 'GET',
        success: function(res){
          //console.log(res.data["floor"]);
          for(var k = 0;k < res.data["floor"].length;k++){
          wx.request({
            url: 'https://wlaport.top/apitest.php?floor='+encodeURI(res.data["floor"][k]),  //这里''里面填写你的服务器API接口的路径  
            data: {},  //这里是可以填写服务器需要的参数  
            method: 'GET', // 声明GET请求  
            // header: {}, // 设置请求的 header，GET请求可以不填  
            success: function(res1){  
              var noclose = 0,malfunction = 0;
              for (var i=0;i<res1.data['data'].length;i++){
                for (var j=0;j<res1.data['data'][i].length;j++){
                  if(res1.data['data'][i][j] === "1"){
                    noclose = 1;
                  }
                  if(res1.data['data'][i][j] === "-1"){
                    malfunction = 1;
                  }
                }
              };
              //console.log(noclose);
              //console.log(malfunction);
              that.setData({ noclose:noclose,malfunction:malfunction });
            },
            fail: function(fail1) {  
              wx.showModal({
                title: "警告⚠",
                content: "服务器数据无响应，请联系管理员检查后台连接" ,
              });
            },  
            complete: function(arr1) {
              //console.log("返回成功的数据:" + arr.data );// 这里是请求以后返回的所有信息，请求方法同上，把res改成arr就行了  
            }  
            
          })  
          }
        },
        fail: function(fail) {  
          wx.showModal({
            title: "警告⚠",
            content: "服务器数据无响应，请联系管理员检查后台连接" ,
          });
        }, 
        complete: function(arr) {
          //console.log("返回成功的数据:" + arr.data );// 这里是请求以后返回的所有信息，请求方法同上，把res改成arr就行了  
        },
      });
    })
  },
  onReady(){
    var that = this;
    that.setData({ intervalId:setInterval(that.onLoad,10000) });
  },
  onPullDownRefresh: function(){
    this.onLoad();
    wx.showModal({
      title: "提示",
      content: "数据更新成功" ,
    });
  },
  onUnload: function(){
    clearInterval(this.data.intervalId);
    this.data.intervalId = "";
  },
});
