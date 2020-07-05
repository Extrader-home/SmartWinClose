import Dialog from '../../dist/dialog/dialog';
var time = require('../../utils/time');
Page({
	data: {
		// 当前展开面板的 name，初始的为空，默认不展开，name由循环动态生成
		activeNames: null,
	},
	// 展开触发
	onOpen(e) {
		this.setData({
			// 置activeNames为当前展开面板的name
			activeNames: e.detail,
		});
		var that = this;
		// 获取 页面传递过来的展开面板floor名，若无则为0
		var arrfloornames = e.currentTarget.dataset.names || 0;
		// 定义未关的窗户数组
		var noclosewin = Array();
		// console.log(arrfloornames);
		// 对该楼栋的窗户数据进行请求
		wx.request({
			url: 'https://wlaport.top/apitest.php?floor='+encodeURI(arrfloornames),
			data: {},      //这里是可以填写服务器需要的参数  
			method: 'GET', // 声明GET请求  
			// header: {}, // 设置请求的 header，GET请求可以不填  
			success: function(res){  
			// 调用time模块timeFn方法进行判断系统时间是否太久未关系
			time.timeFn(arrfloornames,res.data['time']);  
			for (var i=0;i<res.data["data"].length;i++){
				for (var j=0;j<res.data["data"][i].length;j++){
					// 如果该楼层数据为空，则跳出该楼层
					if(res.data['data'][i] == "NULL"){
						break;
					}
					if(res.data["data"][i][j] == "1"){
						res.data["data"][i][j] = (i+1)+"楼 -> "+(j+1)+"窗 -> 未关❌";
						// 给未关窗数组push数据
						noclosewin.push(res.data["data"][i][j])
					}
				}
			}
			// console.log(noclosewin);
			// 将noclosewin数据传到前端，arrnoclosewin为noclosewin的个数，循环渲染使用
			that.setData({ noclosewin:noclosewin, arrnoclosewin:noclosewin.length })
			},
			fail: function(fail) {  
				Dialog.confirm({
					title: "警告⚠",
					message: "服务器数据无响应，请联系管理员检查后台连接" ,
				});
			},  
			complete: function(arr) { }  
		})   
	},
	// 关闭触发
	onClose(){
		this.setData({
			activeNames: null,
		});
	},
	// 生命周期回调—监听页面加载，页面加载时触发,该处的功能主要是判断是否要显示有未关窗的标签
	onLoad: function(){
		var that = this;
		var nocloseflag = [];
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
										// 若有未关的窗户，则将flag置位1，跳出该循环
										if(res_floor.data['data'][i][j] === "1"){
											flag = 1;
											break;
										}
									}
									// 如果flag=1，则将nocloseflag数组push一个1，break出这栋楼，表示栋楼中存在未关的窗
									if(flag === 1){
										nocloseflag.push(1);
										break;
									}
									// 如果最后一次循环完了，并且flag还是为0，则该楼栋中没有未关的窗，则将nocloseflag数组push一个0，表示没有未关的窗
									if(i === res_floor.data['data'].length-1 && flag === 0){
										nocloseflag.push(0);
										break;
									}
								};
								// console.log(nocloseflag);
								that.setData({ nocloseflag:nocloseflag });
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
	// 下拉触发，数据更新
	onPullDownRefresh: function(){
		this.onLoad();
		Dialog.confirm({
			title: "提示",
			message: "数据更新成功",
		});
	},
	// 生命周期回调—监听页面隐藏，页面隐藏/切入后台时触发，将nocloseflag置位空
	onHide: function(){
		this.setData({ nocloseflag:[] });
	},
});