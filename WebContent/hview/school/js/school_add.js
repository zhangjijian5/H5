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
	//创建一个编辑器
	// var editIndex = layedit.build('LAY_demo_editor');

	/* //自定义验证规则
     form.verify({
         title: function (value) {
             if (value.length < 2) {
                 return '标题至少得2个字符啊';
             }
         }
         , vsnno: [/(^(\d+){1,3}[.](\d+){1,3}[.](\d+){4}[.](\d+){1,3}$)/, '版本号不合法']
     });
*/

	//监听提交
	form.on('submit(fsubmit)', function(data) {
		var fstr = '';
		for(var p in data.field) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data.field[p] + ';';
		}
		fstr += 'doAction=add';
		// console.log(fstr);

		$.ajax({
			url: "/piPaiCampus/rest/school/addSchool",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(result) {
				// console.log(result);
				//当你在iframe页面关闭自身时
				parent.layer.close(currIndex); //再执行关闭 
			}
		});

		return false;
	});

	$("#sCode").blur(function() {
		var fstr = '';
		fstr += 'schoolCode=' + $("#sCode").val();
		$.ajax({
			url: "/piPaiCampus/rest/school/checkSchoolCode",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(data) {
				var d = JSON.parse(data);
				if(d.code != 0) {
					top.layer.msg(d.msg);
					$("#sCode").val("");
					$("#sCode").focus();
				}
			}
		});
	});

	// var editdata=JSON.parse( sessionStorage.getItem("editdata")); 
	// console.log(editdata);
	// form.val("dialogForm", editdata);
});