layui.use(['form', 'table'], function() {
	var table = layui.table,
		form = layui.form,
		$ = layui.$;
	
    var listTabPage={
            limit: 15,
            limits: [5, 15, 30, 40, 50],
            groups: 3,
            prev: '上一页', next: '下一页', first: '首页', last: '尾页',
            layout: ['first', 'prev', 'page', 'next', 'last', 'skip', 'count', 'limit', 'refresh']
        };

	//方法级渲染
	var listTable = table.render({
		elem : '#tableContent',
		url : '/vpulseservice/VHrest/adminyix/queryHistorys',
		method : 'post',
		cols : [ [ 
			{type: 'numbers', title: '序号'	}
		, {
			field : 'hospitalName',
			title : '医院',
			sort : true,
			width : 280
		}, {
			field : 'hospitalTName',
			title : '等级',
			sort : true,
			width : 180
		}, {
			field : 'areaName',
			title : '地区',
			sort : true,
			width : 180
		}, {
			field : 'adrress',
			title : '地址',
			sort : true
		}, {
			field : '',
			title : '操作',
			width : 180,
			toolbar : '#barDemo',
			align : 'center'
		} ] ],
		id : 'testReload',
		page: listTabPage,
		height : 'full-160',
		cellMinWidth : 180
	});

	//监听工具条
	table.on('tool(tcont)', function(obj) {
		var data = obj.data;
		if (obj.event === 'detail') {
			layer.msg('ID：' + data.id + ' 的查看操作');
		} else if (obj.event === 'del') {
			layer.confirm('真的删除行么', function(index) {
				// data.docUid=data.userId;
				console.log(data);
                deleteItem(data);
				obj.del();
				layer.close(index);
			});
		} else if (obj.event === 'edit') {
			editItem(data);
		}
	});

	function deleteItem(data){
        var fstr = '';
        for (var p in data) {//遍历json对象的每个key/value对,p为key
            fstr = fstr + p + "=" + data[p] + ';';
        }
        fstr += 'doAction=delete';
        console.log(fstr);

        $.ajax({
            url: "/vpulseservice/VHrest/adminyix/addOrEditHospital",
            type: 'POST',
            dataType: 'text',
            data: 'para=' + fstr,
            success: function (result) {
                console.log(result);
            }
        });
	}

	
    function editItem(data){
		// sessionStorage.setItem("editdata", JSON.stringify(data));
		data["doAction"] = "edit";
		// console.log(data);
		// layer.alert('编辑行：<br>' + JSON.stringify(data))
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
			, title: '编辑'
			, area: ['700px', '500px']
			, content: ['hospital_edit.html', 'no']
			, id: 'hplEdit',
			success: function (layero, index) {
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
			end: function () {
				listTable.reload({
					page:listTabPage
				});
			}
		});
}
	
    // $('#btn_search').on('click', function () {
    //     var ipt_search = $('#ipt_search').val();
    //     //这里以搜索为例
    //     if (!ipt_search)
    //         ipt_search = '';

    //     listTable.reload({
    //         where: { //设定异步数据接口的额外参数，任意设
    //             para: 'hospitalName=' + ipt_search
    //             //…
    //         }
    //         , page: listTabPage
    //     });
    // });
    //搜索监听提交
    form.on('submit(formSearch)', function (data) {
        var fstr = '';
        for (var p in data.field) {//遍历json对象的每个key/value对,p为key
            fstr = fstr + p + "=" + data.field[p] + ';';
        }
        // fstr += 'doAction=add';
		console.log(fstr);
		
		listTable.reload({
            where: { //设定异步数据接口的额外参数，任意设
                para: fstr
                //…
            }
            , page: listTabPage
        });

        return false;
    });

	// $('.demoTable .layui-btn').on('click', function() {
	// 	var type = $(this).data('type');
	// 	active[type] ? active[type].call(this) : '';
	// });

	$("#btnAdd").click(function () {
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
			, title: '新增'
			, maxmin: true
			, area: ['700px', '500px']
			, content: ['hospital_add.html', 'no']
			, id: 'hospitalAdd',
			success: function (layero, index) {
				layer.setTop(layero); //重点2
				layer.iframeAuto(index);
			},
			// cancel: function (index, layero) {
			// 	if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
			// 		layer.close(index)
			// 	}
			// 	return false;
			// },
			end: function () {
				listTable.reload({
					page: listTabPage
				});
			}
		});
	});
	
    $(function(){
        $.ajax({
            url: "/vpulseservice/VHrest/adminyix/queryHistoryInit",
            type: 'GET',
            dataType: 'text',
            success: function (result) {
            	var results = JSON.parse(result);

				localStorage.setItem("hospitalsOfThree", JSON.stringify(results.hospitalsOfThree));
				localStorage.setItem("hospitalsType", JSON.stringify(results.hospitalsType));
				localStorage.setItem("areaCode", JSON.stringify(results.areaCode));

				var areaCode = results.areaCode;
				if (areaCode) {
					// console.log(areaCode);
					$("#areaOtn").html("");
					$("#areaOtn").append('<option value="">请选择地区</option>');
					for (var i = 0; i < areaCode.length; i++) {
						var item = areaCode[i];
						var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
						//console.log(optionStr);
						$("#areaOtn").append(optionStr);
					}
				}
				var hplLevel = results.hospitalsType;
				if (hplLevel) {
					// console.log(hplLevel);
					$("#hplLevel").html("");
					$("#hplLevel").append('<option value="">医院类型</option>');
					for (var i = 0; i < hplLevel.length; i++) {
						var item = hplLevel[i];
						var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
						//console.log(optionStr);
						$("#hplLevel").append(optionStr);
					}
				}
				form.render('select');
            	
//                console.log(result);
            }
        });
        
    });
});


