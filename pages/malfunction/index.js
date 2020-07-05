// 和notclose中的代码相似，这里就不贴出注释了
import Dialog from '../../dist/dialog/dialog';
var time = require('../../utils/time');
Page({
	data: {
		activeNames: null,
	},
	onChange(e) {
		this.setData({
			activeNames: e.detail,
		});
		var that = this;
		var arrfloornames = e.currentTarget.dataset.names || 0;
		var malfunction = Array();
		// console.log(arrfloornames);
		wx.request({  
			url: 'https://wlaport.top/apitest.php?floor='+encodeURI(arrfloornames),
			data: {},      //这里是可以填写服务器需要的参数  
			method: 'GET', // 声明GET请求  
			// header: {}, // 设置请求的 header，GET请求可以不填  
			success: function(res){  
			time.timeFn(arrfloornames,res.data['time']);  
			for (var i=0;i<res.data["data"].length;i++){
				for (var j=0;j<res.data["data"][i].length;j++){
					if(res.data['data'][i] == "NULL"){
						break;
					}
					if(res.data["data"][i][j] == "-1"){
						res.data["data"][i][j] = (i+1)+"楼 -> "+(j+1)+"窗 -> 故障🚫";
						malfunction.push(res.data["data"][i][j])
					}
				}
			}
			// console.log(malfunction);
			that.setData({ malfunction:malfunction, arrmalfunction:malfunction.length })
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
	onClose(){
		this.setData({
			activeNames: null,
		});
	},
	onLoad: function(){
		var that = this;
		var malfunctionflag = [];
		return new Promise(function (resolve, reject) {
			wx.request({
				url: 'https://wlaport.top/apitest.php?floor=1',
				methods: 'GET',
				success: function(res_all){
					for(var k = 0;k < res_all.data["floor"].length;k++){
						wx.request({
						url: 'https://wlaport.top/apitest.php?floor='+encodeURI(res_all.data["floor"][k]),  
						data: {},      //这里是可以填写服务器需要的参数  
						method: 'GET', // 声明GET请求  
						// header: {}, // 设置请求的 header，GET请求可以不填  
							success: function(res_floor){  
								var flag = 0;
								for (var i=0;i<res_floor.data['data'].length;i++){
									for (var j=0;j<res_floor.data['data'][i].length;j++){
											if(res_floor.data['data'][i] === "NULL"){
											break;
										}
										if(res_floor.data['data'][i][j] === "-1"){
											flag = 1;
											break;
										}
									}
									if(flag === 1){
										malfunctionflag.push(1);
										break;
									}
									if(i === res_floor.data['data'].length-1 && flag === 0){
										malfunctionflag.push(0);
										break;
									}
								}
								that.setData({ malfunctionflag:malfunctionflag });
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
					that.setData({ floorname:res_all.data["floor"], arrfloorname:res_all.data["floor"].length });
				},
				fail: function(fail_all) {  
					Dialog.confirm({
					title: "警告⚠",
					message: "服务器数据无响应，请联系管理员检查后台连接" ,
					});
				}, 
				complete: function(arr_all) { },
			});
		});
	},
	onPullDownRefresh: function(){
		this.onLoad();
		Dialog.confirm({
			title: "提示",
			message: "数据更新成功" ,
		});
	},
	onHide: function(){
		this.setData({ malfunctionflag:[] });
	},
});