function timeFn(floorname,d1) {//di作为一个变量传进来
  //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
  var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
  var dateEnd = new Date();//获取当前时间
  var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
  var leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
  var hours=Math.floor(leave1/(3600*1000))//计算出小时数
  //计算相差分钟数
  var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
  var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
  //计算相差秒数
  var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
  var seconds=Math.round(leave3/1000)
  var key
  if(dayDiff>0 || hours>=1){
    wx.showModal({
      title: "提示",
      content: floorname+"的设备已经"+dayDiff+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒"+"未更新   "+"请检查设备连接状态" ,
    })
  }else{
    wx.showModal({
        title: "提示",
        content: floorname+"的数据更新成功" ,
      });
    }
  //console.log(dateDiff+"时间差的毫秒数",dayDiff+"计算出相差天数",leave1+"计算天数后剩余的毫秒数",hours+"计算出小时数",minutes+"计算相差分钟数",seconds+"计算相差秒数");
}
module.exports.timeFn = timeFn
// var t3="2017-08-18 04:56:38";
// timeFn(t3);