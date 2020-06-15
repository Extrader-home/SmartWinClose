Component({
  properties: {
    group: Object
  },

  methods: {
    onClick(event) {
      wx.navigateTo({
        url: event.target.dataset.url
      });
      this.setData({ nocloseflag:[],malfunctionflag:[] });
    }
  },
  attached: function (){
    var that = this;
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
  },
});
