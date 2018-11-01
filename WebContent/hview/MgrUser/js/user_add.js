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
	  });*/

	/* //执行实例
	 var uploadInst = upload.render({
	     elem: '#vsnFileUpload' //绑定元素
	         ,
	     url: '/piPaiCampus/rest/commonsFun/upload' //上传接口
	         ,
	     done: function (res) {
	         //上传完毕回调
	         //   console.log(res);
	         if (res.code == 0) {
	             $("input[name='versionUrl']").val(res.data.uriPath);
	         }

	         //   alert('上传正确'+res);
	     },
	     error: function (data) {
	         //请求异常回调
	         console.log(data);
	         alert('上传错误');
	     }
	 });*/

	//监听提交
	form.on('submit(fsubmit)', function(data) {
		var fstr = '';
		for(var p in data.field) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data.field[p] + ';';
		}
		fstr += 'doAction=add';
		// console.log(fstr);

		$.ajax({
			url: "/piPaiCampus/rest/webLogin/addAdminUser",
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

	form.on('select(school)', function(data) {
		/* console.log(data.elem); //得到select原始DOM对象
		 console.log(data.value); //得到被选中的值
		 console.log(data.othis); //得到美化后的DOM对象*/
		var fstr = '';
		fstr += 'schoolId=' + data.value;
		$.ajax({
			url: "/piPaiCampus/rest/campusMgr/queryAllCampus",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(result) {
				console.log(result);
				var results = JSON.parse(result);
				var data = results.data;
				if(data != null) {
					$("#cps").html("");
					$("#cps").append('<option value="">请选择校区</option>');
					for(var i = 0; i < results.data.length; i++) {
						var item = data[i];
						var optionStr = "<option value='" + item.campusId + "'>" + item.campusName + "</option>";
						$("#cps").append(optionStr);
					}
					form.render('select');
				}
			}
		});
	});

	$(function() {
	
		$.ajax({
			url: "/piPaiCampus/rest/webLogin/queryRoles",
			type: 'POST',
			dataType: 'text',
			data: 'para=',
			success: function(result) {
				console.log(result);
				var results = JSON.parse(result);
				var data = results.data;
				if(data != null) {
					$("#role").html("");
					$("#role").append('<option value="">请选择用户角色</option>');
					for(var i = 0; i < results.data.length; i++) {
						var item = data[i];
						var optionStr = "<option value='" + item.userRoleId + "'>" + item.userRole + "</option>";
						$("#role").append(optionStr);
					}
					form.render('select');
				}
			}
		});

		$.ajax({
			url: "/piPaiCampus/rest/school/selectSchool",
			type: 'POST',
			dataType: 'text',
			data: 'para=',
			success: function(result) {
				console.log(result);
				var results = JSON.parse(result);
				var data = results.data;
				if(data != null) {
					$("#scl").html("");
					$("#scl").append('<option value="">请选择学校</option>');
					for(var i = 0; i < results.data.length; i++) {
						var item = data[i];
						var optionStr = "<option value='" + item.id + "'>" + item.schoolName + "</option>";
						$("#scl").append(optionStr);
					}
					form.render('select');
				}
			}
		});

	});

});