<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>平台管理</title>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1">
<script src="../plugin/jquery-1.12.4.min.js"></script>
<link rel="stylesheet" href="../plugin/layui-v2.2.6/layui/css/layui.css">
<script src="../plugin/layui-v2.2.6/layui/layui.js"></script>
<script src="js/test.js"></script>
</head>
<body class="layui-layout-body">
	<div class="layui-layout layui-layout-admin">
		<div class="layui-header">
			<div class="layui-logo">管理平台</div>
			<!-- 头部区域（可配合layui已有的水平导航） -->
			<!-- 
			<ul class="layui-nav layui-layout-left">
				<li class="layui-nav-item layadmin-flexible" lay-unselect="">
				<a class="kit-side-fold"
					href="javascript:;" layadmin-event="flexible" title="侧边伸缩"> 
					<i class="layui-icon layui-icon-shrink-right" id="LAY_app_flexible"></i>
				</a></li>
				<li class="layui-nav-item"><a href="">控制台</a></li>
				<li class="layui-nav-item"><a href="">商品管理</a></li>
				<li class="layui-nav-item"><a href="">用户</a></li>
				<li class="layui-nav-item"><a href="javascript:;">其它系统</a>
					<dl class="layui-nav-child">
						<dd>
							<a href="">邮件管理</a>
						</dd>
						<dd>
							<a href="">消息管理</a>
						</dd>
						<dd>
							<a href="">授权管理</a>
						</dd>
					</dl></li>
			</ul>
			 -->
			<ul class="layui-nav layui-layout-right">
				<li class="layui-nav-item"><a href="javascript:;"> <img
						src="http://t.cn/RCzsdCq" class="layui-nav-img"> 管理员
				</a>
					<dl class="layui-nav-child">
						<dd>
							<a id="a_doc" href="MgrUser/personal.html" target="mcontent">
								<i class="fa fa-list fa-lg"></i> <span>基本资料</span>
							</a>
						</dd>
						<dd>
							<a id="a_doc" href="MgrUser/resetPasswords .html"
								target="mcontent"> <i class="fa fa-list fa-lg"></i> <span>安全设置</span>
							</a>
						</dd>
					</dl></li>
				<li class="layui-nav-item"><a id="logout"
					class="layui-btn layui-btn-norma">注销</a></li>
			</ul>
		</div>

		<!-- 侧边栏 -->
		 <div class="layui-side layui-bg-black">
			<div class="layui-side-scroll">
				<div title="菜单缩放" class="kit-side-fold">
					<i class="fa fa-navicon" aria-hidden="true">宿放</i>
				</div>
						
				左侧导航区域（可配合layui已有的垂直导航）
				<ul class="layui-nav layui-nav-tree" lay-filter="test">

					<li class="layui-nav-item layui-nav-itemed"><a class=""
						href="javascript:;"> <i class="fa fa-user-circle-o fa-lg"></i>
							<span>App管理</span>
					</a>
						<dl class="layui-nav-child">
							<dd>
								<a id="a_doc" href="./01.app/appVersion_list.html"
									target="mcontent"> <i class="fa fa-list fa-lg"></i> <span>版本管理</span>
								</a>
							</dd>
							<dd>
								<a id="a_hpl" href="01.app/appPkgSourc_list.html"
									target="mcontent"> <i class="fa fa-th-list fa-lg"></i> <span>资源包管理</span>
								</a>
							</dd>
							<dd>
								<a id="a_dept" href="01.app/appBusiness_list.html"
									target="mcontent"> <i class="fa fa-address-book fa-lg"></i>
									<span>应用管理</span>
								</a>
							</dd>
							<dd>
								<a id="a_dept" href="01.app/appUser_list.html" target="mcontent">
									<i class="fa fa-address-book fa-lg"></i> <span>App用户</span>
								</a>
							</dd>
							<dd>
								<a id="a_dept" href="01.app/appAdvice_list.html"
									target="mcontent"> <i class="fa fa-address-book fa-lg"></i>
									<span>投诉建议</span>
								</a>
							</dd>
						</dl></li>
					<li class="layui-nav-item"><a class="" href="javascript:;">
							<i class="fa fa-user-circle-o fa-lg"></i> <span>用户管理</span>
					</a>
						<dl class="layui-nav-child">
							<dd>
								<a id="a_doc" href="MgrUser/user_list.html" target="mcontent">
									<i class="fa fa-list fa-lg"></i> <span>后台用户</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="MgrUser/userRole_list.html"
									target="mcontent"> <i class="fa fa-list fa-lg"></i> <span>角色管理</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="MgrUser/userRole_list.html"
									target="mcontent"> <i class="fa fa-list fa-lg"></i> <span>权限管理</span>
								</a>
							</dd>
						</dl></li>
					<li class="layui-nav-item"><a class="" href="javascript:;">
							<i class="fa fa-user-circle-o fa-lg"></i> <span>中心运营</span>
					</a>
						<dl class="layui-nav-child">
							<dd>
								<a id="a_doc" href="school/school_list.html" target="mcontent">
									<i class="fa fa-list fa-lg"></i> <span>学校管理</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="school/campus_list.html" target="mcontent">
									<i class="fa fa-list fa-lg"></i> <span>校区管理</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="orders/customerOrder_list.html"
									target="mcontent"> <i class="fa fa-list fa-lg"></i> <span>订单查询</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="../hview/operation/check_list.html"
									target="mcontent"> <i class="fa fa-list fa-lg"></i> <span>审核管理</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="orders/backOrderMgr.html" target="mcontent">
									<i class="fa fa-list fa-lg"></i> <span>退单原因</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="orders/express_list.html" target="mcontent">
									<i class="fa fa-list fa-lg"></i> <span>快递公司</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="shop/shop_list.html" target="mcontent">
									<i class="fa fa-list fa-lg"></i> <span>店铺列表</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="shop/shopType_list.html" target="mcontent">
									<i class="fa fa-list fa-lg"></i> <span>店铺类型</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="shop/shopRole_list.html" target="mcontent">
									<i class="fa fa-list fa-lg"></i> <span>店铺权限</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="demo/shop_list.html" target="mcontent">
									<i class="fa fa-list fa-lg"></i> <span>分页测试</span>
								</a>
							</dd>
						</dl></li>

					<li class="layui-nav-item"><a class="" href="javascript:;">
							<i class="fa fa-user-circle-o fa-lg"></i> <span>财务管理</span>
					</a>
						<dl class="layui-nav-child">
							<dd>
								<a id="a_doc" href="./doctor_list.html" target="mcontent"> <i
									class="fa fa-list fa-lg"></i> <span>财务查询</span>
								</a>
							</dd>
							<dd>
								<a id="a_doc" href="./doctor_list.html" target="mcontent"> <i
									class="fa fa-list fa-lg"></i> <span>财务结算</span>
								</a>
							</dd>

						</dl></li>
				</ul>
			</div>
		</div>



		<div class="layui-side layui-bg-black">
		 <div class="navBar layui-side-scroll" >
		 	<ul class="layui-nav layui-nav-tree" lay-filter="test" id="navBar">
		 		
		 	</ul>
		 </div> 
			<!--<div class="navBar"></div>-->
		</div>

		<div class="layui-body">
			<!-- 内容主体区域 -->
			<div class="layui-tab-content" style="height: 97%;">
				<iframe name='mcontent' id="MMMMMMM" src="" width="100%"
					height="100%" frameborder="0"> </iframe>
			</div>
		</div>

		<div class="layui-footer">
			<!-- 底部固定区域 -->
			@ 南京派诚网络科技有限公司
		</div>
	</div>
	<script type="text/javascript" src="js/leftNav.js"></script>
	<script type="text/javascript" src="js/bodyTab.js"></script>
</body>
</html>