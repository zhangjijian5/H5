// 把回车键禁用掉，避免layUI的弹出层，重复load，
parent.document.onkeydown = function(e) {
	var ev = parent.document.all ? window.event : e;
	if(ev.keyCode == 13) {
		return false
	}
}
// 把回车键禁用掉，避免layUI的弹出层，其中的表单自动直接提交
document.onkeydown = function(e) {
	var ev = document.all ? window.event : e;
	if(ev.keyCode == 13) {
		return false
	}
}

// 全局变量
var initData, hospitalData, deptData;
// 定义了一个函数，由父页面，调用传值
// 见 父页面editItem(data) 方法的 iframe.child(data);
function child(data) {
	initData = data;
}

layui.use(['form', 'layedit', ], function() {
	var form = layui.form,
		layer = layui.layer,
		layedit = layui.layedit,
		$ = layui.$;

	var currIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
	//创建一个编辑器
	// var editIndex = layedit.build('LAY_demo_editor');


	$(function() {
		/*$("#vsnremark").val(initData.orderDetail);*/
		console.log(initData.orderDetail);
		var od = initData.orderDetail;
		var arr = od.split(",");
		var json = JSON.parse(initData.orderDetail);

		$("#od").html("<pre style='height: 600px;overflow-y: auto;'>" + JSON.stringify(json, null, 2) + "</pre>");

	});
});