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
		var fstr = '';
	 fstr += 'yesMerchant='+1+ ';';
	//方法级渲染
	var listTable = table.render({
		id: 'listTable',
		elem: '#tableContent',
		url: '/piPaiCampus/rest/platform/queryOrdinaryUsers',
		method: 'post',
		where: { 
				para: fstr
			},
		cols: [
			[{
				type: 'numbers',
				title: '序号'
			}, {
				field: 'uTelephone',
				title: '手机号',
				sort: true,
			}, {
				field: 'nickName',
				title: '昵称',
				width: 220
			}, {
				field: 'fullName',
				title: '姓名',
				event: 'setSign',
				width: 220

			}, {
				field: '',
				title: '性别',
				width: 200,
				templet: function(d) {
					var a = d.usrSex;
					//	性别  1-男  ；2-女
					if(a == 0) {
						return '未知'
					}
					if(a == 1) {
						return '男'
					}
					if(a == 2) {
						return '女'
					}
				}
			}, {
				field: '',
				title: '是否为员工',
				width: 200,
				templet: function(d) {
					var a = d.yesEmployee;
					//默认0-不是，1-是
					if(a == 0) {
						return '否'
					}
					if(a == 1) {
						return '是'
					}
				}
			}, {
				field: '',
				title: '是否为商户',
				width: 200,
				templet: function(d) {
					var a = d.yesMerchant;
					//默认0-不是，1-是
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
				width: 200,
				toolbar: '#barDemo',
				align: 'center'
			}]
		],
		page: listTabPage,
		height: 'full-160',
		cellMinWidth: 180
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

	//监听工具条
	table.on('tool(tcont)', function(obj) {
		var data = obj.data;
		if(obj.event === 'detail') {
			layer.msg('ID：' + data.id + ' 的查看操作');
		} else if(obj.event === 'edt') {
			var num = data.yesMerchant;
			if(num != 0) {
				layer.alert('该用户已经是商户，不可以在设置！');
				return false;
			}		
			layer.confirm('确定设该用户为商户吗？', function(index) {
				editItem(data);
				listTable.reload({
					page: listTabPage
				});
				layer.close(index);	
			});
		} 
	});
	
	function editItem(data) {
		var fstr = '';
		for(var p in data) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data[p] + ';';
		}
		fstr += 'doAction=edit';
		// console.log(fstr);
		$.ajax({
			url: "/piPaiCampus/rest/platform/setMerchants",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(result) {
				// console.log(result);
			}
		});
	}
});