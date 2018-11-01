var $;
var $form;
var form;
layui.config({
	base: "js/"
}).use(['form', 'layer', 'jquery', 'laydate'], function() {
	var layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		laydate = layui.laydate;
	$ = layui.jquery;
	form = layui.form;
	laydate.render({
		elem: '#birthday' //指定元素
			,
		max: 'new Date()'
	});

	//自定义验证规则
	form.verify({
		pass: [/(.+){6,16}$/, '密码必须6到16位'],
		repass: function(value) {
			var repassvalue = $('#password').val();
			if(value != repassvalue) {
				return '两次输入的密码不一致!';
			}
		}
	});

	//角色名唯一性校验
	$("#userName").blur(function() {
		var fstr = '';
		fstr += 'userName=' + $("#userName").val();
		$.ajax({
			url: "/piPaiCampus/rest/webLogin/checkUser",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(data) {
				var d = JSON.parse(data);
				if(d.code != 0) {
					top.layer.msg(d.msg);
					$("#userName").val("");
					$("#userName").focus();
				}
			}
		});
	})

	$("#eMail").blur(function() {
		var fstr = '';
		fstr += 'eMail=' + $("#eMail").val();
		$.ajax({
			url: "/piPaiCampus/rest/webLogin/checkUser",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(data) {
				var d = JSON.parse(data);
				if(d.code != 0) {
					top.layer.msg(d.msg);
					$("#eMail").val("");
					$("#eMail").focus();
				}
			}
		});
	});

	form.on("submit(addAdmin)", function(data) {
		var fstr = '';
		for(var p in data.field) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data.field[p] + ';';
		}
		// console.log(fstr);
		//弹出loading
		var index = top.layer.msg('数据提交中，请稍候', {
			icon: 16,
			time: false,
			shade: 0.8
		});
		var msg;
		$.ajax({
			url: '/piPaiCampus/rest/webLogin/addAdmin',
			type: "post",
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(d) {
				if(d.code == 0) {
					msg = "添加成功！";
				} else {
					msg = d.msg;
				}
			}
		});
		setTimeout(function() {
			top.layer.close(index);
			top.layer.msg(msg);
			layer.closeAll("iframe");
			//刷新父页面
			parent.location.reload();
		}, 2000);
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

	form.on('select(rol)', function(data) {
		$("input[name='schoolName']").val($("select[name='schoolId']").find("option:selected").text());
		$("input[name='campusName']").val($("select[name='campusId']").find("option:selected").text());
		$("input[name='roleName']").val($("select[name='roleId']").find("option:selected").text());
	});

	$(function() {
		$.ajax({
			url: "/piPaiCampus/rest/roles/getAllRoles",
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
						var optionStr = "<option value='" + item.roleId + "'>" + item.roleName + "</option>";
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

})