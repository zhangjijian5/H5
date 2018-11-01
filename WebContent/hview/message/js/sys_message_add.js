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

layui.use(['form', 'layedit', 'upload'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        $ = layui.jquery,
        upload = layui.upload;

    var currIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引

    form.verify({
        aesKeyVerify: function (value) {
            var selectedValue = $('#typeSelect').val();
            if (selectedValue == 'aesKey' && value.length <= 0) {
                return 'AesKey不能为空';
            }
            if (selectedValue == 'aesKey' && !isJSON(value)) {
                return '不是json格式';
            }
        },
        baseUrlVerify: function (value) {
            var selectedValue = $('#typeSelect').val();
            if (selectedValue == 'baseUrl' && value.length <= 0) {
                return 'BaseUrl不能为空';
            }
            if (selectedValue == 'baseUrl' && !isJSON(value)) {
                return '不是json格式';
            }
        },
        customValueVerify: function (value) {
            var selectedValue = $('#typeSelect').val();
            if (selectedValue == 'customValue' && value.length <= 0) {
                return '自定义json值不能为空';
            }
            if (selectedValue == 'customValue' && !isJSON(value)) {
                return '不是json格式';
            }
        },
        usersVerify: function (value) {
            var selectedValue = $('input:radio:checked').val();
            if (selectedValue == 1 && value.length <= 0) {
                return '用户名不能为空';
            }
        }
    });

    form.on('select(typeSelect)', function(data) {
        if (data.value == 'aesKey') {
            $('#aesKeyDiv').removeClass('layui-hide');
            $('#baseUrlDiv').addClass('layui-hide');
            $('#customValueDiv').addClass('layui-hide');
        } else if (data.value == 'baseUrl') {
            $('#aesKeyDiv').addClass('layui-hide');
            $('#baseUrlDiv').removeClass('layui-hide');
            $('#customValueDiv').addClass('layui-hide');
        } else if (data.value == 'customValue') {
            $('#aesKeyDiv').addClass('layui-hide');
            $('#baseUrlDiv').addClass('layui-hide');
            $('#customValueDiv').removeClass('layui-hide');
        } else {
            $('#aesKeyDiv').addClass('layui-hide');
            $('#baseUrlDiv').addClass('layui-hide');
            $('#customValueDiv').addClass('layui-hide');
        }
    });

    // form.on('radio(userType)', function(data){
    //     //console.log(data.elem); //得到radio原始DOM对象
    //     console.log('aaa'); //被点击的radio的value值
    //
    // });

    form.on('radio(userType)', function(data) {
        console.log(data);
        if (data.value == 0) {
            $('#usersDiv').addClass('layui-hide');
        } else {
            $('#usersDiv').removeClass('layui-hide');
        }
    });

    //监听提交
    form.on('submit(fsubmit)', function(data) {
        var fstr = '';
        for(var p in data.field) { //遍历json对象的每个key/value对,p为key
            fstr = fstr + p + "=" + data.field[p] + ';';
        }
        $.ajax({
            url: "/piPaiCampus/rest/webMessage/sendSys",
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



    $(function() {

    });

});

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }
        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    console.log('It is not a string!')
}