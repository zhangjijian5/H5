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
		url: '/piPaiCampus/rest/webError/selectAppError',
		method: 'post',
		cols: [
			[{
				type: 'numbers',
				title: '序号'
			}, {
				field: 'machine',
				title: '机器',

			}, {
				field: 'phoneType',
				title: '类型',
				width: 140
			},{
					field: 'errorDate',
					title: '时间',
					templet: function(d) {
						return timestampToTime(d.errorDate);
					}
			}, {
				field: 'content',
				title: '内容',
				sort: true,
				width: 220
			}]
		],
		page: listTabPage,
		height: 'full-160',
		cellMinWidth: 180
	});
	
	function timestampToTime(inputTime) {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
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
		} else if(obj.event === 'ver') {
			onOffItem(data);
		}
	});

});