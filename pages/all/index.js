var time = require('../../time');
Component({
  data: {

  },
  methods: {
    getfloor(e) {
      var that = this;
      var arrfloorname = e.currentTarget.dataset.name || 0;
      wx.setStorage({
        key:"arrfloorname",
        data:arrfloorname
      })
      //console.log(encodeURI(name));
      wx.request({  
        url: 'https://wlaport.top/apitest.php?floor='+encodeURI(arrfloorname),  //这里''里面填写你的服务器API接口的路径  
        data: {},  //这里是可以填写服务器需要的参数  
        method: 'GET', // 声明GET请求  
        // header: {}, // 设置请求的 header，GET请求可以不填  
        success: function(res){  
          // console.log("返回成功的数据:" + res.data ); //返回的会是对象，可以用JSON转字符串打印出来方便查看数据  
          // console.log("返回成功的数据:"+ JSON.stringify(res.data)); //这样就可以愉快的看到后台的数据啦
          // console.log(res.data["data"].length);
          var arrview = Array();
          var view = 0;
          var floorview = 0;
          for (var i=0;i<res.data['data'].length;i++){
            for (var j=0;j<res.data['data'][i].length;j++){
              if(res.data['data'][i][j] == 1){
                if(view == -1){
                  view = 2;
                  break;
                }
                view = 1;
              }
              if(res.data['data'][i][j] == -1){
                if(view == 1){
                  view = 2;
                  break;
                }
                view = -1;
              }
            }
            arrview.push(view);
            view = 0;
          };
          for(var i = 0; i < arrview.length;i++){
            if(arrview[i] == 2){
              floorview = 2;
              break;
            }
            if(arrview[i] == 1){
              if(floorview == -1){
                floorview = 2;
                break;
              }
              floorview = 1;
              continue;
            }
            if(arrview[i] == -1){
              if(floorview == 1){
                floorview = 2;
                break;
              }
              floorview = -1;
              continue;
            }
          };
          console.log(floorview);
          console.log(arrview);
          var arrfloor = res.data["data"].length;
          time.timeFn(arrfloorname,res.data['time']);  
          var times = res.data["time"];
          //console.log(times);
          wx.setStorage({
            key:"arrfloor",
            data:arrfloor
          });
          wx.setStorage({
            key:"times",
            data:times
          });
          wx.setStorage({
            key:"arrview",
            data:arrview
          });
          console.log(res.data["data"]);
          wx.setStorage({
            key:"resdata",
            data:res.data["data"]
          });
          that.setData({floorview:floorview});
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
  },
  attached: function (){
    var that = this;
    wx.request({
      url: 'https://wlaport.top/apitest.php?floor=1',
      methods: 'GET',
      success: function(res){
        //console.log(encodeURI(res.data["floor"]));
        that.setData({ floorname:res.data["floor"],arrfloorname:res.data["floor"].length });
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
  },
  // ready: function(){
  //   wx.removeStorage({
  //     key: 'arrview',
  //   });
  // }
});
