//JavaScript代码区域
layui.use(['layer', 'element'], function () {
	var element = layui.element,
		layer = layui.layer;

		// 下面这个是侧边栏的显示隐藏
	var isShow = true; //定义一个标志位
	$('.kit-side-fold').click(function () {
		//选择出所有的span，并判断是不是hidden
		$('.layui-nav-item span').each(function () {
			if ($(this).is(':hidden')) {
				$(this).show();
				console.log(this.element);

			}
			 else {
				$(this).hide();
			}
		});
		//判断isshow的状态
		if (isShow) {
			$('.layui-side.layui-bg-black').width(60); //设置宽度
			$('.kit-side-fold i').css('margin-right', '70%'); //修改图标的位置
			//将footer和body的宽度修改
			$('.layui-body').css('left', 60 + 'px');
			$('.layui-footer').css('left', 60 + 'px');
			//将二级导航栏隐藏
			$('dd span').each(function () {
				$(this).hide();
			});
			//修改标志位
			isShow = false;
		} else {
			$('.layui-side.layui-bg-black').width(200);
			$('.kit-side-fold i').css('margin-right', '10%');
			$('.layui-body').css('left', 200 + 'px');
			$('.layui-footer').css('left', 200 + 'px');
			$('dd span').each(function () {
				$(this).show();
			});
			isShow = true;
		}
	});

	$(function () {
		$("#logout").click(function () {
			// layer.alert('点击了退出', { icon: 6 });
			sessionStorage.setItem("accountInfo", null);
			// console.log(sessionStorage.getItem("accountInfo"));
			location.href = 'login.html';
			return false;
		});

		$("#a_doc").attr("href",$("#a_doc").attr("href")+"?ss="+Math.random());  //改变当前a的href值
		$("#a_hpl").attr("href",$("#a_hpl").attr("href")+"?ss="+Math.random());
		$("#a_dept").attr("href",$("#a_dept").attr("href")+"?ss="+Math.random());
	});

	var account = sessionStorage.getItem("accountInfo");

	var accountJson = JSON.parse(account);
	console.log(accountJson.adminUserLogin);
	 if (typeof (accountJson.adminUserLogin) == undefined || !account )
	 	location.href = 'login.html';
	console.log("登入主页面");


});