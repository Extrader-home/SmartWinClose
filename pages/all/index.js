import Dialog from '../../dist/dialog/dialog';
var time = require('../../utils/time');
Page({
	data: {

	},
	getfloor(e) {
		var that = this;
		that.setData({ times:null,arrview:null,arrfloor:null });
		// 获取楼栋名字
		var arrfloorname = e.currentTarget.dataset.name || 0;
		return new Promise(function (resolve, reject){
			// 传递楼栋名字
			wx.setStorage({
				key:"arrfloorname",
				data:arrfloorname
			});
			wx.request({  
				url: 'https://wlaport.top/apitest.php?floor='+encodeURI(arrfloorname),
				data: {},      //这里是可以填写服务器需要的参数  
				method: 'GET', // 声明GET请求  
				// header: {}, // 设置请求的 header，GET请求可以不填  
				success: function(res){
					// 定义楼层名字数组
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
					time.timeFn(arrfloorname,res.data['time']);  
					var times = res.data["time"];
					// 传递已有楼层名字数组
					wx.setStorage({
						key:"arrfloor",
						data:arrfloor
					});
					// 传递系统时间
					wx.setStorage({
						key:"times",
						data:times
					});
					// 传递显示图标的参数，
					wx.setStorage({
						key:"arrview",
						data:arrview
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
	onLoad: function (){
		var that = this;
		return new Promise(function (resolve, reject){
			wx.request({
				url: 'https://wlaport.top/apitest.php?floor=1',
				methods: 'GET',
				success: function(res){
					that.setData({ floorname:res.data["floor"],arrfloorname:res.data["floor"].length });
				},
				fail: function(fail) {  
					Dialog.confirm({
					title: "警告⚠",
					message: "服务器数据无响应，请联系管理员检查后台连接" ,
					});
				}, 
				complete: function(arr) { },
			});
		})
	},
});
