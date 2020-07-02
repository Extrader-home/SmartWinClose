var time = require('../../time');
Page({
  data: {
    activeNames: null,
  },
  onChange(e) {
    this.setData({
      activeNames: e.detail,
    });
    var that = this;
    var arrfloornames = e.currentTarget.dataset.names || 0;
    var malfunction = Array();
    console.log(arrfloornames);
    wx.request({  
      url: 'https://wlaport.top/apitest.php?floor='+encodeURI(arrfloornames),  //这里''里面填写你的服务器API接口的路径  
      data: {},  //这里是可以填写服务器需要的参数  
      method: 'GET', // 声明GET请求  
      // header: {}, // 设置请求的 header，GET请求可以不填  
      success: function(res){  
        time.timeFn(arrfloornames,res.data['time']);  
        for (var i=0;i<res.data["data"].length;i++){
          for (var j=0;j<res.data["data"][i].length;j++){
              if(res.data['data'][i] == "NULL"){
                break;
              }
              if(res.data["data"][i][j] == "-1"){
                res.data["data"][i][j] = (i+1)+"楼 -> "+(j+1)+"窗 -> 故障🚫";
                malfunction.push(res.data["data"][i][j])
              }
          }
        }
        console.log(malfunction);
        //console.log(res.data["data"]);
        that.setData({ malfunction:malfunction, arrmalfunction:malfunction.length })
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
  },
  onClose(){
    this.setData({
      activeNames: null,
    });
  },
  onLoad: function(){
    var that = this;
    var malfunctionflag = [];
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://wlaport.top/apitest.php?floor=1',
        methods: 'GET',
        success: function(res){
          //console.log(encodeURI(res.data["floor"]));
          that.setData({ floorname:res.data["floor"],arrfloorname:res.data["floor"].length });
          console.log(encodeURI(res.data["floor"]));
          that.setData({ floorname:res.data["floor"],arrfloorname:res.data["floor"].length });
          //console.log(res.data["floor"]);
          for(var k = 0;k < res.data["floor"].length;k++){
          wx.request({  
            url: 'https://wlaport.top/apitest.php?floor='+encodeURI(res.data["floor"][k]),  //这里''里面填写你的服务器API接口的路径  
            data: {},  //这里是可以填写服务器需要的参数  
            method: 'GET', // 声明GET请求  
            // header: {}, // 设置请求的 header，GET请求可以不填  
            success: function(res1){  
              var flag = 0;
              for (var i=0;i<res1.data['data'].length;i++){
                for (var j=0;j<res1.data['data'][i].length;j++){
                  if(res1.data['data'][i] === "NULL"){
                    break;
                  }
                  if(res1.data['data'][i][j] === "-1"){
                    flag = 1;
                    break;
                  }
                }
                if(flag === 1){
                  malfunctionflag.push(1);
                  break;
                }
                if(i === res1.data['data'].length-1 && flag === 0){
                  malfunctionflag.push(0);
                  break;
                }
              };
              that.setData({ malfunctionflag:malfunctionflag });
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
    });
  },
  onPullDownRefresh: function(){
    this.onLoad();
    wx.showModal({
      title: "提示",
      content: "数据更新成功" ,
    });
  },
  onHide: function(){
    var that = this;
    that.setData({ malfunctionflag:[] });
  },
});