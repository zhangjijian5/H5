// 全局变量
var initData;
// 定义了一个函数，由父页面，调用传值
// 见 父页面editItem(data) 方法的 iframe.child(data);
function child(data) {
	initData = data;
	console.log(initData.id);
}

layui.use(['form', 'laydate', 'table'], function() {
	var table = layui.table,
		form = layui.form,
		laydate = layui.laydate,
		$ = layui.$;
	$(function() {
		$.ajax({
			url: "/piPaiCampus/rest/orders/queryPaymentByOrderId",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + 'orderId=' + initData.id + ';',
			success: function(result) {
				console.log(result);
				var results = JSON.parse(result);
				var data = results.data;
				if(data != null) {
					var mu = "";
					for(var i = 0; i < data.length; i++) {
						var rs = data[i];
						var json = JSON.parse(data[i].payQueryResult);
						mu += "<div>" + "<p>" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '支付ID：' + data[i].payWaterId + "</p>"
						mu += "<p>" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '时间：' + getNowFormatDate(data[i].timeStamp) + "</p>"
						mu += "<p>" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '金额：' + data[i].amount + "</p>"
						mu += "<p>" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '支付状态：' + getPayStatus(data[i].payStatus) + "</p>" + "</div>"
						mu += "<div>" + "<pre style='height: 400px;overflow-y: auto;'>" + '&nbsp;&nbsp;&nbsp;' + '支付查询结果：' + JSON.stringify(json, null, 2) + "</pre>" + "</div>"
					}
					$("#od").append(mu);
				}
			}
		});
	});
});

function getNowFormatDate(inputTime, type) {
	if(typeof inputTime === 'string') {
		inputTime = parseInt(inputTime)
	}
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
	if(type === 'time') {
		return h + ':' + minute + ':' + second;
	}
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

function getPayStatus(status, type) {
	if(typeof status === 'string') {
		status = parseInt(status)
	}
	if(status == 0) {
		return '未支付';
	} else if(status == 1) {
		return '支付界面操作确认';
	} else if(status == 2) {
		return '定金支付待核算';
	} else if(status == 3) {
		return '核算完成待支付';
	} else if(status == 4) {
		return '支付回调确认';
	} else if(status == -1) {
		return '发起退款';
	} else if(status == -2) {
		return '退款成功';
	} else if(status == -3) {
		return '退款失败';
	} else {
		return '支付状态出错';
	}
}