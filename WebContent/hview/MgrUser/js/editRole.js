var $;
layui.config({
	base: "js/"
}).use(['form', 'layer', 'jquery'], function() {
	var form = layui.form,xtree,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage;
	$ = layui.jquery;
	var currIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引

	//编辑角色ID
	var roleId = $("#roleId").val();

	/*var xtree = new layuiXtree({
	      elem: 'xtree'  //(必填) 放置xtree的容器id，不带#号
	      , form: form    //(必填) layui 的 from
	      , data: ctx+'/sys/xtreedata?roleId='+roleId+'&timestamp='+(new Date()).valueOf()  //(必填) 数据接口，需要返回指定结构json字符串
	      , ckall: true   //启动全选功能，默认false
	      , isopen: false
	      , ckallback: function () {}//全选框状态改变后执行的回调函数
	});*/

	form.on("submit(editRole)", function(data) {
		var list = xtree.GetChecked()
		//菜单id
		var mStr = "";
		for(var i = 0; i < list.length; i++) {
			mStr += list[i].value + ",";
			if(xtree.GetParent(list[i].value) != null) {
				mStr += xtree.GetParent(list[i].value).value + ",";
				//alert(xtree.GetParent(xtree.GetParent(list[i].value).value).value)
				if(xtree.GetParent(xtree.GetParent(list[i].value).value) != null) {
					mStr += xtree.GetParent(xtree.GetParent(list[i].value).value).value + ",";
				}
			} else {
				mStr += list[i].value + ",";
			}
		}
		//去除字符串末尾的‘,’
		mStr = mStr.substring(0, mStr.length - 1)
		var m = $("#m");
		//将权限字符串写进隐藏域
		m.val(mStr)
		//弹出loading
		var index = top.layer.msg('数据提交中，请稍候', {
			icon: 16,
			time: false,
			shade: 0.8
		});
		setTimeout(function() {
			var msg;
			var fstr = '';
			fstr = $("#erf").serialize(),
				$.ajax({
					url: "/piPaiCampus/rest/roles/updateRoles",
					type: 'POST',
					dataType: 'text',
					data: 'para=' + fstr,
					success: function(result) {
						// console.log(result);
						//当你在iframe页面关闭自身时
						//	 
						if(result.code == 0) {
							msg = "添加成功";
						} else {
							msg = result.msg;
						}
					}
				});
			top.layer.close(index);
			top.layer.msg("角色修改成功！");
			layer.closeAll("iframe");
		//刷新父页面
		//再执行关闭 
		parent.layer.close(currIndex);
		parent.location.reload();
		}, 2000);
		return false;
	})

	/*//角色名唯一性校验
	$("#roleName").blur(function() {
		var fstr = '';
		fstr += 'roleName=' + $("#roleName").val();
		$.ajax({
			url: "/piPaiCampus/rest/roles/checkRoleName",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(data) {
				var d = JSON.parse(data);
				if(d.code != 0) {
					top.layer.msg(d.msg);
					$("#roleName").val("");
					$("#roleName").focus();
				}
			}
		});
	})*/

	$(function() {
		var initData = sessionStorage.getItem("role");
		initData = JSON.parse(initData);
		console.log(initData);
		$("input[name='roleId']").val(initData.roleId);
		$("input[name='roleName']").val(initData.roleName);
		$("#roleRemark").val(initData.roleRemark);
		var fstr = '';
        fstr += 'roleId='+initData.roleId;
		$.ajax({
			url: "/piPaiCampus/rest/menus/xtreedata",
			type: 'POST',
			dataType: 'text',
			data: 'para='+ fstr,
			success: function(result) {
				//console.log(result);
				var results = JSON.parse(result);
				 xtree = new layuiXtree({
					elem: 'xtree' //(必填) 放置xtree的容器id，不带#号
						,
					form: form //(必填) layui 的 from
						,
					data: results //(必填) 数据接口，需要返回指定结构json字符
						,
					ckall: true //启动全选功能，默认false
						,
					isopen: false,
					ckallback: function() {} //全选框状态改变后执行的回调函数
				});
			}
		});
	});

})