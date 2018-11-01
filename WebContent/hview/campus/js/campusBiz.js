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
	var fs = sessionStorage.getItem('page');
		var j = $.parseJSON(fs);
		var fstr = '';
		/*for(var p in j) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + j[p] + ';';
		}*/
		if(j!=null){
			 fstr += 'campusId='+j.id+ ';';
		}
	var listTable = table.render({
		id: 'listTable',
		elem: '#tableContent',
		url: '/piPaiCampus/rest/campusBiz/queryCampusBiz',
		method: 'post',
		where: { 
				para: fstr
			},
		cols: [
			[{
					type: 'numbers',
					title: '序号'
				}, {
					field: 'bizName',
					title: '业务名称',

				}
				/*, {
								field: 'bizType',
								title: '业务类型',
								
							}*/
				, {
					field: '',
					title: '业务类型',
					width: 180,
					templet: function(d) {
						var a = d.bizType;
						//	默认1-应用；2-活动;3-广告图片
						if(a == 1) {
							return '应用'
						}
						if(a == 2) {
							return '活动'
						}
						if(a == 3) {
							return '广告图片'
						}
					}
				}, {
					field: 'rate',
					title: '业务费率',
					sort: true,

				}, {
					field: '',
					title: '是否开启',
					width: 180,
					templet: function(d) {
						var a = d.yesOpen;
						if(a == 0) {
							return '关闭'
						}
						if(a == 1) {
							return '开启'
						}
					}
				}, {
					field: '',
					title: '控制',
					width: 200,
					toolbar: '#ver',
					align: 'center'
				}, {
					field: '',
					title: '操作',
					width: 220,
					toolbar: '#barDemo',
					align: 'center'
				}
			]
		],
		page: listTabPage,
		height: 'full-160',
		cellMinWidth: 180
	});

	//监听工具条
	table.on('tool(tcont)', function(obj) {
		var data = obj.data;
		if(obj.event === 'detail') {
			layer.msg('ID：' + sessionStorage.getItem('page') + ' 的查看操作');
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
			title: '详情',
			area: ['700px', '500px'],
			content: ['campusBiz_edit.html?randmStr=' + randmStr, 'no'],
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
			content: ['bon_off.html?randmStr=' + randmStr, 'no'],
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

	/*function deleteItem(data) {
		var fstr = '';
		for(var p in data) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data[p] + ';';
		}
		fstr += 'doAction=delete';
		// console.log(fstr);

		$.ajax({
			url: "/piPaiCampus/rest/campusBiz/deleteCampusBiz",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(result) {
				// console.log(result);
			}
		});
	}*/

	/*$("#btnAdd").click(function() {
		var randmStr = Math.random();
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '新增',
			maxmin: true,
			area: ['700px', '500px'],
			content: ['campusBiz_add.html?randmStr=' + randmStr, 'no'],
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
*/
	//搜索监听提交
	/*form.on('submit(formSearch)', function(data) {
		for(var p in data.field) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data.field[p] + ';';
		}
		console.log(fstr);
		listTable.reload({
			where: { //设定异步数据接口的额外参数，任意设
				para: fstr
				//…
			},
			page: listTabPage
		});
		return false;
	});*/
	
	$(function() {/*
		$(function() {
			var fs = sessionStorage.getItem('page');
			var j = $.parseJSON(fs);
			var fstr = '';
			for(var p in j) { //遍历json对象的每个key/value对,p为key
				fstr = fstr + p + "=" + j[p] + ';';
			}
			console.log(fstr);
			listTable.reload({
				where: { //设定异步数据接口的额外参数，任意设
					para: fstr
					//…
				},
				page: listTabPage
			});
		});
	*/});

});