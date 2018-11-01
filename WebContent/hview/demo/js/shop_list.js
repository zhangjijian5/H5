
layui.use(['form', 'table'], function () {
    var table = layui.table, form = layui.form, $ = layui.$;

    var listTabPage = {
        limit: 2,
        limits: [2, 15, 30, 40, 50],
        groups: 3,
        prev: '上一页', next: '下一页', first: '首页', last: '尾页',
        layout: ['first', 'prev', 'page', 'next', 'last', 'skip', 'count', 'limit', 'refresh']
    };
    //方法级渲染
    var listTable = table.render({
        id: 'listTable',
        elem: '#tableContent',
        url: '/piPaiCampus/rest/demo/getShop',
        method: 'post',
        cols: [[{
            type: 'numbers', title: '序号'
        }, {
            field: 'ssName',
            title: '商铺名称',
            sort: true,
        }, {
            field: 'userId',
            title: '店主号',
            width: 120
        }, {field:'', 
        	title: '店铺类型',
        	width: 200 ,
        	templet: function(d){
        		var a = d.ssType;
        //二维属性，店铺类型，餐饮 | 快递 | 配送'
        		if(a==1){
        			 return '配送机构'
        		}
        		if(a==2){
        			 return '校园运营机构'
        		}
        		if(a==10){
        			 return '快递点'
        		}
        		if(a==11){
        			 return '校园美食'
        		}
        		if(a==12){
        			 return '甜品饮品'
        		}
        		if(a==13){
        			 return '校园便利'
        		}
      }
   	    },{
            field: 'ssAddress',
            title: '地址',
            width: 120
        }, {
            field: 'campusId',
            title: '所在校区',
            width: 120
        }, {
            field: 'ssPic',
            title: '图标',
            width: 120
        }, {
            field: 'telphone',
            title: '手机号',
            width: 120
        }, {field:'', 
        	title: '是否在审核',
        	width: 200 ,
        	templet: function(d){
        		var a = d.yesExamine;
        		if(a==0){
        			 return '否'
        		}
        		if(a==1){
        			 return '是'
        		}
      }
   	    }, {field:'', 
        	title: '是否打烊',
        	width: 200 ,
        	templet: function(d){
        		var a = d.yesBusinessClose;
        		if(a==0){
        			 return '否'
        		}
        		if(a==1){
        			 return '是'
        		}
      }
   	    }, {field:'', 
        	title: '是否禁用',
        	width: 200 ,
        	templet: function(d){
        		var a = d.yesDisable;
        		if(a==0){
        			 return '否'
        		}
        		if(a==1){
        			 return '是'
        		}
      }
   	    }, {
            field: '',
            title: '操作',
            width: 180,
            toolbar: '#barDemo', align: 'center'
        }]],
        page: listTabPage,
        height: 'full-160', cellMinWidth: 180
    });

    //监听工具条
    table.on('tool(tcont)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            layer.msg('ID：' + data.id + ' 的查看操作');
        } else if (obj.event === 'del') {
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
        }
    });

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
            , content: ['on_off.html?randmStr=' + randmStr, 'no']
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
            url: "/piPaiCampus/rest/shopMgr/delShop",
            type: 'POST',
            dataType: 'text',
            data: 'para=' + fstr,
            success: function (result) {
                // console.log(result);
            }
        });
    }

    $("#btnAdd").click(function () {
        var randmStr = Math.random();
        layer.open({
            type: 2 //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
            , title: '新增'
            , maxmin: true
            , area: ['700px', '500px']
            , content: ['shop_add.html?randmStr=' + randmStr, 'no']
            , id: 'userAdd',
            success: function (layero, index) {
                layer.setTop(layero); //重点2
                layer.iframeAuto(index);
            },
            // cancel: function (index, layero) {
            //     if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
            //         layer.close(index)
            //     }
            //     return false;
            // },
            end: function () {
                //                table.reload('listTable', {
                //                    page: listTabPage
                //                });
                listTable.reload({
                    page: listTabPage
                });
            }
        });
    });

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