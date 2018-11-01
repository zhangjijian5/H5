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
		
	$("#btnAdd").click(function() {
		var randmStr = Math.random();
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '新增',
			maxmin: true,
			area: ['700px', '500px'],
			content: ['wxMenu_add.html?randmStr=' + randmStr, 'no'],
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
		});
	});
	
	$(function() {
		$.ajax({
			url: "/piPaiCampus/rest/wxgzhmgr/getWxMenu",
			type: 'POST',
			success: function(result) {
				var data = result.data;
				var token = result.accessToken;
				var ticket = result.jsapiTicket;	
				//$("#wx").html("<pre style='height: 600px;overflow-y: auto;'>" + JSON.stringify(data, null, 2) + "</pre>");
				$("#wx").val( JSON.stringify(data, null, 2));  
				$("#token").val( JSON.stringify(token, null, 2)); 
				$("#ticket").val( JSON.stringify(ticket, null, 2)); 
			}
		});
	});
});