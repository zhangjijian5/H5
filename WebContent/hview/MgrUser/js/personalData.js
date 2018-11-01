var $;
var $form;
var form;
layui.config({
	base: "js/"
}).use(['form', 'layer', 'jquery', 'layedit', 'laydate'], function() {
	var layer = parent.layer === undefined ? layui.layer : parent.layer,
		laydate = layui.laydate;
	layedit = layui.layedit;
	$ = layui.jquery;
	form = layui.form;
	//$form=$('form');
	//初始化省
	//loadProvince();

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

	$("#eMail").blur(function() {
		$.ajax({
			type: "post",
			url: ctx + "/sys/checkAdminByEmail?eMail=" + $("#eMail").val() + "&username=" + $("#username").val(),
			success: function(data) {
				if(data.code != 0) {
					top.layer.msg(data.msg);
					$("#eMail").val("");
					$("#eMail").focus();
				}
			}
		});
	});

	form.on("submit(updAdmin)", function(data) {
		var fstr = '';
		for(var p in data.field) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data.field[p] + ';';
		}
		//弹出loading
		var index = top.layer.msg('数据提交中，请稍候', {
			icon: 16,
			time: false,
			shade: 0.8
		});
		var msg;
		/*	$.ajax({
    		type: "post",
            url: ctx+"/sys/updAdmin",
            data:data.field,
			dataType:"json",
			success:function(d){
				if(d.code==0){
		        	msg="添加成功！";
				}else{
		        	msg=d.msg;
				}
			}
        });*/
		$.ajax({
			url: "/piPaiCampus/rest/webLogin/updateAdmin",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(result) {
				// console.log(result);
				//当你在iframe页面关闭自身时
				//parent.layer.close(currIndex); //再执行关闭 
				var results = JSON.parse(result);
				if(results.code == 0) {
					msg = "修改成功！";
				} else {
					msg = results.msg;
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

form.on('select(rol)', function(data) {
 		$("input[name='roleName']").val($("select[name='roleId']").find("option:selected").text());
	});

	$(function() {
		/*var initData = sessionStorage.getItem("admin");
		initData = JSON.parse(initData);
		console.log(initData);*/
		
		var account = sessionStorage.getItem("accountInfo");
		console.log(account);
		var accountJson = JSON.parse(account);
		var initData =accountJson.admin;
		
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
					$("#role").val(initData.roleId);
					form.render('select');
				}
			}
		});

		$("input[name='adminId']").val(initData.adminId);
		$("input[name='userName']").val(initData.userName);
		$("input[name='fullName']").val(initData.fullName);
		$("input[name='eMail']").val(initData.eMail);
		$("input[name='schoolName']").val(initData.schoolName);
		$("input[name='schoolName']").val(initData.schoolName);
		$("input[name='campusName']").val(initData.campusName);
		$("input[name='birthday']").val(initData.birthday);
		$("input[name='address']").val(initData.address);
		$("input[name='uTelephone']").val(initData.uTelephone);
		$("input:radio[value=" + initData.sex + "]").attr('checked', 'true');
		form.render('radio');
	});

})