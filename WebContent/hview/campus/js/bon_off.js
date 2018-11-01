
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

    //监听提交
    form.on('submit(doFormSub)', function (data) {
        var fstr = '';
        for (var p in data.field) {//遍历json对象的每个key/value对,p为key
            fstr = fstr + p + "=" + data.field[p] + ';';
        }
        fstr += 'doAction='+initData.doAction;
        // console.log(fstr);

        $.ajax({
            url: "/piPaiCampus/rest/campusBiz/changeCampusBiz",
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

        $("input[name='campusbizId']").val(initData.campusbizId);
        $('input:radio[name=yesOpen]').each(function (index, el) {
            // console.log(el);
            el.checked = false;
            if ($(el).val() == initData.yesOpen)
                el.checked = true;
        });
        form.render('radio');
    });
});




