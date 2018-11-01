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
	if(j != null) {
		fstr += 'campusId=' + j.id + ';';
	}
	var listTable = table.render({
		id: 'listTable',
		elem: '#tableContent',
		url: '/piPaiCampus/rest/distributionMgr/queryDistributionEmployee',
		method: 'post',
		where: {
			para: fstr
		},
		cols: [
			[{
				type: 'numbers',
				title: '序号'
			}, {
				field: 'employeeName',
				title: '员工姓名',
				width: 180
			}, {
				field: 'telephone',
				title: '手机号',
				width: 180
			}, {
				field: 'ssName',
				title: '所属店铺',
				width: 240,
			}, {
				field: '',
				title: '店铺类型',
				width: 180,
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
				title: '是否接收消息',
				width: 180,
				templet: function(d) {
					var a = d.yesReceiveMes;
					//0-不接收，默认1-接收
					if(a == 0) {
						return '不接收'
					}
					if(a == 1) {
						return '接收'
					}
				}
			}, {
				field: '',
				title: '是否离职',
				width: 180,
				templet: function(d) {
					var a = d.yesJob;
					//0-离职，默认1-在职
					if(a == 0) {
						return '离职'
					}
					if(a == 1) {
						return '在职'
					}
				}
			}, {
				field: '',
				title: '是否在岗',
				width: 180,
				templet: function(d) {
					var a = d.onDuty;
					//0-离开岗位，默认1-在岗
					if(a == 0) {
						return '离开岗位'
					}
					if(a == 1) {
						return '在岗'
					}
				}
			}, {
				field: '',
				title: '是否删除',
				width: 180,
				templet: function(d) {
					var a = d.deltag;
					//，0-未删除，默认1-删除
					if(a == 0) {
						return '未删除'
					}
					if(a == 1) {
						return '删除'
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
				deleteItem(data);
				//obj.del();
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
			area: ['700px', '600px'],
			content: ['distributionEmployee_edit.html?randmStr=' + randmStr, 'no'],
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

	function deleteItem(data) {
		var fstr = '';
		/*for(var p in data) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data[p] + ';';
		}*/
		fstr += 'deltag=1' + ';';
		fstr += 'employeeId=' + data.employeeId;
		// console.log(fstr);
		$.ajax({
			url: "/piPaiCampus/rest/distributionMgr/updateEmployee",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(result) {
				// console.log(result);
				listTable.reload({
					page: listTabPage
				});
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
			content: ['distributionEmployee_add.html?randmStr=' + randmStr, 'no'],
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
		for(var p in data.field) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data.field[p] + ';';
		}
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