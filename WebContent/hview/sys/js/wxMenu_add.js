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

layui.use(['form', 'layedit', 'upload'], function() {
	var form = layui.form,
		layer = layui.layer,
		layedit = layui.layedit,
		$ = layui.$,
		upload = layui.upload;

	var currIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
	//监听提交
	form.on('submit(fsubmit)', function(data) {
		var fstr = '';
		for(var p in data.field) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data.field[p] + ';';
		}
		$.ajax({
			url: "/piPaiCampus/rest/wxmenu/addWxMenu",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(result) {
				var json=JSON.parse(result);
				console.log(json.errcode);
				//当你在iframe页面关闭自身时
				if(json.errcode==0){
					alert("添加成功！");
				}else{
					alert("添加失败");
				}
				parent.layer.close(currIndex); //再执行关闭 
			}
		});
		
		return false;
	});

});