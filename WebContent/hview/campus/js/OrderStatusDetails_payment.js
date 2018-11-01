// 全局变量
var initData;
// 定义了一个函数，由父页面，调用传值
// 见 父页面editItem(data) 方法的 iframe.child(data);
function child(data) {
    initData = data;
    console.log(initData.id);
}

layui.use(['form', 'laydate', 'table'], function() {
    var table = layui.table,
        form = layui.form,
        laydate = layui.laydate,
        $ = layui.$;
    //方法级渲染

    var fs = sessionStorage.getItem('page');
    var j = $.parseJSON(fs);
    var fstr = '';
    if(j!=null){
        fstr += 'campusId='+j.id+ ';';
    }

    var listTable = table.render({
        id: 'listTable',
        elem: '#tableContent',
        url: '/piPaiCampus/rest/orders/queryPaymentByOrderId',
        method: 'post',
        where: {
            para: 'orderId=' + initData.id + ';'
        },
        cols: [
            [{
                type: 'numbers',
                title: '序号'
            }, {
                field: 'payWaterId',
                title: '支付ID',
            }, {
                field: 'timeStamp',
                title: '时间',
            }, {
                field: 'amount',
                title: '金额',
                width: 80,
            }, {
                field: 'payStatus',
                title: '支付状态',
                width: 200,
            }, {
                field: 'payQueryResult',
                title: '支付查询结果',
            }]
        ],
        done: function() {
            $("[data-field='payStatus']").children().each(
                function () {
                    if ($(this).text() == '0') {
                        $(this).text('未支付')
                    } else if ($(this).text() == '1') {
                        $(this).text('支付界面操作确认')
                    } else if ($(this).text() == '2') {
                        $(this).text('定金支付待核算')
                    } else if ($(this).text() == '3') {
                        $(this).text('核算完成待支付')
                    } else if ($(this).text() == '4') {
                        $(this).text('支付回调确认')
                    } else if ($(this).text() == '-1') {
                        $(this).text('发起退款')
                    } else if ($(this).text() == '-2') {
                        $(this).text('退款成功')
                    } else if ($(this).text() == '-3') {
                        $(this).text('退款失败')
                    } else if ($(this).text() == '支付状态') {

                    } else {
                        $(this).text('支付状态出错')
                    }
                }
            );
            $("[data-field='timeStamp']").children().each(
                function () {
                    if ($(this).text() != '时间') {
                        $(this).text(getNowFormatDate($(this).text()));
                    }
                }
            );
        },
        page: false,
        height: 537,
        cellMinWidth: 80,
    });

    $(function() {


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

