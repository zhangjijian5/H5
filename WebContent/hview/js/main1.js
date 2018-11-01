//JavaScript代码区域
layui.use(['layer', 'element'], function() {
	var element = layui.element,
		layer = layui.layer;

	// 下面这个是侧边栏的显示隐藏
	var isShow = true; //定义一个标志位
	$('.kit-side-fold').click(function() {
		//选择出所有的span，并判断是不是hidden
		$('.layui-nav-item span').each(function() {
			if($(this).is(':hidden')) {
				$(this).show();
				console.log(this.element);

			} else {
				$(this).hide();
			}
		});
		//判断isshow的状态
		if(isShow) {
			$('.layui-side.layui-bg-black').width(60); //设置宽度
			$('.kit-side-fold i').css('margin-right', '70%'); //修改图标的位置
			//将footer和body的宽度修改
			$('.layui-body').css('left', 60 + 'px');
			$('.layui-footer').css('left', 60 + 'px');
			//将二级导航栏隐藏
			$('dd span').each(function() {
				$(this).hide();
			});
			//修改标志位
			isShow = false;
		} else {
			$('.layui-side.layui-bg-black').width(200);
			$('.kit-side-fold i').css('margin-right', '10%');
			$('.layui-body').css('left', 200 + 'px');
			$('.layui-footer').css('left', 200 + 'px');
			$('dd span').each(function() {
				$(this).show();
			});
			isShow = true;
		}
	});

	$(function() {
		var account = sessionStorage.getItem("accountInfo");
		var accountJson = JSON.parse(account);
		if(typeof(accountJson) == undefined || accountJson == null)
			location.href = 'login.html';
		console.log("登入主页面");
		$("#logout").click(function() {
			// layer.alert('点击了退出', { icon: 6 });
			sessionStorage.setItem("accountInfo", null);
			// console.log(sessionStorage.getItem("accountInfo"));
			location.href = 'login.html';
			return false;
		});
		$("#a_doc").attr("href", $("#a_doc").attr("href") + "?ss=" + Math.random()); //改变当前a的href值
		$("#a_hpl").attr("href", $("#a_hpl").attr("href") + "?ss=" + Math.random());
		$("#a_dept").attr("href", $("#a_dept").attr("href") + "?ss=" + Math.random());
		initMenu();
	});

	function initMenu() {
		var account = sessionStorage.getItem("accountInfo");
		console.log(account);
		var accountJson = JSON.parse(account);
		$("#r").text(accountJson.admin.roleName);
		console.log(accountJson);
		var menu = ""; //定义变量存储
		var data = accountJson.menus;
		for(var i = 0; i < accountJson.menus.length; i++) {
			menu += "<li class='layui-nav-item '>"
			if(data[i].parentId == 0) { //取出父元素的菜单，拼进页面
				menu += "<a href='javascript:;'>" + data[i].title + "</a>"
				for(var j = 0; j < accountJson.menus.length; j++) { //遍历二级菜单
					if(data[j].parentId == data[i].menuId) {
						menu += "<dl class='layui-nav-child'>"
						menu += "<dd>"
						menu += "<a href='" + data[j].href + "' target='mcontent'>" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data[j].title + "</a>"
						menu += "</dd>"
						menu += "</dl>"
					}
				}
				menu += "</li>";
			}
			$("#navBar").html(menu);
			var element = layui.element;
			element.init() //初始化element事件，使菜单展开
		}
	}
});