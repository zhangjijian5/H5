//把回车键禁用掉，避免layUI的弹出层，重复load，
parent.document.onkeydown = function(e) {
	var ev = parent.document.all ? window.event : e;
	if(ev.keyCode == 13) {
		return false
	}
}
//把回车键禁用掉，避免layUI的弹出层，其中的表单自动直接提交
document.onkeydown = function(e) {
	var ev = document.all ? window.event : e;
	if(ev.keyCode == 13) {
		return false
	}
}

//全局变量
var initData, hospitalData, deptData;
//定义了一个函数，由父页面，调用传值
//见 父页面editItem(data) 方法的 iframe.child(data);
function child(data) {
	initData = data;
	console.log('data_id:' + initData['id']);
}

layui.use(['form', 'layedit', ], function() {
	var form = layui.form,
	layer = layui.layer,
	layedit = layui.layedit,
	$ = layui.$;

	var currIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引


	$(function() {
		$.ajax({
			url: "/piPaiCampus/rest/orders/orderChangeList",
			type: 'POST',
			dataType: 'text',
			data: 'para=orderId=' + initData['id'] + ';',
			success: function(result) {
				console.log(result);
				var results = JSON.parse(result);
				$("#timeline-ul").html("");
				for(var i = 0; i < results.data.length; i++) {
					var orderChange = results.data[i];
					var li = '<li class="layui-timeline-item"><i class="layui-icon layui-timeline-axis">&#xe63f;</i><div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">';
					li += orderChange['time'];
					li += '</h3><p>';
					li += orderChange['statusChange'];
					li += '</p></div></li>';
					$("#timeline-ul").append(li);
				}
			}
		});
	});
});

