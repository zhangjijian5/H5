
layui.use(['form', 'table'], function () {
    var table = layui.table, form = layui.form, $ = layui.$;

    var listTabPage = {
        limit: 15,
        limits: [5, 15, 30, 40, 50],
        groups: 3,
        prev: '上一页', next: '下一页', first: '首页', last: '尾页',
        layout: ['first', 'prev', 'page', 'next', 'last', 'skip', 'count', 'limit', 'refresh']
    };
    //方法级渲染
    var listTable = table.render({
        id: 'listTable',
        elem: '#tableContent',
        url: '/piPaiCampus/rest/webPayment/queryBookTally',
        method: 'post',
        cols: [[{
            type: 'numbers', title: '序号'
        }, {
            field: 'campusName',
            title: '校区',
            width: 200
        }, {
            field: 'ssName',
            title: '店铺',
            width: 200
        }, {
            field: 'custrOrderId',
            title: '订单号',
            width: 180
        }, {
            field: 'orderResult',
            title: '订单状态',
            width: 40
        }, {
            field: 'changeTime',
            title: '记账时间',
            width: 160
        }, {
            field: 'feeBusiness',
            title: '商品总额',
            width: 60
        }, {
            field: 'feeDistribution',
            title: '配送费',
            width: 60
        }, {
            field: 'couponNumerical',
            title: '代金券',
            width: 60
        }, {
            field: 'payAmount',
            title: '实付额',
            width: 60
        }, {
            field: 'settleBiz',
            title: '结算商品额',
            width: 100
        }, {
            field: 'settleDis',
            title: '结算配送费',
            width: 100
        }, {
            field: 'settleRate',
            title: '服务费率',
            width: 100
        }, {
            field: 'settleServiceCharge',
            title: '服务费',
            width: 100
        }, {
            field: 'settleMerchant',
            title: '应付金额',
            width: 100
        // }, {
        //     field: '',
        //     title: '操作',
        //     width: 180,
        //     toolbar: '#barDemo', align: 'center'
        }]],
        page: listTabPage,
        height: 'full-160', cellMinWidth: 180
    });

    //监听工具条
    table.on('tool(tcont)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
        	var msgStr='ssOrgId：' + data.ssOrgId + '\n '
        		+'date：' + data.orderDate + '\n '
        	
            layer.msg(msgStr);
        } else if (obj.event === 'del3ed') {
            layer.confirm('真的删除行么', function (index) {
                console.log(data);
                //data.setItem("docUid",data.userId);
                // data.docUid = data.userId;
                data.vsnid = data.id;
                deleteItem(data);
                obj.del();
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            editItem(data);
        } else if (obj.event === 'doSettle') {
        	doSettle(data);
        }
    });

    function doSettle(data) {
    	var fstr='ssOrgId=' + data.ssOrgId + ';'
		+'orderDate=' + data.orderDate + ';'

        $.ajax({
            url: "/piPaiCampus/rest/webPayment/gatherOdr4ssOrg",
            type: 'POST',
            dataType: 'text',
            data: 'para=' + fstr,
            success: function (result) {
                // console.log(result);
            }
        });
    }
    
    function editItem(data) {
        // sessionStorage.setItem("editdata", JSON.stringify(data));
        var randmStr = Math.random();
        data["doAction"] = "edit";
        // console.log(data);
        // layer.alert('编辑行：<br>' + JSON.stringify(data))
        layer.open({
            type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
            , title: '编辑'
            , area: ['700px', '500px']
            , content: ['express_edit.html?randmStr=' + randmStr, 'no']
            , id: 'userEdit',
            success: function (layero, index) {
                layer.setTop(layero); //重点2
                layer.iframeAuto(index);
                // 获取子页面的iframe  
                var iframe = window['layui-layer-iframe' + index];
                // 向子页面的全局函数child传参 
                iframe.child(data);
            },
            // cancel: function (index, layero) {
            //     if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
            //         layer.close(index)
            //     }
            //     return false;
            // },
            end: function () {
                listTable.reload({
                    page: listTabPage
                });
            }
        });
    }

    function deleteItem(data) {
        var fstr = '';
        for (var p in data) {//遍历json对象的每个key/value对,p为key
            fstr = fstr + p + "=" + data[p] + ';';
        }
        fstr += 'doAction=delete';
        // console.log(fstr);

        $.ajax({
            url: "/piPaiCampus/rest/express/deleteExpress",
            type: 'POST',
            dataType: 'text',
            data: 'para=' + fstr,
            success: function (result) {
                // console.log(result);
            }
        });
    }


    //搜索监听提交
    form.on('submit(formSearch)', function (data) {
        var fstr = '';
        for (var p in data.field) {//遍历json对象的每个key/value对,p为key
            fstr = fstr + p + "=" + data.field[p] + ';';
        }
        // fstr += 'doAction=add';
        // console.log(fstr);

        listTable.reload({
            where: { //设定异步数据接口的额外参数，任意设
                para: fstr
                //…
            }
            , page: listTabPage
        });

        return false;
    });

    $(function () {

        // $.ajax({
        //     url: "/vpulseservice/VHrest/adminyix/queryHistoryInit",
        //     type: 'GET',
        //     dataType: 'text',
        //     success: function (result) {
        //         var results = JSON.parse(result);

        //         localStorage.setItem("hospitalsOfThree", JSON.stringify(results.hospitalsOfThree));
        //         localStorage.setItem("hospitalsType", JSON.stringify(results.hospitalsType));
        //         localStorage.setItem("areaCode", JSON.stringify(results.areaCode));

        //         var areaCode = results.areaCode;
        //         if (areaCode) {
        //             // console.log(areaCode);
        //             $("#areaOtn").html("");
        //             $("#areaOtn").append('<option value="">请选择地区</option>');
        //             for (var i = 0; i < areaCode.length; i++) {
        //                 var item = areaCode[i];
        //                 var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
        //                 //console.log(optionStr);
        //                 $("#areaOtn").append(optionStr);
        //             }
        //         }
        //         var hplLevel = results.hospitalsType;
        //         if (hplLevel) {
        //             // console.log(hplLevel);
        //             $("#hplLevel").html("");
        //             $("#hplLevel").append('<option value="">医院类型</option>');
        //             for (var i = 0; i < hplLevel.length; i++) {
        //                 var item = hplLevel[i];
        //                 var optionStr = "<option value='" + item.ocode + "'>" + item.oname + "</option>";
        //                 //console.log(optionStr);
        //                 $("#hplLevel").append(optionStr);
        //             }
        //         }
        //         form.render('select');

        //         //                console.log(result);
        //     }
        // });

    });

});