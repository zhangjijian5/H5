layui.use(['form', 'laydate', 'table'], function() {
	var table = layui.table,
		form = layui.form,
		laydate = layui.laydate,
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
		if(j!=null){
			 fstr += 'campusId='+j.id+ ';';
		}
		
	var listTable = table.render({
		id: 'listTable',
		elem: '#tableContent',
		url: '/piPaiCampus/rest/orders/queryOrders',
		method: 'post',
		where: { 
				para: fstr
			},
		cols: [
			[{
				type: 'numbers',
				title: '序号'
			}, {
				field: 'id',
				title: '客单号',
				sort: true	
			}, {
				field: 'userId',
				title: '客户号',
				sort: true
			}, {
				field: 'bType',
				title: '业务类型',
				width: 200
			}, {
				field: 'StatePayment',
				title: '支付状态',
				width: 200
			}, {
				field: 'StateCustomer',
				title: '客户处理状态',
				width: 200
			}, {
				field: 'StateShopStore',
				title: '店铺处理状态',
				width: 200
			}, {
				field: 'StateDistribution',
				title: '配送处理状态',
				width: 200
			}, {
				field: '',
				title: '操作',
				width: 220,
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
			// layer.msg('ID：' + data.id + ' 的查看操作');
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
		} else if(obj.event === 'edit') {
			editItem(data);
        } else if (obj.event === 'timeline') {
            timeline(data);
        } else if (obj.event === 'payment') {
            payment(data);
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
			title: '编辑',
			area: ['700px', '650px'],
			content: ['ordersDetail.html?randmStr=' + randmStr, 'no'],
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
			/*end: function() {
				listTable.reload({
					page: listTabPage
				});
			}*/
		});
	}

    function timeline(data) {
        var randmStr = Math.random();
        data["doAction"] = "timeline";
        // console.log(data);
        // layer.alert('编辑行：<br>' + JSON.stringify(data))
        layer.open({
            type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
            ,
            title: '时间线',
            area: ['700px', '500px'],
            content: ['OrderStatusDetails_timeline.html?randmStr=' + randmStr, 'no'],
            id: 'timeline',
            success: function(layero, index) {
                layer.setTop(layero); //重点2
                //layer.iframeAuto(index);
                // 获取子页面的iframe
                var iframe = window['layui-layer-iframe' + index];
                // 向子页面的全局函数child传参
                iframe.child(data);
            },
        });
    }

    function payment(data) {
        var randmStr = Math.random();
        data["doAction"] = "timeline";
        // console.log(data);
        // layer.alert('编辑行：<br>' + JSON.stringify(data))
        layer.open({
            type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
            ,
            title: '支付情况',
            area: ['1000px', '600px'],
            content: ['OrderStatusDetails_paymentRev.html?randmStr=' + randmStr, 'no'],
            id: 'payment',
            success: function(layero, index) {
                layer.setTop(layero); //重点2
                //layer.iframeAuto(index);
                // 获取子页面的iframe
                var iframe = window['layui-layer-iframe' + index];
                // 向子页面的全局函数child传参
                iframe.child(data);
            },
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
			content: ['appVersion_edit.html?randmStr=' + randmStr, 'no'],
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

	$("#btnAdd").click(function() {
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
	});

	//搜索监听提交
	form.on('submit(formSearch)', function(data) {
		for(var p in data.field) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data.field[p] + ';';
		}
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

	/*//日期范围
	laydate.render({
		elem: '#test6',
		range: true
	});*/

	 //日期时间范围
  laydate.render({
    elem: '#test10'
    ,type: 'datetime'
    ,range: true
  });
	
	/*form.on('select(school)', function(data) {*/
		/* console.log(data.elem); //得到select原始DOM对象
		 console.log(data.value); //得到被选中的值
		 console.log(data.othis); //得到美化后的DOM对象*/
	/*	var fstr = '';
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
	});*/

	$(function() {
		$.ajax({
			url: "/piPaiCampus/rest/orders/getData",
			type: 'POST',
			dataType: 'text',
			data: 'para=',
			success: function(result) {
				console.log(result);
				var results = JSON.parse(result);
				var btdata = results.data.bt;

				if(btdata != null) {
					$("#bt").html("");
					$("#bt").append('<option value="">请选择业务类型</option>');
					for(var i = 0; i < results.data.bt.length; i++) {
						var item = btdata[i];
						var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
						$("#bt").append(optionStr);
					}
					form.render('select');
				}

				var oscdata = results.data.osc;
				if(oscdata != null) {
					$("#osc").html("");
					$("#osc").append('<option value="">请选择客户状态</option>');
					for(var i = 0; i < results.data.osc.length; i++) {
						var item = oscdata[i];
						var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
						$("#osc").append(optionStr);
					}
					form.render('select');
				}

				var ossdata = results.data.oss;
				if(ossdata != null) {
					$("#oss").html("");
					$("#oss").append('<option value="">请选择店铺状态</option>');
					for(var i = 0; i < results.data.oss.length; i++) {
						var item = ossdata[i];
						var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
						$("#oss").append(optionStr);
					}
					form.render('select');
				}

				var osddata = results.data.osd;
				if(osddata != null) {
					$("#osd").html("");
					$("#osd").append('<option value="">请选择配送状态</option>');
					for(var i = 0; i < results.data.osd.length; i++) {
						var item = osddata[i];
						var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
						$("#osd").append(optionStr);
					}
					form.render('select');
				}
			}
		});

		/*$.ajax({
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
		});*/

	});

});