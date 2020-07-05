import Dialog from '../../../dist/dialog/dialog';
Page({
	data: {
		show: false,
		intervalId: "",
	},
	// 点击显示窗户详情
	showPopup(e) {
		var that = this;
		// 获取点击时的id，来显示窗户情况
		var id = e.currentTarget.dataset.id || 0;
		var arrfloorname = wx.getStorageSync('arrfloorname');
		return new Promise(function (resolve, reject){
			wx.request({  
				url: 'https://wlaport.top/apitest.php?floor='+encodeURI(arrfloorname),
				data: {},      //这里是可以填写服务器需要的参数  
				method: 'GET', // 声明GET请求  
				// header: {}, // 设置请求的 header，GET请求可以不填  
				success: function(res){
				for (var i=0;i<res.data['data'].length;i++){
					for (var j=0;j<res.data['data'][i].length;j++){
						if(res.data['data'][i] == "NULL"){
							break;
						}
						if(res.data['data'][i][j] == "1"){
							res.data['data'][i][j] = "窗户"+(j+1)+"未关❌";
						}else if(res.data['data'][i][j] == "0"){
							res.data['data'][i][j] = "窗户"+(j+1)+"已关👌";
						}else{
							res.data['data'][i][j] = "窗户"+(j+1)+"故障🚫";
						}
					}
				}
				that.setData({ show: true, windows:res.data['data'][id], arrwindows:res.data['data'][id].length }); 
				},
				fail: function(fail) {  
					Dialog.confirm({
						title: "警告⚠",
						message: "服务器数据无响应，请联系管理员检查后台连接" ,
					});
				},
				complete: function(arr) { },
			});
		});
	},
	// 关闭弹窗触发
	onClose() {
		this.setData({ show: false });
	},
	onReady(){
		var that = this;
		// 显示加载图标
		setTimeout(function () {wx.hideLoading();},2000);
		// 定时刷新
		that.setData({ intervalId:setInterval(that.Refresh,10000) });
	},
	onLoad: function (){
		var that = this;
		wx.showLoading({
			title: '加载中',
		});
		// 获取前面页面传来的数据
		setTimeout(function () {that.setData({ times:wx.getStorageSync('times'),arrview:wx.getStorageSync('arrview'),arrfloor:wx.getStorageSync('arrfloor') }); },1000);
	},
	onPullDownRefresh: function(){
		wx.showLoading({
			title: '加载中',
		});
		// 获取更新后的数据
		this.setData({ times:wx.getStorageSync('times'),arrview:wx.getStorageSync('arrview'),arrfloor:wx.getStorageSync('arrfloor') });
		wx.hideLoading();
		Dialog.confirm({
			title: "提示",
			message: "数据更新成功" ,
		});
	},
	onUnload: function(){
		// 清除定时器
		clearInterval(this.data.intervalId);
		this.data.intervalId = "";
	},
	// 刷新界面显示
	Refresh(){
		var that = this;
		var arrfloorname = wx.getStorageSync('arrfloorname');
		return new Promise(function (resolve, reject){
			wx.request({  
				url: 'https://wlaport.top/apitest.php?floor='+encodeURI(arrfloorname),  //这里''里面填写你的服务器API接口的路径  
				data: {},      //这里是可以填写服务器需要的参数  
				method: 'GET', // 声明GET请求  
				// header: {}, // 设置请求的 header，GET请求可以不填  
				success: function(res){
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
				var times = res.data["time"];
				that.setData({ times:times,arrview:arrview,arrfloor:arrfloor });
				wx.setStorage({
					key:"resdata",
					data:res.data["data"]
				});
				},
				fail: function(fail) {  
					Dialog.confirm({
						title: "警告⚠",
						message: "服务器数据无响应，请联系管理员检查后台连接" ,
					});
				},
				complete: function(arr) { },
			});
		});
	},
});
