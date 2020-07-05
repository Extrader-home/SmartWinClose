import list from '../../config';
import Dialog from '../../dist/dialog/dialog';
const app = getApp();
Page({
	data: {
		list,
		intervalId: "",
		checked: "N",
		// token为登录判断，2 为加载，1为登录成功，0 Wie登录失败则可点击按键跳转到登录页面
		token:2
	},
	//goto登录界面
	gotologin(){
		wx.reLaunch({
			url: '/pages/login/index',
		});
	},
	// 判断该用户是否有开启报警功能
	AlarmStatus(openid) {
		var that = this;
		wx.request({
			url: 'http://47.106.160.176:8888/?openid='+openid,
			data: { },     //这里是可以填写服务器需要的参数  
			method: 'GET', // 声明GET请求  
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			}, // 设置请求的 header，GET请求可以不填  
			success: function(res){  
			// console.log(res.data);
				if(res.data == "Y"){
					that.setData({ checked:"Y" });
				}else if(res.data == "N"){
					that.setData({ checked:"N" });
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
	},
	//获取用户的openid,并判断是否在数据库中存在,存在则跳转到index，不存在则跳转到登录页面
	getOpenid() {
		var that = this;
		wx.cloud.callFunction({
			name: "getopenid",
		}).then(res => {
			let openid = res.result.openid;
			console.log("获取openid成功", openid);
			// this.send(openid,caveattime);
			return new Promise(function (resolve, reject) {
				wx.request({
					url: 'https://wlaport.top/login.php?mode=0',
					data: {
						openid: openid
					},  //这里是可以填写服务器需要的参数  
					method: 'POST', // 声明POTS请求  
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}, // 设置请求的 header，GET请求可以不填  
					success: function(res){  
						// console.log(res.data);
						if(res.data == "0"){
							that.setData({ token:0 });
						}else if(res.data == "1"){
							that.setData({ token:1 });
						}
						that.AlarmStatus(openid)
					},
					fail: function(fail) {  
						Dialog.confirm({
							title: "警告⚠",
							message: "服务器数据无响应，请联系管理员检查后台连接" ,
						});
					},  
					complete: function(arr) { },
				})  
			});
		}).catch(res => {
			console.log("获取openid失败", res);
		})
	},
	// 点击触发
	onClick(event) {
		wx.navigateTo({
			url: event.target.dataset.url
		});
	},
	// 开启报警功能
	StartAlarm(){
		wx.cloud.callFunction({
			name: "getopenid",
		}).then(res => {
			let openid = res.result.openid;
			console.log("获取openid成功", openid);
			wx.request({
				url: 'http://47.106.160.176:8888/index?floor=all&openid='+openid,
				data: {},  //这里是可以填写服务器需要的参数  
				method: 'GET', // 声明GET请求  
				// header: {}, // 设置请求的 header，GET请求可以不填  
				success: function(res){  
					Dialog.confirm({
						title: "提醒",
						message: "报警功能开启成功！！！" ,
					});
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
	// 关闭报警功能
	CloseAlarm(){
		wx.cloud.callFunction({
			name: "getopenid",
		}).then(res => {
			let openid = res.result.openid;
			console.log("获取openid成功", openid);
				wx.request({
				url: 'http://47.106.160.176:8888/Alarm?alarm=N&openid='+openid,
				data: {},      //这里是可以填写服务器需要的参数  
				method: 'GET', // 声明GET请求  
				// header: {}, // 设置请求的 header，GET请求可以不填  
				success: function(res){  
					Dialog.confirm({
					title: "提醒",
					message: "报警功能关闭成功！！！" ,
					});
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
	// 点击开关触发，开启报警还是关闭报警
	SwitchChange({ detail }){
		var that = this;
		if(detail == "Y"){
			wx.showModal({
				title: '提示',
				content: '是否开启报警？',
				success: (res) => {
					if (res.confirm) {
						this.setData({ checked: detail });
						wx.requestSubscribeMessage({
							tmplIds: ['rAGivRB2e62iTigvoHj2vkamvR_0RxCViytS1IolHOo'],  //这里填入我们生成的模板id
							success (res) {
								console.log('授权成功',res);
								that.StartAlarm();
							},
							fail(res){
								console.log('授权失败',res);
							},
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
						that.CloseAlarm()
					}
				},
			});
		}
	},
	// 先判断是否有登录，在判断时候显示未关和故障标签
	onLoad: function (){
		this.getOpenid();
		var that = this;
		return new Promise(function (resolve, reject) {
			wx.request({
				url: 'https://wlaport.top/apitest.php?floor=1',
				methods: 'GET',
				success: function(res_all){
					//console.log(res.data["floor"]);
					for(var k = 0;k < res_all.data["floor"].length;k++){
						wx.request({
							url: 'https://wlaport.top/apitest.php?floor='+encodeURI(res_all.data["floor"][k]),
							data: {},      //这里是可以填写服务器需要的参数  
							method: 'GET', // 声明GET请求  
							// header: {}, // 设置请求的 header，GET请求可以不填  
							success: function(res_floor){  
								var noclose = 0,malfunction = 0;
								for (var i=0;i<res_floor.data['data'].length;i++){
									for (var j=0;j<res_floor.data['data'][i].length;j++){
										if(res_floor.data['data'][i][j] === "1"){
											noclose = 1;
										}
										if(res_floor.data['data'][i][j] === "-1"){
											malfunction = 1;
										}
									}
								};
								that.setData({ noclose:noclose,malfunction:malfunction });
							},
							fail: function(fail_floor) {  
								Dialog.confirm({
									title: "警告⚠",
									message: "服务器数据无响应，请联系管理员检查后台连接" ,
								});
							},  
							complete: function(arr_floor) { },
						})  
					}
				},
				fail: function(fail_all) {  
					Dialog.confirm({
					title: "警告⚠",
					message: "服务器数据无响应，请联系管理员检查后台连接" ,
					});
				}, 
				complete: function(arr_all) { },
			});
		})
	},
	onPullDownRefresh: function(){
		this.onLoad();
		Dialog.confirm({
			title: "提示",
			message: "数据更新成功" ,
		});
	},
});