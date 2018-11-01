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
        url: '/piPaiCampus/rest/webPayment/searchPayment',
        method: 'post',
        cols: [[{
            type: 'numbers', title: '序号'
        },{
            field: 'payWaterId',
            title: '支付ID',
            width: 200
        },{
            field: 'createTime',
            title: '支付入库时间',
            width: 200
        },{
            field: 'custrOrderId',
            title: '订单id',
            width: 200,
        },{
            field: 'orderTime',
            title: '订单时间',
            width: 200,
            templet: function(d) {
                return getNowFormatDate( d.orderTime);
            }
        },{
            field: 'payStatus',
            title: '支付状态',
            width: 140,
            templet: function(d) {
                var a = d.payStatus;
                if(a == 0) {
                    return '未支付'
                }
                if(a == 1) {
                    return '支付完成'
                }
                if(a == 2) {
                    return '定金支付待核算'
                }
                if(a == 3) {
                    return '核算完成待支付'
                }
                if(a == 4) {
                    return '回调确认ok'
                }
                if(a == 101) {
                    return '回调确认失败'
                }
                if(a == 102) {
                    return '非法支付'
                }
                if(a == -1) {
                    return '取消订单'
                }
                if(a == -2) {
                    return '退款'
                }
                if(a == -3) {
                    return '退款'
                }
                if(a == -4) {
                    return '退款成功'
                }
            }
        },{
            field: 'payChannel',
            title: '支付方式',
            width: 140,
            templet: function(d) {
                var a = d.payChannel;
                if (a == 2) {
                    return '支付宝'
                }
                if (a == 3) {
                    return '微信'
                }
                return '';
            }
        },{
            field: 'amount',
            title: '金额',
            width: 140,
        },{
            field: 'payQueryResult',
            title: '支付查询结果',
            event: 'payResult',
        }, {
            field: '',
            title: '操作',
            width: 220,
            toolbar: '#barDemo',
            align: 'center'
        }]],
        page: listTabPage,
        height: 'full-160', cellMinWidth: 180
    });
    //监听工具条
    table.on('tool(tcont)', function (obj) {
        var data = obj.data;
        if (obj.event === 'showPay') {
            showPay(data);
        }else if(obj.event === 'payResult') {
				var randmStr = Math.random();
				data["doAction"] = "detail";
				layer.open({
					type: 2,
					title: '支付详情',
					area: ['700px', '650px'],
					content: ['payDetails.html?randmStr=' + randmStr, 'no'],
					id: 'payDetails',
					success: function(layero, index) {
						layer.setTop(layero); //重点2
						//layer.iframeAuto(index);
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
					/*end: function() {
						listTable.reload({
							page: listTabPage
						});
					}*/
				})
			}
    });

    function showPay(data) {
        console.log(data)

        // sessionStorage.setItem("editdata", JSON.stringify(data));
        var randmStr = Math.random();
        data["doAction"] = "set";
        var fstr = '';

        $.ajax({
            url: "/piPaiCampus/rest/webPayment/queryPayStatus",
            type: 'POST',
            dataType: 'text',
            data: 'para=payChannel=' + data.payChannel + ';payWaterId=' + data.payWaterId + ';',
            success: function (result) {
                layer.open({
                    type: 1
                    ,offset: 'auto' //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                    ,id: 'layerDemo' //防止重复弹出
                    ,content: '<div style="padding: 20px 20px;"><pre>'+ JSON.stringify(JSON.parse(JSON.parse(result).payResult),null,2) +'</pre></div>'
                    ,btn: '关闭全部'
                    ,btnAlign: 'c' //按钮居中
                    ,shade: 0 //不显示遮罩
                    ,area: ['600px', '600px']
                    ,yes: function(){
                        layer.closeAll();
                    }
                });
            },
        });

        // console.log(data);
        // layer.alert('编辑行：<br>' + JSON.stringify(data))
        // layer.open({
        //     type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
        //     , title: '管理员设置'
        //     , area: ['700px', '500px']
        //     , content: ['operator_list.html?randmStr=' + randmStr, 'no']
        //     , id: 'userEdit',
        //     success: function (layero, index) {
        //         layer.setTop(layero); //重点2
        //         layer.iframeAuto(index);
        //         // 获取子页面的iframe
        //         var iframe = window['layui-layer-iframe' + index];
        //         // 向子页面的全局函数child传参
        //         iframe.child(data);
        //     },
        //     // cancel: function (index, layero) {
        //     //     if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
        //     //         layer.close(index)
        //     //     }
        //     //     return false;
        //     // },
        //     end: function () {
        //         listTable.reload({
        //             page: listTabPage
        //         });
        //     }
        // });
    }

    //搜索监听提交
    form.on('submit(formSearch)', function (data) {
        var fstr = '';
        for (var p in data.field) {//遍历json对象的每个key/value对,p为key
            if (!data.field[p]) {
                return;
            }
            fstr = fstr + p + "=" + data.field[p] + ';';
        }

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

    });

});


function getNowFormatDate(inputTime,type) {
    if (typeof inputTime === 'string') {
        inputTime = parseInt(inputTime)
    }
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if(type==='time'){
        return h + ':' + minute + ':' + second;
    }
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}
