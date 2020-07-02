Page({
  data: {
    show: false,
    intervalId: "",
  },
  showPopup(e) {
    var that = this;
    var id = e.currentTarget.dataset.id || 0;
    var resdata = wx.getStorageSync('resdata');
    //console.log(id);
    for (var i=0;i<resdata.length;i++){
      for (var j=0;j<resdata[i].length;j++){
          if(resdata[i] == "NULL"){
            break;
          }
          if(resdata[i][j] == "1"){
            resdata[i][j] = "窗户"+(j+1)+"未关❌";
          }else if(resdata[i][j] == "0"){
            resdata[i][j] = "窗户"+(j+1)+"已关👌";
          }else{
            resdata[i][j] = "窗户"+(j+1)+"故障🚫";
          }
      }
    }
    that.setData({ show: true, windows:resdata[id], arrwindows:resdata[id].length }); 
  },
  onClose() {  // 
    this.setData({ show: false });
  },
  onReady(){
    var that = this;
    setTimeout(function () {wx.hideLoading();},2000);
    that.setData({ intervalId:setInterval(that.Refresh,10000) });
  },
  onLoad: function (){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {that.setData({ times:wx.getStorageSync('times'),arrview:wx.getStorageSync('arrview'),arrfloor:wx.getStorageSync('arrfloor') }); },1000);
  },
  onPullDownRefresh: function(){
    //this.onLoad();
    wx.showLoading({
      title: '加载中',
    });
    this.setData({ times:wx.getStorageSync('times'),arrview:wx.getStorageSync('arrview'),arrfloor:wx.getStorageSync('arrfloor') });
    wx.hideLoading();
    wx.showModal({
      title: "提示",
      content: "数据更新成功" ,
    });
  },
  onUnload: function(){
    clearInterval(this.data.intervalId);
    this.data.intervalId = "";
  },
  Refresh(){
    var that = this;
    var arrfloorname = wx.getStorageSync('arrfloorname');
    wx.request({  
      url: 'https://wlaport.top/apitest.php?floor='+encodeURI(arrfloorname),  //这里''里面填写你的服务器API接口的路径  
      data: {},  //这里是可以填写服务器需要的参数  
      method: 'GET', // 声明GET请求  
      // header: {}, // 设置请求的 header，GET请求可以不填  
      success: function(res){
        // console.log("返回成功的数据:" + res.data ); //返回的会是对象，可以用JSON转字符串打印出来方便查看数据  
        // console.log("返回成功的数据:"+ JSON.stringify(res.data)); //这样就可以愉快的看到后台的数据啦
        // console.log(res.data["data"].length);
        var arrfloor = Array();
        for (var i=0;i<res.data['data'].length;i++){
          if(res.data['data'][i] == "NULL"){
            continue;
          }
          arrfloor.push(i+1)
        }
        var arrview = Array();
        var view = 0;
        for (var i=0;i<res.data['data'].length;i++){
          for (var j=0;j<res.data['data'][i].length;j++){
            if(res.data['data'][i] == "NULL"){
              view = 3;
              break;
            }
            if(res.data['data'][i][j] == '1'){
              if(view == -1){
                view = 2;
                break;
              }
              view = 1;
            }
            if(res.data['data'][i][j] == '-1'){
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
        console.log(arrview);
        //var arrfloor = res.data["data"].length;
        //time.timeFn(arrfloorname,res.data['time']);  
        var times = res.data["time"];
        //console.log(times);
        that.setData({ times:times,arrview:arrview,arrfloor:arrfloor });
        wx.setStorage({
          key:"resdata",
          data:res.data["data"]
        });
        // console.log(res.data["data"]);
        // that.setData({floorview:floorview});
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
      
    });
  }
});
