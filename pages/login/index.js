import Dialog from '../../dist/dialog/dialog';
Page({
	data: {
	},
	login: function(e){
		var that = this;
		var wechat_name = ""
		var username = e.detail.value.username;
		var password = e.detail.value.password;
		wx.getSetting({
			success(res) {
				if (res.authSetting['scope.userInfo']) {
					console.log("已授权")
					wx.getUserInfo({
						success(res) {
							// console.log("获取用户信息成功", res)
							wechat_name = res.userInfo.nickName;
							that.user_login(username, password, wechat_name);
							console.log(username, password, wechat_name);
						},
						fail(res) {
							// console.log("获取用户信息失败", res);
							that.user_login(username, password, wechat_name);
							console.log(username, password, wechat_name);
						}
					})
				} else {
					console.log("未授权")
					Dialog.confirm({
						title: '提示！',
						confirmButtonText: '去设置',
						//showCancel: false,  // 可关闭取消按钮
						message: "当前小程序未授权，请点击下方按钮“进入授权页面”",
					})
				}
			}
		})
	},
	user_login(username, password, wechat_name){
		// 调用云函数获取openid
		wx.cloud.callFunction({
			name: "getopenid",
		}).then(res => {
			let openid = res.result.openid;
			console.log("获取openid成功", openid);
			// 获取openid后，openid是对数据库中的openid进行更新操作，进行登录
			wx.request({
				url: 'https://wlaport.top/login.php?mode=1',
				data: {
					openid: openid,
					username: username,
					password: password,
					wechat_name: wechat_name
				}, 
				method: 'POST', // 声明POST请求  
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				}, // 设置请求的 header
				success: function(res){  
					console.log(res.data);
					if(res.data == "0"){
						Dialog.confirm({
							title: "提示",
							message: "账号或密码错误!若有疑问请联系系统管理员！" ,
						});
					}else if(res.data == "1"){
						wx.reLaunch({
							url: '/pages/index/index',
						});
						console.log("登录成功");
					}
				},
				fail: function(fail) {  
					Dialog.confirm({
						title: "警告⚠",
						message: "服务器数据无响应，请联系管理员检查后台连接" ,
					});
				},  
				complete: function(arr) { },
			})  
		}).catch(res => {
			console.log("获取openid失败", res);
		})
	},
});