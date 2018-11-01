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

layui.use(
	['form', 'layedit', 'upload'],
	function() {
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
		  });*/

		//执行实例
		var uploadInst = upload.render({
			elem: '#vsnFileUpload' //绑定元素
				,
			url: '/piPaiCampus/rest/file/upload/vsnpkgfiles' //上传接口
				,
			accept: 'file',
			exts: 'zip|rar|7z',
			done: function(res) {
				//上传完毕回调
				//   console.log(res);
				if(res.code == 0) {
					$("input[name='pkgUrl']").val(
						res.data.savePath);
				}

				//   alert('上传正确'+res);
			},
			error: function(data) {
				//请求异常回调
				console.log(data);
				alert('上传错误');
			}
		});

		//监听提交
		form.on('submit(fsubmit)', function(data) {
			var fstr = '';
			for(var p in data.field) { //遍历json对象的每个key/value对,p为key
				fstr = fstr + p + "=" + data.field[p] + ';';
			}
			fstr += 'doAction=add';
			// console.log(fstr);

			$.ajax({
				url: "/piPaiCampus/rest/appMgr/uploadPkgSourc",
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

		$("#fCode").blur(function() {
			var fstr = '';
			fstr += 'funcResrCode=' + $("#fCode").val();
			$.ajax({
				url: "/piPaiCampus/rest/appMgr/checkFRCode",
				type: 'POST',
				dataType: 'text',
				data: 'para=' + fstr,
				success: function(data) {
					var d = JSON.parse(data);
					if(d.code != 0) {
						top.layer.msg(d.msg);
						$("#fCode").val("");
						$("#fCode").focus();
					}
				}
			});
		});

		$("#fName").blur(function() {
			var bizCode = $("#fName").val();
			var len = bizCode.length;
			if(len > 15) {
				top.layer.msg("名称不合法");
				$("#fName").val("");
				$("#fName").focus();
			}

		});
		// var editdata=JSON.parse( sessionStorage.getItem("editdata")); 
		// console.log(editdata);
		// form.val("dialogForm", editdata);
	});