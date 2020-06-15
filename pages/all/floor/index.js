Page({
  data: {
    show: false,
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
    // if(time.timeFn(res.data['time'].lasttime()) === 1){
    //   res.data["time"] = "您的设备长时间未更新，请及时检查设备情况";
    //   console.log(res.data["time"]);
    // }else if(time.timeFn(res.data['time']) === 0){
    //   console.log(res.data["time"]);
    // }
    // console.log(res.data["data"]);
    // console.log(res.data["data"][0].length);
    //console.log(res.data["time"]);
    // console.log(res.data["data"].length);
    that.setData({ show: true, windows:resdata[id], arrwindows:resdata[id].length }); 
    // wx.removeStorage({
    //   key: 'arrview',
    // })
  },

  onClose() {
    this.setData({ show: false });
  },
  onLoad: function (){
    var that = this;
    that.setData({ times:wx.getStorageSync('times'),arrview:wx.getStorageSync('arrview'),arrfloor:wx.getStorageSync('arrfloor') });
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
    that.setData({ times:null,arrview:null,arrfloor:null });
    wx.removeStorage({
      key: 'arrview',
    });
    wx.removeStorage({
      key: 'times',
    });
    wx.removeStorage({
      key: 'arrfloor',
    })
  },
  // onUnload: function(){
  //   wx.removeStorage({
  //     key: 'arrview',
  //   })
  // },
});
