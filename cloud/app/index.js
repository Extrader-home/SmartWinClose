// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, //要推送给那个用户
      //page: 'pages/index/index', //要跳转到那个小程序页面
      data: {//推送的内容
        thing1:{
          value:"窗户打开"
        },
        time2:{
          value: event.time
        },
        thing3:{
          value:"窗户打开"
        },
        thing4:{
          value:"窗户打开"
        },
        thing5:{
          value:"窗户打开"
        },
      },
      templateId: 'rAGivRB2e62iTigvoHj2vkamvR_0RxCViytS1IolHOo' //模板id
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}