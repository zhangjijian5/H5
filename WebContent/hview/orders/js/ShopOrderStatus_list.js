layui.use(['form', 'table'], function() {
	var table = layui.table,
		$_GET,
		form = layui.form,
		$ = layui.$;

	function get_query_str() {
		var location_url = window.location.href;

		var parameter_str = location_url.split('?')[1];
		parameter_str = parameter_str.split('#')[0];

		$_GET = {};

		var parameter_arr = parameter_str.split('&');
		var tmp_arr;
		for(var i = 0, len = parameter_arr.length; i <= len - 1; i++) {
			tmp_arr = parameter_arr[i].split('=');
			$_GET[tmp_arr[0]] = decodeURIComponent(tmp_arr[1]);
		}

		window.$_GET = $_GET;
	}
	get_query_str();
	console.log($_GET.campusId);
	//方法级渲染	
	var fs = sessionStorage.getItem('page');
	var j = $.parseJSON(fs);
	var fstr = '';
	/*for(var p in j) { //遍历json对象的每个key/value对,p为key
		fstr = fstr + p + "=" + j[p] + ';';
	}*/
	fstr += 'state_store=' + 'all' + ';';
	if(j != null) {
		fstr += 'campusId=' + j.id + ';';
	} else {
		fstr += 'campusId=' + $_GET.campusId + ';';
	}
	var listTable = table.render({
		id: 'listTable',
		elem: '#tableContent',
		url: '/piPaiCampus/rest/orders/queryOrderStatus',
		method: 'post',
		where: {
			para: fstr
		},
		cols: [
			[{
				type: 'numbers',
				title: '序号'
			}, {
				field: 'ssName',
				title: '店铺名称',
				sort: true
			}, {
				field: 'telphone',
				title: '店铺电话',
				width: 180
			}, {
				field: 'ordersTotal',
				title: '订单数量',
				width: 120
			}, {
				field: '',
				title: '操作',
				width: 220,
				toolbar: '#barDemo',
				align: 'center'
			}]
		],
		/*page: listTabPage,*/
		height: 'full-160',
		cellMinWidth: 180
	});

	//监听工具条
	table.on('tool(tcont)', function(obj) {
		var data = obj.data;
		if(obj.event === 'detail') {
			detailItem(data)
		} else if(obj.event === 'del') {
			layer.confirm('真的删除行么', function(index) {
				console.log(data);
				//data.setItem("docUid",data.userId);
				// data.docUid = data.userId;
				data.vsnid = data.id;
				deleteItem(data);
				obj.del();
				layer.close(index);
			});
		} else if(obj.event === 'edit') {
			editItem(data);
		} else if(obj.event === 'ver') {
			onOffItem(data);
		}
	});

	function editItem(data) {
		/*// sessionStorage.setItem("editdata", JSON.stringify(data));
		var randmStr = Math.random();
		data["doAction"] = "edit";
		// console.log(data);
		// layer.alert('编辑行：<br>' + JSON.stringify(data))
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '编辑',
			area: ['1300px', '700px'],
			content: ['OrderStatusDetails_list.html?randmStr=' + randmStr, 'no'],
			id: 'userEdit',
			success: function(layero, index) {
				layer.setTop(layero); //重点2
				//layer.iframeAuto(index);
				// 获取子页面的iframe  
				var iframe = window['layui-layer-iframe' + index];
				// 向子页面的全局函数child传参 
				iframe.child(data);
			},
			// cancel: function (index, layero) {
			//     if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
			//         layer.close(index)
			//     }
			//     return false;
			// },
			end: function() {
				listTable.reload({
					/*page: listTabPage*/
		/*});
			}
		});*/

		//方法级渲染	

		var fstr = '';
		fstr += 'ssOrgId=' + data.id + ';';
		fstr += 'state_store=' + data.state_store + ';';
		console.log(data);
		var listTable = table.render({
			id: 'list',
			elem: '#table',
			url: '/piPaiCampus/rest/orders/queryOrderStatusDetails',
			method: 'post',
			where: {
				para: fstr
			},
			cols: [
				[{
					type: 'numbers',
					title: '序号'
				}, {
					field: '',
					title: '类型',
					width: 120,
					templet: function(d) {
						var a = d.businessType;
						if(a == 1) {
							return '配送机构'
						}
						if(a == 10) {
							return '快递点'
						}
						if(a == 11) {
							return '校园美食'
						}
						if(a == 12) {
							return '甜品饮品'
						}
						if(a == 13) {
							return '校园便利'
						}
						if(a == 2) {
							return '运营机构'
						}
					}
				}, {
					field: 'orderId',
					title: '订单号',
					width: 160
				}, {
					field: 'subject',
					title: '科目',
					width: 180
				}, {
					field: 'orderTime',
					title: '订单时间',
					templet: function(d) {
						var a = parseInt(d.orderTime);
						return timestampToTime(a);
					}
				}, {
					field: 'updateTimeStamp',
					title: '更新时间',
					templet: function(d) {
						var b = parseInt(d.updateTimeStamp);
						return timestampToTime(b);
					}
				}, {
					field: '',
					title: '服务类型',
					width: 120,
					templet: function(d) {
						var a = d.serviceType;
						if(a==null){
							a = d.orderDetail.serviceType;
						}
						if(a == 1) {
							return '点餐'
						}
						if(a == 2) {
							return '预定'
						}
						if(a == 3) {
							return '外卖'
						}
					}
				}, {
					field: '',
					title: '客户状态',
					width: 120,
					templet: function(d) {
						var a = d.stateCustomer;
						var b = d.businessType;
						if(a == 10) {
							if(a == 1) {
								return '代收'
							}
							if(a == 2) {
								return '代寄'
							}
						}
						if(a == 1) {
							return '客户下单'
						}
						if(a == 2) {
							return '已被接单'
						}
						if(a == 3) {
							return '处理开始，处理中'
						}
						if(a == 4) {
							return '处理结束'
						}
						if(a == 5) {
							return '配送中'
						}
						if(a == 6) {
							return '送达 '
						}
						if(a == 7) {
							return '客户结单'
						}
						if(a == 8) {
							return '订单结单'
						}
						if(a == -1) {
							return '取消'
						}
						if(a == -2) {
							return '退单'
						}
					}
				}, {
					field: '',
					title: '店铺状态',
					width: 120,
					templet: function(d) {
						var a = d.stateShopStore;
						if(a == 1) {
							return '接单'
						}
						if(a == 2) {

							return '处理开始'
						}
						if(a == 3) {
							return '处理完成'
						}
						if(a == 4) {
							return '完单'
						}
						if(a == -1) {
							return '退单'
						}
					}
				}, {
					field: '',
					title: '支付状态',
					width: 120,
					templet: function(d) {
						var a = d.statePayment;
						if(a == -1) {
							return '取消订单'
						}
						if(a == 0) {
							return '未支付'
						}
						if(a == 104) {
							return '支付中'
						}
						if(a == 1) {
							return '支付完成'
						}
						if(a == 2) {
							return '定金支付待核算'
						}
						if(a == 3) {
							return '核算完成待支付'
						}
						if(a == 4) {
							return '回调确认ok'
						}
						if(a == 100) {
							return '等待回调确认'
						}
						if(a == 101) {
							return '回调确认失败'
						}
						if(a == 102) {
							return '非法支付'
						}
						if(a == 103) {
							return '支付关闭'
						}
						if(a == -2) {
							return '退款'
						}
						if(a == -3) {
							return '退款，向支付机构请求失败'
						}
						if(a == -4) {
							return '退款成功'
						}
					}
				}, {
					field: 'payWaterId',
					title: '支付流水',
					width: 180
				}, {
					field: '',
					title: '操作',
					width: 220,
					toolbar: '#bar',
					align: 'center'
				}]
			],
			/*page: listTabPage,*/
			height: 'full-160',
			cellMinWidth: 180
		});

	}

	function timestampToTime(inputTime) {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
	}

	//搜索监听提交
	form.on('submit(formSearch)', function(data) {

		var fs = sessionStorage.getItem('page');
		var j = $.parseJSON(fs);
		var fstr = '';
		for(var p in data.field) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data.field[p] + ';';
		}
		if(j != null) {
			fstr += 'campusId=' + j.id + ';';
		} else {
			fstr += 'campusId=' + $_GET.campusId + ';';
		}
		listTable.reload({
			where: { //设定异步数据接口的额外参数，任意设
				para: fstr
				//…
			},
			/*page: listTabPage*/
		});

		return false;
	});

	function detailItem(data) {
		// sessionStorage.setItem("editdata", JSON.stringify(data));
		var randmStr = Math.random();
		data["doAction"] = "edit";
		// console.log(data);
		// layer.alert('编辑行：<br>' + JSON.stringify(data))
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '编辑',
			area: ['750px', '700px'],
			content: ['Details_list.html?randmStr=' + randmStr, 'no'],
			id: 'userEdit',
			success: function(layero, index) {
				layer.setTop(layero); //重点2
				//layer.iframeAuto(index);
				// 获取子页面的iframe  
				var iframe = window['layui-layer-iframe' + index];
				// 向子页面的全局函数child传参 
				iframe.child(data);
			},
			// cancel: function (index, layero) {
			//     if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
			//         layer.close(index)
			//     }
			//     return false;
			// },
			end: function() {
				listTable.reload({

				});
			}
		});
	}

});