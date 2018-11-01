
// 全局变量
var initData;
// 定义了一个函数，由父页面，调用传值
// 见 父页面editItem(data) 方法的 iframe.child(data);
function child(data) {
    initData=data;
 }
var $;
var $form;
var form;
layui.config({
	base : "js/"
}).use(['form','layer','jquery','laydate'],function(){
	var layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,laydate = layui.laydate;
		$ = layui.jquery;
		form = layui.form;
		/*$("#title").blur(function(){
			var title=$("#title").val();
			if(title==''){
				title="-1"
			}
			$.ajax({
	            type: "get",
	            url: ctx+"/sys/checkMenuTitle/"+$("#title").val(),
	            success:function(data){
	            	if(data.code!=0){
	            		top.layer.msg(data.msg);
	            		$("#title").val("");
	            		$("#title").focus();
	            	}
	            }
	        });
		});*/
		
 	form.on("submit(menuForm)",function(data){
 		var fstr = '';
        for (var p in data.field) {//遍历json对象的每个key/value对,p为key
            fstr = fstr + p + "=" + data.field[p] + ';';
        }
        fstr += 'doAction=edit';
 		//弹出loading
 		var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
 		var msg="发生错误！",flag=false;
 		$.ajax({
    		type: "post",
            url: "/piPaiCampus/rest/menus/updateMenus",
            data: 'para=' + fstr,
			dataType: 'text',
			success:function(d){
				msg=d.msg;
			},
			error:function() { 
				flag=true;
				top.layer.close(index);
				$("#menuF")[0].reset();
				layer.msg("发生错误，请检查输入！"); }
        });
 		setTimeout(function(){
 			if(!flag){
 				top.layer.close(index);
 				top.layer.msg(msg);
 				layer.closeAll("iframe");
 				//刷新父页面
 				parent.location.reload();
 			}
        },1000);
 		return false;
 	});
 	
 	 $(function(){
        console.log(initData);
        $("input[name='mid']").val(initData.mid);   
        $("input[name='title']").val(initData.title);
        $("input[name='icon']").val(initData.icon);
        $("input[name='href']").val(initData.href);
        $("input[name='sorting']").val(initData.sorting);
        $("input[name='perms']").val(initData.perms);
    });
 	
})