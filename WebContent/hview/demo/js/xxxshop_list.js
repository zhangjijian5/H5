layui.use(['form', 'table'], function() {
	var table = layui.table,
		form = layui.form,
		$ = layui.$;

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

	var listTable = {
		id: 'listTable',
		elem: '#tableContent',
		data: {},
		cols: [
			[{
				type: 'numbers',
				title: '序号'
			}, {
				field: 'ssName',
				title: '商铺名称',
				sort: true,
			}, {
				field: 'userId',
				title: '店主号',
				width: 120
			}, {
				field: 'ssAddress',
				title: '地址',
				width: 120
			}, {
				field: 'campusId',
				title: '所在校区',
				width: 120
			}, {
				field: 'ssPic',
				title: '图标',
				width: 120
			}, {
				field: 'telphone',
				title: '手机号',
				width: 120
			}, {
				field: '',
				title: '是否在审核',
				width: 200,
				templet: function(d) {
					var a = d.yesExamine;
					if(a == 0) {
						return '否'
					}
					if(a == 1) {
						return '是'
					}
				}
			}, {
				field: '',
				title: '是否打烊',
				width: 200,
				templet: function(d) {
					var a = d.yesBusinessClose;
					if(a == 0) {
						return '否'
					}
					if(a == 1) {
						return '是'
					}
				}
			}, {
				field: '',
				title: '是否禁用',
				width: 200,
				templet: function(d) {
					var a = d.yesDisable;
					if(a == 0) {
						return '否'
					}
					if(a == 1) {
						return '是'
					}
				}
			}, {
				field: '',
				title: '操作',
				width: 180,
				toolbar: '#barDemo',
				align: 'center'
			}]
		],
		page: listTabPage,
		height: 'full-160',
		cellMinWidth: 180
	}

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
			content: ['on_off.html?randmStr=' + randmStr, 'no'],
			id: 'userEdit',
			success: function(layero, index) {
				layer.setTop(layero); //重点2
				layer.iframeAuto(index);
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

	function deleteItem(data) {
		var fstr = '';
		for(var p in data) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data[p] + ';';
		}
		fstr += 'doAction=delete';
		// console.log(fstr);

		$.ajax({
			url: "/piPaiCampus/rest/shopMgr/delShop",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(result) {
				// console.log(result);
			}
		});
	}

	$("#btnAdd").click(function() {
		var randmStr = Math.random();
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '新增',
			maxmin: true,
			area: ['700px', '500px'],
			content: ['shop_add.html?randmStr=' + randmStr, 'no'],
			id: 'userAdd',
			success: function(layero, index) {
				layer.setTop(layero); //重点2
				layer.iframeAuto(index);
			},
			// cancel: function (index, layero) {
			//     if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
			//         layer.close(index)
			//     }
			//     return false;
			// },
			end: function() {
				//                table.reload('listTable', {
				//                    page: listTabPage
				//                });
				listTable.reload({
					page: listTabPage
				});
			}
		});
	});

	//搜索监听提交
	form.on('submit(formSearch)', function(data) {
		var fstr = '';
		for(var p in data.field) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data.field[p] + ';';
		}
		// fstr += 'doAction=add';
		// console.log(fstr);

		listTable.reload({
			where: { //设定异步数据接口的额外参数，任意设
				para: fstr
				//…
			},
			page: listTabPage
		});

		return false;
	});

	$(function(data) {
		//		var fstr = '';
		//		for(var p in data) { //遍历json对象的每个key/value对,p为key
		//			fstr = fstr + p + "=" + data[p] + ';';
		//		}
		//		fstr += 'doAction=init';
		//		// console.log(fstr);
		//
		//				$.ajax({
		//					url: "/piPaiCampus/rest/demo/getShop",
		//					type: 'POST',
		//					dataType: 'text',
		//					data: 'para=' + fstr,
		//					success: function(p) {
		//						var results = JSON.parse(p);
		//						//               var jjj=JSON.stringify(p)
		//						//console.log(results.data);
		//						var a = results.data.list;
		//						//console.log(a);
		//						listTable.data = a;
		//						console.log(listTable.data)
		//						listTabPage.curr = 2;
		//						listTable.page = listTabPage;
		//						//table.render(listTable);
		//		
		//						table.init('tcont', listTable);
		//					}
		//				});

		var tOptions = {
			data: []
		}

		var json = [{
			ssName: "hahhah",
			userId: "jifeng23",
			ssAddress: "qianming签名"
		}, {
			ssName: "lellel",
			userId: "jifeng23",
			ssAddress: "qianming签名"
		}];

//		tOptions.data = json;
		tOptions.height = 315;
		tOptions.limit = 10

		tOptions.elem = '#tableContent';
		tOptions.cols = [
			[ //标题栏
				{
					type: 'numbers',
					title: '序号'
				}, {
					field: 'ssName',
					title: '商铺名称',
					sort: true,
				}, {
					field: 'userId',
					title: '店主号',
					width: 120
				}, {
					field: 'ssAddress',
					title: '地址',
					width: 120
				}
			]
		]

		//		tOptions.page = listTabPage;

		//转换静态表格
		//		table.init('demo', tOptions);
		table.render(tOptions)

		var laypage = layui.laypage;

		//执行一个laypage实例
		//		listTabPage.render({
		//			elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
		//				,
		//			count: 50 //数据总数，从服务端得到
		//				,
		//			jump: function(obj, first) {
		//				//obj包含了当前分页的所有参数，比如：
		//				console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
		//				console.log(obj.limit); //得到每页显示的条数
		//
		//				//首次不执行
		//				if(!first) {
		//					//do something
		//				}
		//			}
		//		});

		laypage.render({
			elem: 'test1',
			count: 70 //数据总数，从服务端得到
				,
			jump: function(obj, first) {
				//obj包含了当前分页的所有参数，比如：
				console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
				console.log(obj.limit); //得到每页显示的条数

				//首次不执行
				if(!first) {
					//do something
				

				$.ajax({
					url: "/piPaiCampus/rest/demo/getShop",
					type: 'POST',
					dataType: 'text',
					data: 'para=' ,
					success: function(p) {
						var results = JSON.parse(p);
						//               var jjj=JSON.stringify(p)
						//console.log(results.data);
						var a = results.data.list;
						//console.log(a);

						tOptions.data = a;
						tOptions.curr = obj.curr;
						//table.render(listTable);

						//table.init('tcont', listTable);
						table.reload('tableContent',tOptions);
					}
				});
				//		
				}

			}
		});

	});

});