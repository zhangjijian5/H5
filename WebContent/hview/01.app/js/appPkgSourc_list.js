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
		url: '/piPaiCampus/rest/appMgr/getPkgSourc',
		method: 'post',
		cols: [
			[{
				type: 'numbers',
				title: '序号'
			}, {
				field: 'funcResrName',
				title: '发布名称',

			}, {
				field: 'funcResrCode',
				title: '资源包code值',
				width: 140
			}, {
				field: 'pkgUrl',
				title: '地址',
				width: 220
			}, {
				field: 'funUrl',
				title: '入口地址',
				sort: true,
				width: 220
			}, {
				field: '',
				title: '用户类型',
				width: 160,
				templet: function(d) {
					var a = d.userType;
					//	1-普用户，2-商户，3-配送快递
					if(a == 1) {
						return '普通用户'
					}
					if(a == 2) {
						return '商户'
					}
					if(a == 3) {
						return '配送快递'
					}
				}
			}, {
				field: '',
				title: '是否强制升级',
				width: 160,
				templet: function(d) {
					var a = d.upgrade;
					if(a == 0) {
						return '否'
					}
					if(a == 1) {
						return '<span style="color:#009688;">是</span>'
					}
				}
			}, {
				field: '',
				title: '是否当前版本',
				width: 160,
				templet: function(d) {
					var a = d.yesCurrent;
					if(a == 0) {
						return '否'
					}
					if(a == 1) {

						return '<span style="color:#009688;">是</span>'
					}
				}
			}, {
				field: '',
				title: '版本控制',
				width: 160,
				toolbar: '#ver',
				align: 'center'
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
			maxmin: true,
			area: ['700px', '700px'],
			content: ['appPkgSourc_edit.html?randmStr=' + randmStr, 'no'],
			id: 'userEdit',
			success: function(layero, index) {
				layer.setTop(layero); //重点2
				//layer.iframeAuto(index);
				// layer.full(index);全屏打开
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

	function onOffItem(data) {
		// sessionStorage.setItem("editdata", JSON.stringify(data));
		var randmStr = Math.random();
		data["doAction"] = "ver";
		// console.log(data);
		// layer.alert('编辑行：<br>' + JSON.stringify(data))
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '编辑',
			area: ['700px', '500px'],
			content: ['pkgon_off.html?randmStr=' + randmStr, 'no'],
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
			url: "/piPaiCampus/rest/appMgr/deletePkgSourc",
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
			area: ['700px', '700px'],
			content: ['appPkgSourc_add.html?randmStr=' + randmStr, 'no'],
			id: 'userAdd',
			success: function(layero, index) {
				layer.setTop(layero); //重点2
				//layer.iframeAuto(index);
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

	$(function() {

		// $.ajax({
		//     url: "/vpulseservice/VHrest/adminyix/queryHistoryInit",
		//     type: 'GET',
		//     dataType: 'text',
		//     success: function (result) {
		//         var results = JSON.parse(result);

		//         localStorage.setItem("hospitalsOfThree", JSON.stringify(results.hospitalsOfThree));
		//         localStorage.setItem("hospitalsType", JSON.stringify(results.hospitalsType));
		//         localStorage.setItem("areaCode", JSON.stringify(results.areaCode));

		//         var areaCode = results.areaCode;
		//         if (areaCode) {
		//             // console.log(areaCode);
		//             $("#areaOtn").html("");
		//             $("#areaOtn").append('<option value="">请选择地区</option>');
		//             for (var i = 0; i < areaCode.length; i++) {
		//                 var item = areaCode[i];
		//                 var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
		//                 //console.log(optionStr);
		//                 $("#areaOtn").append(optionStr);
		//             }
		//         }
		//         var hplLevel = results.hospitalsType;
		//         if (hplLevel) {
		//             // console.log(hplLevel);
		//             $("#hplLevel").html("");
		//             $("#hplLevel").append('<option value="">医院类型</option>');
		//             for (var i = 0; i < hplLevel.length; i++) {
		//                 var item = hplLevel[i];
		//                 var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
		//                 //console.log(optionStr);
		//                 $("#hplLevel").append(optionStr);
		//             }
		//         }
		//         form.render('select');

		//         //                console.log(result);
		//     }
		// });

	});

});