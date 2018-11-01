layui.use(['form', 'table'], function () {
    var table = layui.table, form = layui.form, $ = layui.$;

    $("#btnAdd").click(function() {
        var randmStr = Math.random();
        layer.open({
            type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
            ,
            title: '新增',
            maxmin: true,
            area: ['748px', '712px'],
            content: ['sys_message_add.html', 'no'],
            id: 'userAdd',
            success: function(layero, index) {
                layer.setTop(layero); //重点2
                //	layer.iframeAuto(index);
            },
            // cancel: function (index, layero) {
            //     if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
            //         layer.close(index)
            //     }
            //     return false;
            // },
            end: function() {
                //                table.reload('listTable', {
                //                    page: listTabPage
                //                });
                listTable.reload({
                    page: listTabPage
                });
            }
        });
    });

});
