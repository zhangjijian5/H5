
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

layui.use(['form', 'layedit',], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        ,$ = layui.$;
    var currIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    //创建一个编辑器
    var editIndex = layedit.build('LAY_demo_editor');

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
        fstr += 'doAction=add';
        // console.log(fstr);

        $.ajax({
            url: "/vpulseservice/VHrest/adminyix/addOrEditDotor",
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

    //监听下拉框选中事件
    form.on('select(hospitlSel)', function (data) {
        $("#depmtOtn").html("");
        $("#depmtOtn").append('<option value="">请选择科室</option>');

        $.ajax({
            url: "/vpulseservice/VHrest/adminyix/queryHtyDepts",
            type: 'POST',
            dataType: 'text',
            data: 'para=pageSize=100;pageNumber=1;hospitalId=' + data.value,
            success: function (result) {
                // console.log(result);
                var datas = JSON.parse(result).data;
                // console.log(datas);
                if (datas.length > 0) {
                    // console.log(datas);
                    for (var i = 0; i < datas.length; i++) {
                        var item = datas[i];
                        var optionStr = "<option value='" + item.id + "'>" + item.depname + "</option>";
                        // console.log(optionStr);
                        $("#depmtOtn").append(optionStr);
                    }
                }
                // console.log($('#hospitlOtn').html);
                // $("#hospitlOtn").append(result.data);
                form.render('select');
            }
        });
        // console.log(data.value);
        form.render('select');
    });

    $.ajax({
        url: "/vpulseservice/VHrest/adminyix/queryHistorys",
        type: 'POST',
        dataType: 'text',
        data: 'para=pageSize=100;pageNumber=1',
        success: function (result) {
            //console.log(result);
            var resultJson = JSON.parse(result);
            var datas = resultJson.data;
            if (datas.length > 0) {
                $("#hospitlOtn").html("");
                $("#hospitlOtn").append('<option value="">请选择医院</option>');
                for (var i = 0; i < datas.length; i++) {
                    var item = datas[i];
                    // console.log(item);
                    $("#hospitlOtn").append("<option value=" + item.hospitalId + ">" + item.hospitalName + "</option>");
                }
            }
            // console.log($('#hospitlOtn').html);
            // $("#hospitlOtn").append(result.data);
            $("#depmtOtn").html("");
            $("#depmtOtn").append('<option value="">请选择科室</option>');
            form.render('select');
        }
    });

    // var editdata=JSON.parse( sessionStorage.getItem("editdata")); 
    // console.log(editdata);
    // form.val("dialogForm", editdata);
});




