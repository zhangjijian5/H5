
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
var initData, hospitalData, deptData;
function child(data) {
    initData = data;
}

layui.use(['form', 'layedit',], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , $ = layui.$;
    var currIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    //创建一个编辑器
    var editIndex = layedit.build('LAY_demo_editor');

    //自定义验证规则
    form.verify({
        title: function (value) {
            if (value.length < 3) {
                return '标题至少得3个字符啊';
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
        fstr += 'doAction=' + initData.doAction;
        // console.log(fstr);

        $.ajax({
            url: "/vpulseservice/VHrest/adminyix/addOrEditHospital",
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

    form.on('radio(doHplType)', function (data) {
        //console.log(data.elem); //得到radio原始DOM对象
        //   console.log(data.value); //被点击的radio的value值
        if (data.value == 1) {
            $("#hospitlOtn").html("");
            $("#hospitlOtn").append('<option value="">无</option>');
            form.render('select');
        }
        if (data.value == 2) {
            renderHospitl();
        }
    });


    $(function () {
        console.log(initData);
        $("input[name='hospitalId']").val(initData.hospitalId);
        $("input[name='hName']").val(initData.hospitalName);
        $("input[name='contactsMan']").val(initData.contacts);
        $("input[name='contactsTel']").val(initData.phoneNum);
        $("input[name='adrress']").val(initData.adrress);

        $('input:radio[name=typeLevel]').each(function (index, el) {
            // console.log(el);
            el.checked = false;
            if ($(el).val() == initData.hospitalType)
                el.checked = true;
        });
        form.render('radio');

        // 回写上级医院
        if (initData.hospitalType == 1) {
            $("#hospitlOtn").html("");
            $("#hospitlOtn").append('<option value="">无</option>');
            form.render('select');
        }
        if (initData.hospitalType == 2) {
            renderHospitl();
        }


        var areaCode = JSON.parse(localStorage.getItem("areaCode"));
        // console.log(areaCode);
        $("#areaOtn").html("");
        $("#areaOtn").append('<option value="">请选择地区</option>');
        for (var i = 0; i < areaCode.length; i++) {
            var item = areaCode[i];
            var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
            //console.log(optionStr);
            if (initData.areaCode == item.ocode)
                optionStr = "<option value='" + item.ocode + "' selected>" + item.oname + "</option>";
            $("#areaOtn").append(optionStr);
        }

        form.render('select');
    });

    function renderHospitl() {
        var hospitalsOfThree = JSON.parse(localStorage.getItem("hospitalsOfThree"));
        //console.log(hospitalsOfThree);
        $("#hospitlOtn").html("");
        $("#hospitlOtn").append('<option value="">请选择医院</option>');
        for (var i = 0; i < hospitalsOfThree.length; i++) {
            var item = hospitalsOfThree[i];
            var optionStr = "<option value='" + item.hospitalId + "'>" + item.hospitalName + "</option>";
            //console.log(optionStr);
            if (initData.superiorId == item.hospitalId)
                optionStr = "<option value=" + item.hospitalId + " selected>" + item.hospitalName + "</option>";
            $("#hospitlOtn").append(optionStr);
        }
        form.render('select');
    }

});




