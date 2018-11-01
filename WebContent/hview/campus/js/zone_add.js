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
var initData,hospitalData,deptData;
// 定义了一个函数，由父页面，调用传值
// 见 父页面editItem(data) 方法的 iframe.child(data);
function child(data) {
    initData=data;
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

	/*//自定义验证规则
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
		url: '/piPaiCampus/rest/commonsFun/upload' //上传接口
			,
		done: function(res) {
			//上传完毕回调
			//   console.log(res);
			if(res.code == 0) {
				$("input[name='versionUrl']").val(res.data.uriPath);
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
			url: "/piPaiCampus/rest/zone/addZone",
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

	$("#zoneLevel").click(function(data) {
		var zl = $('#zoneLevel input[name="zoneLevel"]:checked ').val();
		if(zl == 1) {
			//alert("bb");
			//	$('#sel option:eq(1)').css(border).attr('selected', 'selected');
			
		 $("#sel").html("");
        $("#sel").append('<option value="0" selected>默认值</option>');
        form.render('select');
				
		}
		if(zl == 2) {
			//alert("aaa");

			var fs = sessionStorage.getItem('page');
			var j = $.parseJSON(fs);
			var fstr = '';
			for(var p in j) { //遍历json对象的每个key/value对,p为key
				fstr = fstr + p + "=" + j[p] + ';';
			}
				fstr += 'parentId=0';
			$.ajax({
				url: "/piPaiCampus/rest/zone/selectZone",
				type: 'POST',
				dataType: 'text',
				data: 'para=' + fstr,
				success: function(result) {
					console.log(result);
					 var results = JSON.parse(result);
		 //localStorage.setItem("id", JSON.stringify(results.id));
			  var data = results.data;    
                if (data !=null) {
                   $("#sel").html("");
                    $("#sel").append('<option value="">请选择地区</option>');
                for (var i = 0; i < results.data.length; i++) {
                  var item = data[i];
                    var optionStr = "<option value='" + item.id + "'>" + item.zoneName + "</option>";
                    $("#sel").append(optionStr);
                 }

/*$("#sel").append('<option value="">请选择地区</option>');
$("#sel").append('<option value="">请选择地区</option>');*/
                    form.render('select');
                  }	
				}
			});

		}
	});



 $(function(){
    	
        console.log(initData);
      /*  $("input[name='campusId']").val(initData.ID);*/
       /* $("input[name='disPriceBase']").val(initData.disPriceBase);
        $("input[name='totleStep']").val(initData.totleStep);
        $("input[name='disPriceStep']").val(initData.disPriceStep); 
        $("input[name='id']").val(initData.id);
    	$("input[name='campusId']").val(initData.campusId);
        $('input:radio[name=disType]').each(function (index, el) {
            // console.log(el);
            el.checked = false;
            if ($(el).val() == initData.disType)
                el.checked = true;
        });
        form.render('radio');*/

    });


});


    