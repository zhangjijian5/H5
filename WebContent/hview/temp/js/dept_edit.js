
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
function child(data) {
    initData=data;
  }

layui.use(['form', 'layedit',], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        ,$ = layui.$;
    var currIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引

    //自定义验证规则
     form.verify({
         title: function (value) {
             if (value.length < 2) {
                 return '标题至少得2个字符啊';
             }
         }
         , cardno: [/(^\d{15}$)|(^\d{17}([0-9]|X)$)/, '身份证号不合法']
         , pass: [/(.+){6,12}$/, '密码必须6到12位']
         , phonenum: [/^1[3-9][0-9]{9}$/, '手机号不合法']
         , content: function (value) {
             layedit.sync(editIndex);
         }
     });

    //监听提交
    form.on('submit(demo1)', function (data) {
        var fstr = '';
        for (var p in data.field) {//遍历json对象的每个key/value对,p为key
            fstr = fstr + p + "=" + data.field[p] + ';';
        }
        fstr +=  'doAction='+initData.doAction;        
        // console.log(fstr);

        $.ajax({
            url: "/vpulseservice/VHrest/adminyix/addOrEditHpldept",
            type: 'POST',
            dataType: 'text',
            data: 'para=' + fstr,
            success: function (result) {
                console.log(result);
                //当你在iframe页面关闭自身时
                parent.layer.close(currIndex); //再执行关闭 
            }
        });

        return false;
    });
    
    $(function(){
        console.log(initData);
        $("input[name='deptId']").val(initData.id);
        $("input[name='depName']").val(initData.depname);

        $("#hospitlOtn").html("");
        $("#hospitlOtn").append('<option value="'+initData.hospitalId+'" selected>'+initData.hospitalName+'</option>');
        form.render('select');
    });

});




