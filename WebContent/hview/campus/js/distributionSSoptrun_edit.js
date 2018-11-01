
// 把回车键禁用掉，避免layUI的弹出层，重复load，
parent.document.onkeydown = function (e) {
    var ev = parent.document.all ? window.event : e;
    if (ev.keyCode == 13) {
        return false
    }
}
// 把回车键禁用掉，避免layUI的弹出层，其中的表单自动直接提交
document.onkeydown = function (e) {
    var ev = document.all ? window.event : e;
    if (ev.keyCode == 13) {
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

layui.use(['form', 'layedit',], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        ,$ = layui.$;

    var currIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    //创建一个编辑器
    // var editIndex = layedit.build('LAY_demo_editor');

    //自定义验证规则
    /*form.verify({
        title: function (value) {
            if (value.length < 2) {
                return '标题至少得2个字符啊';
            }
        }
        , vsnno: [/(^(\d+){1,3}[.](\d+){1,3}[.](\d+){4}[.](\d+){1,3}$)/, '版本号不合法']
    });*/

    //监听提交
    form.on('submit(doFormSub)', function (data) {
        var fstr = '';
        for (var p in data.field) {//遍历json对象的每个key/value对,p为key
            fstr = fstr + p + "=" + data.field[p] + ';';
        }
        fstr += 'doAction='+initData.doAction;
        // console.log(fstr);

        $.ajax({
            url: "/piPaiCampus/rest/campusBs/setDistribution",
            type: 'POST',
            dataType: 'text',
            data: 'para=' + fstr,
            success: function (result) {
                // console.log(result);
                //当你在iframe页面关闭自身时
                parent.layer.close(currIndex); //再执行关闭 
            }
        });

        return false;
    });


    $(function(){
    	
        console.log(initData);
        $("input[name='totleLowest']").val(initData.totleLowest);
        $("input[name='disPriceBase']").val(initData.disPriceBase);
        $("input[name='totleStep']").val(initData.totleStep);
        $("input[name='disPriceStep']").val(initData.disPriceStep); 
        $("input[name='id']").val(initData.BizPurchaseSSoptrunId);
    	//$("input[name='campusId']").val(initData.campusId);
    	$("input[name='ssName']").val(initData.ssName);
        $('input:radio[name=disType]').each(function (index, el) {
            // console.log(el);
            el.checked = false;
            if ($(el).val() == initData.disType)
                el.checked = true;
        });
        form.render('radio');

    });
});




