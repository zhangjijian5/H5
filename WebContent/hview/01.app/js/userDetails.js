
// 全局变量
var initData;
// 定义了一个函数，由父页面，调用传值
// 见 父页面editItem(data) 方法的 iframe.child(data);
function child(data) {
    initData=data;
 }
layui.use(['form', 'layedit',], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        ,$ = layui.$;

    var currIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引

    $(function(){		console.log(initData);
		var udt = JSON.stringify(initData);
		var arr = udt.split(",");
		$("#ud").html("");
		for(var item in arr) {
			$("#ud").append(arr[item] + "," + '</br>');
		}    
    });
});
