layui.use(['form', 'table'], function() {
	var table = layui.table,
		form = layui.form,
		$ = layui.$;

	var listTabPage = {
		limit: 15,
		limits: [5, 15, 30, 40, 50],
		groups: 3,
		prev: '上一页',
		next: '下一页',
		first: '首页',
		last: '尾页',
		layout: ['first', 'prev', 'page', 'next', 'last', 'skip', 'count', 'limit', 'refresh']
	};
	//方法级渲染
	var listTable = table.render({
		id: 'listTable',
		elem: '#tableContent',
		url: '/piPaiCampus/rest/shopMgr/queryShopStore',
		method: 'post',
		cols: [
			[{
				type: 'numbers',
				title: '序号'
			}, {
				field: 'ssName',
				title: '店铺名称',
				sort: true,
				width: 300
			}, {
				field: 'fullName',
				title: '店主名称',
				width: 100
			}, {
				field: 'telphone',
				title: '手机号',
				width: 120
			}, {
				field: '',
				title: '店铺类型',
				width: 120,
				templet: function(d) {
					var a = d.ssType;
					//二维属性，店铺类型，餐饮 | 快递 | 配送'
					if(a == 1) {
						return '配送机构'
					}
					if(a == 2) {
						return '校园运营机构'
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
				}
			}, {
				field: '',
				title: '是否在审核',
				width: 40,
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
				width: 40,
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
				width: 40,
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
				title: '是否删除',
				width: 40,
				templet: function(d) {
					var a = d.deltag;
					if(a == 0) {
						return '否'
					}
					if(a == 1) {
						return '是'
					}
				}
			},{
				field: '',
				title: '操作',
				toolbar: '#barDemo',
				align: 'center'
			}]
		],
		page: listTabPage,
		height: 'full-160',
		cellMinWidth: 180
	});

	//监听工具条
	table.on('tool(tcont)', function(obj) {
		var data = obj.data;
		if(obj.event === 'detail') {
			//layer.msg('ID：' + data.id + ' 的查看操作');
			detailItem(data);
		} else if(obj.event === 'del') {
			layer.confirm('真的删除行么', function(index) {
				console.log(data);
				//data.setItem("docUid",data.userId);
				// data.docUid = data.userId;
				data.vsnid = data.id;
				deleteItem(data);
				//obj.del();
				listTable.reload({
					page: listTabPage
				});
				layer.close(index);
			});
		} else if(obj.event === 'edit') {
			editItem(data);
		}
	});

	function detailItem(data) {
		// sessionStorage.setItem("editdata", JSON.stringify(data));
		var randmStr = Math.random();
		data["doAction"] = "detail";
		// console.log(data);
		// layer.alert('编辑行：<br>' + JSON.stringify(data))
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '详情',
			area: ['700px', '400px'],
			content: ['shopDetail.html?randmStr=' + randmStr, 'no'],
			id: 'detail',
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
			/*end: function() {
				listTable.reload({
					page: listTabPage
				});
			}*/
		});
	}

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

	form.on('select(school)', function(data) {
		/* console.log(data.elem); //得到select原始DOM对象
		 console.log(data.value); //得到被选中的值
		 console.log(data.othis); //得到美化后的DOM对象*/
		var fstr = '';
		fstr += 'schoolId=' + data.value;
		$.ajax({
			url: "/piPaiCampus/rest/campusMgr/queryAllCampus",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(result) {
				console.log(result);
				var results = JSON.parse(result);
				var data = results.data;
				if(data != null) {
					$("#cps").html("");
					$("#cps").append('<option value="">请选择校区</option>');
					for(var i = 0; i < results.data.length; i++) {
						var item = data[i];
						var optionStr = "<option value='" + item.campusId + "'>" + item.campusName + "</option>";
						$("#cps").append(optionStr);
					}
					form.render('select');
				}
			}
		});
	});

	$(function() {

		$.ajax({
			url: "/piPaiCampus/rest/school/selectSchool",
			type: 'POST',
			dataType: 'text',
			data: 'para=',
			success: function(result) {
				console.log(result);
				var results = JSON.parse(result);
				var data = results.data;
				if(data != null) {
					$("#scl").html("");
					$("#scl").append('<option value="">请选择学校</option>');
					for(var i = 0; i < results.data.length; i++) {
						var item = data[i];
						var optionStr = "<option value='" + item.id + "'>" + item.schoolName + "</option>";
						$("#scl").append(optionStr);
					}
					form.render('select');
				}
			}
		});

		$.ajax({
			url: "/piPaiCampus/rest/shopMgr/queryShopType",
			type: 'POST',
			dataType: 'text',
			data: 'para=',
			success: function(result) {
				console.log(result);
				var results = JSON.parse(result);
				var data = results.data;
				if(data != null) {
					$("#st").html("");
					$("#st").append('<option value="">请选择店铺类型</option>');
					for(var i = 0; i < results.data.length; i++) {
						var item = data[i];
						var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
						$("#st").append(optionStr);
					}
					form.render('select');
				}
			}
		});

	});
});