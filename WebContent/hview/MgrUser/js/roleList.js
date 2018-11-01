layui.config({
	base : "js/"
}).use(['form','layer','jquery','laypage','table'],function(){
	var form = layui.form,table = layui.table;
	layer = parent.layer === undefined ? layui.layer : parent.layer,
			laypage = layui.laypage,
			$ = layui.jquery;

	//数据表格
	table.render({
		id:'roleList',
		elem: '#roleList'
			,url: '/piPaiCampus/rest/roles/selectAllRoles' //数据接口
				,method: 'post'
					,cellMinWidth: 80
					,limit:10//每页默认数
					,limits:[10,20,30,40]
	,cols: [[ //表头
		{type:'checkbox'}
		,{field:'roleId', title: 'ID', sort: true}
		,{field:'roleName', title: '角色名'}
		,{field:'roleRemark', title: '角色描述'}
		//,{field:'roleName', title: '角色名',edit: 'text'}
		,{title: '操作',toolbar: '#barEdit'}
		]]
	,page: true //开启分页
	,where: {timestamp: (new Date()).valueOf()}
	});

	//监听单元格编辑
	/*table.on('edit(test)', function(obj){
		    var value = obj.value //得到修改后的值
		    ,data = obj.data //得到所在行所有键值
		    ,field = obj.field; //得到字段
		    setTimeout(function(){
	        	$.ajax({
	                type: "POST",
	                url: "saveRole",
	                data:{'roleId':data.roleId,'roleName':value},
	            });
	        },1000);
		    layer.msg('角色名更改为：'+ value,{icon: 1});
		  });*/
	
	function editItem(data) {
		// sessionStorage.setItem("editdata", JSON.stringify(data));
		var randmStr = Math.random();
		data["doAction"] = "edit";
		// console.log(data);
		// layer.alert('编辑行：<br>' + JSON.stringify(data))
		layer.open({
			type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
				,
			title: '编辑',
			area: ['700px', '700px'],
			content: ['MgrUser/editRole.html?randmStr=' + randmStr, 'yes'],
			id: 'Edit',
			success: function(layero, index) {
				layer.setTop(layero); //重点2
				//layer.iframeAuto(index);
				// 获取子页面的iframe  
				var iframe = window['layui-layer-iframe' + index];
				// 向子页面的全局函数child传参 
				//iframe.child(data);
				sessionStorage.setItem("role", JSON.stringify(data));

			},
			// cancel: function (index, layero) {
			//     if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
			//         layer.close(index)
			//     }
			//     return false;
			// },
			/*end: function() {
				table.reload({
					
				});
			}*/
		});
	}
	
	//监听工具条
	table.on('tool(roleList)', function(obj){
		var data = obj.data;
		if(obj.event === 'del'){
			if(data.roleName=='超级管理员'){
				layer.msg("不允许操作此角色！",{icon: 5});
				return;
			}
			layer.confirm('真的删除行么', function(index){
				/*  $.ajax({
		    		  url:ctx+'/sys/delRole/'+data.roleId,
		    		  type : "get",
		    		  success : function(d){
		    			  if(d.code==0){
		    				  //obj.del();
		    				  table.reload('roleList', {})
		    			  }else{
		    				  layer.msg("权限不足，联系超管！",{icon: 5});
		    			  }
		    		  }
		    	  })
		        layer.close(index);*/
				deleteItem(data);
				obj.del();
				layer.close(index);  
			});
		} else if(obj.event === 'edit'){
			/*if(data.roleName=='超级管理员'){
		    		layer.msg("不允许操作此角色！",{icon: 5});
		    		return;
		    	}*/
			/*layer.open({
				type: 2,
				title:"编辑角色",
				area: ['380px', '600px'],
				content:ctx+"/sys/editRole?roleId="+data.roleId+"&roleName="+data.roleName+"&roleRemark="+data.roleRemark, //这里content是一个普通的String
			})*/
			editItem(data);
		}
	});

	function deleteItem(data) {
		var fstr = '';
		for(var p in data) { //遍历json对象的每个key/value对,p为key
			fstr = fstr + p + "=" + data[p] + ';';
		}
		fstr += 'doAction=delete';
		// console.log(fstr);
		$.ajax({
			url: "/piPaiCampus/rest/roles/deleteRoles",
			type: 'POST',
			dataType: 'text',
			data: 'para=' + fstr,
			success: function(result) {
				// console.log(result);
			}
		});
	} 	   
	//添加角色
	$(".roleAdd_btn").click(function(){
		var index = layui.layer.open({
			title : "添加角色",
			type : 2,
			content : "addRole.html",
			success : function(layero, index){
				layui.layer.tips('点击此处返回角色列表', '.layui-layer-setwin .layui-layer-close', {
					tips: 3
				});
			}
		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);
		})
		layui.layer.full(index);
	})

	//批量删除角色
	$(".batchDel").click(function(){
		var checkStatus = table.checkStatus('roleList')
		,data = checkStatus.data,roleStr='',flag=false;
//		layer.alert(JSON.stringify(data));

		if(data.length>0){
			$.each(data, function (n, value) {
				//避免选择不允许操作角色
				if(value.roleName=='超级管理员'){
					flag=true;
					layer.msg('"超级管理员"不允许删除！',{icon: 5});
					return;
				}
				roleStr+=value.roleId+',';
			});
			//包含不允许操作角色，结束方法
			if(flag){
				return;
			}
			roleStr=roleStr.substring(0,roleStr.length-1);
			layer.confirm('真的要删除<strong>'+data.length+'</strong>条数据吗？', function(index){
				//调用删除接口
				$.ajax({
					url:ctx+'/sys/delRoles/'+roleStr,//接口地址
					type : "get",
					success : function(d){
						if(d.code==0){
							//删除成功，刷新父页面
							parent.location.reload();
						}else{
							layer.msg("权限不足，联系超管！",{icon: 5});
						}
					}
				})
			});
		}else{
			layer.msg("请选择要操作的数据！");
		}

	})

})
