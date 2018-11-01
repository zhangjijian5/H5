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
		url: '/piPaiCampus/rest/equipment/selectMobileEquipment',
		method: 'post',
		cols: [
			[{
					type: 'logPhone',
					title: '登录用户电话'
				}, {
					field: 'logUserName',
					title: '登录用户名',
					width: 220
				}, {
					field: 'eptCode',
					title: '设备机器码',
					width: 220
				}, {
					field: 'eptInfo',
					title: '其他信息',
					width: 220
				}, {
					field: 'loginTime',
					title: '最近登录时间',
					templet: function(d) {
						return timestampToTime(d.loginTime);
					}
				}, {
					field: 'logLastLoginDate',
					title: '最后登录时间',
					templet: function(d) {
						return timestampToTime(d.logLastLoginDate);
					}
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

});