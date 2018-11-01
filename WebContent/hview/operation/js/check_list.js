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
		url: '/piPaiCampus/rest/check/getAuditUser',
		method: 'post',
		cols: [
			[{
					type: 'numbers',
					title: '序号'
				}, {
					field: '',
					title: '申请人信息',
					templet: function(d) {
						var a = d.examineType;
						var de = d.objecDetail;
						var detail = JSON.parse(de);
						if(a == 1 || a == 2 || a == 3) {
							/*if(d.uTelephone!=null && d.fullName!=null && d.userName!=null){
								return d.uTelephone + '(' + d.fullName + ')' + d.userName
							}*/
							var uTelephone = d.uTelephone;
							if(uTelephone==null){
								uTelephone='手机号未知';
							}
							var fullName = d.fullName;
							if(fullName==null){
								fullName='用户名未知';
							}
							var userName = d.userName;
							if(userName==null){
								userName='登录名未知';
							}
							
							return uTelephone + '(' + fullName + ')' + userName
						}
						if(a == 4 || a == 5) {
							return detail.ssName
						}
						//	return 'ID：' + d.id + '，标题：<span style="color: #c00;">' + d.title + '</span>'
					}
				}, {
					field: '',
					title: '审核类别',
					width: 220,
					templet: function(d) {
						var a = d.examineType;
						//	审核类别  1-实名认证；2-商户申请；3-配送员申请；4-添加店铺；5-修改店铺
						if(a == 1) {
							return '实名认证'
						}
						if(a == 2) {
							return '商户申请'
						}
						if(a == 3) {
							return '配送员申请'
						}
						if(a == 4) {
							return '添加店铺'
						}
						if(a == 5) {
							return '修改店铺'
						}
					}
				}, {
					field: 'createTime',
					title: '申请时间',
					templet: function(d) {
						return createTime(d.createTime);
					}
				},
				{
					field: 'remark',
					title: '备注',
					
				},
				{
					field: '',
					title: '审核结果',
					width: 200,
					templet: function(d) {
						var a = d.passExamine;
						//	0-待审核，1-审核通过，2-审核不通过
						if(a == 0) {
							return '待审核'
						}
						if(a == 1) {

							return '<span style="color:#009688;">审核通过</span>'
						}
						if(a == 2) {

							return '<span style="color:#FF5722;">审核不通过</span>'
						}
					}
				},
				{
					field: '',
					title: '操作',
					width: 240,
					toolbar: '#barDemo',
					align: 'center'
				}
			]
		],
		page: listTabPage,
		height: 'full-160',
		cellMinWidth: 180
	});
	/*{field:'title', title: '文章标题', width: 200
	     ,templet: function(d){
	       return 'ID：'+ d.id +'，标题：<span style="color: #c00;">'+ d.title +'</span>'
	     }
	   }*/

	//处理时间戳
	function createTime(v) {
		var date = new Date(v);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? '0' + m : m;
		var d = date.getDate();
		d = d < 10 ? ("0" + d) : d;
		var h = date.getHours();
		h = h < 10 ? ("0" + h) : h;
		var M = date.getMinutes();
		M = M < 10 ? ("0" + M) : M;
		var str = y + "-" + m + "-" + d + " " + h + ":" + M;
		return str;
	}

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
				obj.del();
				layer.close(index);
			});
		} else if(obj.event === 'ok') {
			var num = data.passExamine;
			if(num != 0) {
				layer.alert('该用户已经审核，不可以再次审核！');
				return false;
			}
			okItem(data);
		} else if(obj.event === 'no') {
			var num = data.passExamine;
			if(num != 0) {
				layer.alert('该用户已经审核，不可以再次审核！');
				return false;
			}
			noItem(data);
		}
	});

	function okItem(data) {
		// sessionStorage.setItem("editdata", JSON.stringify(data));
		var randmStr = Math.random();
		data["doAction"] = "ok";
		// console.log(data);
		// layer.alert('编辑行：<br>' + JSON.stringify(data))
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '详情',
			area: ['700px', '500px'],
			content: ['yesPass.html?randmStr=' + randmStr, 'no'],
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

	function noItem(data) {
		// sessionStorage.setItem("editdata", JSON.stringify(data));
		var randmStr = Math.random();
		data["doAction"] = "no";
		// console.log(data);
		// layer.alert('编辑行：<br>' + JSON.stringify(data))
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '详情',
			area: ['700px', '500px'],
			content: ['noPass.html?randmStr=' + randmStr, 'no'],
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
			url: "/piPaiCampus/rest/appMgr/deleteVersionInfo",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(result) {
				// console.log(result);
			}
		});
	}

	function detailItem(data) {
		// sessionStorage.setItem("editdata", JSON.stringify(data));
		var randmStr = Math.random();
		data["doAction"] = "detail";
		// console.log(data);
		// layer.alert('编辑行：<br>' + JSON.stringify(data))
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '编辑',
			area: ['700px', '500px'],
			content: ['details.html?randmStr=' + randmStr, 'no'],
			id: 'details',
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

	/*$("#btnAdd").click(function() {
		var randmStr = Math.random();
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '新增',
			maxmin: true,
			area: ['700px', '500px'],
			content: ['appVersion_add.html?randmStr=' + randmStr, 'no'],
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
	});*/

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

	$(function() {

		$.ajax({
			url: "/piPaiCampus/rest/check/getCheckAttributes",
			type: 'POST',
			dataType: 'text',
			data: 'para=',
			success: function(result) {
				console.log(result);
				results = JSON.parse(result);
				var data = results.data;
				if(data != null) {
					$("#et").html("");
					$("#et").append('<option value="">请选择审核类型</option>');
					for(var i = 0; i < results.data.length; i++) {
						var item = data[i];
						var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
						$("#et").append(optionStr);
					}
					form.render('select');
				}
			}
		});

	});

});