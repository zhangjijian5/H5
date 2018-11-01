// 把回车键禁用掉，避免layUI的弹出层，重复load，
parent.document.onkeydown = function(e) {
	var ev = parent.document.all ? window.event : e;
	if(ev.keyCode == 13) {
		return false
	}
}
// 把回车键禁用掉，避免layUI的弹出层，其中的表单自动直接提交
document.onkeydown = function(e) {
	var ev = document.all ? window.event : e;
	if(ev.keyCode == 13) {
		return false
	}
}

// 全局变量
var initData, hospitalData, deptData;
// 定义了一个函数，由父页面，调用传值
// 见 父页面editItem(data) 方法的 iframe.child(data);
function child(data) {
	initData = data;
}

layui.use(['form', 'layedit', 'table'], function() {
	var form = layui.form,
		table = layui.table,
		layer = layui.layer,
		layedit = layui.layedit,
		$ = layui.$;

	var currIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
	//创建一个编辑器
	// var editIndex = layedit.build('LAY_demo_editor');

	/*var listTabPage = {
		limit: 15,
		limits: [5, 15, 30, 40, 50],
		groups: 3,
		prev: '上一页',
		next: '下一页',
		first: '首页',
		last: '尾页',
		layout: ['first', 'prev', 'page', 'next', 'last', 'skip', 'count', 'limit', 'refresh']
	};*/

	//方法级渲染	

	var fstr = '';
	fstr += 'ssOrgId=' + initData.id + ';';
	fstr += 'state_store=' + initData.state_store + ';';
	console.log(initData);
	var listTable = table.render({
		id: 'listTable',
		elem: '#tableContent',
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
					var a =parseInt(d.orderTime);
					return timestampToTime(a);
				}
			}, {
				field: 'updateTimeStamp',
				title: '更新时间',
				templet: function(d) {
					var b =parseInt(d.updateTimeStamp);
					return timestampToTime(b);
				}
			}, {
				field: '',
				title: '服务类型',
				width: 120,
				templet: function(d) {
					var a = d.serviceType;
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
					if(a == 1) {
						return '支付完成'
					}
					if(a == 2) {
						return '定金支付待核算'
					}
					if(a == 3) {
						return '核算完成待支付'
					}
					if(a == -2) {
						return '退款'
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
				toolbar: '#barDemo',
				align: 'center'
			}]
		],
		/*page: listTabPage,*/
		height: 'full-160',
		cellMinWidth: 180
	});

	/*function timestampToTime(timestamp) {
		var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		Y = date.getFullYear() + '-';
		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		D = date.getDate() + ' ';
		h = date.getHours() + ':';
		m = date.getMinutes() + ':';
		s = date.getSeconds();
		return Y + M + D + h + m + s;
	}
*/
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

	//自定义验证规则
	form.verify({
		title: function(value) {
			if(value.length < 2) {
				return '标题至少得2个字符啊';
			}
		},
		vsnno: [/(^(\d+){1,3}[.](\d+){1,3}[.](\d+){4}[.](\d+){1,3}$)/, '版本号不合法']
	});

	//监听工具条
	table.on('tool(tcont)', function(obj) {
		var data = obj.data;
		if(obj.event === 'detail') {
			layer.msg('ID：' + data.id + ' 的查看操作');
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
		// sessionStorage.setItem("editdata", JSON.stringify(data));
		var randmStr = Math.random();
		data["doAction"] = "edit";
		// console.log(data);
		// layer.alert('编辑行：<br>' + JSON.stringify(data))
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '编辑',
			area: ['700px', '500px'],
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
					page: listTabPage
				});
			}
		});
	}

});