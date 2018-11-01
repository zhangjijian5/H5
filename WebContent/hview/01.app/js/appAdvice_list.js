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
		url: '/piPaiCampus/rest/appMgr/getUserAdvise',
		method: 'post',
		cols: [
			[{
					type: 'numbers',
					title: '序号'
			},{
				    field: '',
				    title: '建议人（手机号）',
				    sort: true,
			},{
				    field: '',
				    title: '登录名',
				    sort: true,
			},{
					field: 'createTime',
					title: '创建时间',
					templet: function(d) {
						return createTime(d.createTime);
					}
			}, {
					field: 'advise',
					title: '建议内容',
					width: 180
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
		} 
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
			area: ['700px', '600px'],
			content: ['adviceDetails.html?randmStr=' + randmStr, 'no'],
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