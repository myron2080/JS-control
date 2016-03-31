$(document).ready(function(){
	WorkBench.initMenuEvent();
	WorkBench.dropdown();
	WorkBench.initChangePosition();
	WorkBench.initToolBar();
});
/**
 * 工作台类
 */
var WorkBench = {
	//初始化菜单事件
	initMenuEvent:function(){
		//折叠式菜单事件
		$("a[pid]").each(function() {
			var p = $(this);
			$(p).bind('click', function() {
				$('a[pid]').each(function() {
					if ($(this).attr('pid') != p.attr('pid')) {
						$(this).removeClass("menu_selected");
					}
				});
				if (p.hasClass('menu_selected')) {
					p.removeClass("menu_selected");
				} else {
					p.addClass("menu_selected");
				}
				$("ul[children]").each(function() {
					var c = $(this);
					if (c.attr("children") == p.attr('pid')) {
						if (c.is(":visible")) {
							c.hide();
						} else {
							c.fadeIn("slow");
						}
					} else {
						c.hide();
					}
				});
			});
		});
		$("a[name]").each(function() {
			var a = $(this);
			var url = a.attr('href');
			a.attr('href', 'javascript:void(0);');
			a.bind('click', function() {
				WorkBench.openPage(a.attr('name'), url, a.attr('title'));
				// 记录操作日志
				//saveOperationLog(url, a.attr('title'));
			});
		});
		setLeftMenu();
	},
	//下拉
	dropdown:function(){
		$("[dropdown]").each(function(){
			var _dropdown = $(this) ;
			var _role = _dropdown.find("[role]");
			_dropdown.find("a:first").bind('mouseover',function(){
				if(_role.is(":visible")){
					//_role.hide();
				}else{
					_role.fadeIn("fast");
				}
			});
			_role.mouseleave(function(){
				_role.hide();
			});
		});
	},
	//打开页面
	openPage:function(name, url, title ,isreloadurl){
		if(url.indexOf(getPath()) < 0 && url.indexOf('http')<0){
			url = getPath()+url;
		}
		//存在已经打开的页面
		var oldPage = $("#pageListBar li[pageId='"+name+"']");
		if(oldPage && oldPage.length == 1){
			$("#pageListBar li[pageId]").removeClass("now");
			oldPage.addClass("now");
			WorkBench.showPage(name);
			return ;
		}
		
		var pageCount = $("#pageListBar li[pageId]").length ;
		if(pageCount >= 21){
			alert("历史页面已经超过20个，请先关闭一些再打开");
			return ;
		}
		
		//构建历史页面
		var page = $('<li class="now" title="'+title+'"><a href="javascript:void(0)"><span class="badge bg-danger pull-right" onclick=WorkBench.removePage("'+name+'");>X</span>' + title + '</a></li>');
		page.attr('pageId', name);
		$('#pageListBar li[pageId]').removeClass("now");
		page.appendTo($('#pageListBar > ul'));
		page.bind('click', function(){
			if($(this).hasClass("now")){
				return ;
			}
			$('#pageListBar li[pageId]').removeClass("now");
			$(this).addClass('now');
			WorkBench.showPage(name);
		});
		//构建页面容器
		var div = $('<div fortab="'+name+'" style="display:none;"></div>');
		var loading = $("<div class='l-tab-loading' style='display:block;'></div>");
		loading.appendTo(div);
		var ifr = $('<iframe id="'+name+'Iframe" name="Open'+name+'" style="width:100%;height:'+(getWinSize().height - 110)+'px;" frameborder="0" marginheight="0" marginwidth="0"></iframe>')
		ifr.appendTo(div);
		div.appendTo($("#pageContainer"));
		ifr.bind('load', function() {
			loading.hide();
		});
		$("#" + name + 'Iframe').attr('src', url);
		WorkBench.showPage(name);
	},
	//显示内页
	showPage:function(pageId){
		$('div[fortab]').each(function() {
			var d = $(this);
			if (d.attr('fortab') == pageId) {
				$("#currPageTxt").text($("#pageListBar li[pageId='"+pageId+"']").attr("title"));
				$("#pageListBar li a").removeClass("now");
				$("#pageListBar li[pageId='"+pageId+"'] a").addClass("now");
				d.show();
			} else {
				d.hide();
			}
		});
		$("#pageHistoryList").hide();
	},
	//显示内首页
	showFirstPage:function(pageId){
		if($(this).hasClass("now")){
			return ;
		}
		$('#pageListBar li[pageId]').removeClass("now");
		$(this).addClass('now');
		WorkBench.showPage(pageId);
	},
	//是否存在页面
	existPage:function(pageId) {
		var old = $('#pageListBar').find('li[pageId="' + pageId + '"]');
		if (old != null && old.length == 1)
			return true;
		return false;
	},
	//删除页面
	removePage:function(pageId){
		//删除页面容器
		var ifr = $('iframe[id='+ pageId + 'Iframe]');
		if (ifr && ifr.length > 0) {
			var innerWin = ifr[0].contentWindow;
			if (innerWin && innerWin.onBeforeCloseTab
					&& typeof (innerWin.onBeforeCloseTab) == 'function') {
				innerWin.onBeforeCloseTab(function() {
					$('div[fortab="' + pageId + '"]').remove();
				});
			} else {
				$('div[fortab="' + pageId + '"]').remove();
			}
		}
		//删除历史页面
		var currPageId = $("#pageListBar li[class='now']").attr("pageId");
		if(currPageId == pageId){
			//选中上一个页面
			var prevPageId = $("#pageListBar li[pageId='"+pageId+"']").prev().attr("pageId");
			WorkBench.showPage(prevPageId);
		}
		$("#pageListBar li[pageId='"+pageId+"']").remove();
	},
	//初始化切换岗位事件
	initChangePosition:function(){
		$('#positionList a[pps]').each(function() {
			var p = $(this);
			p.bind('click',function() {
				var posId = p.attr('pos');
				if (posId == $('#positionList').attr('current')) {
					$('#positionList').hide();
				}else{
					$.MsgBox.Confirm(
							"确认提示",
							"切换岗位将会中断当前所有操作,并刷新工作台,确定切换吗?",
							function(){
								$.post(getPath()+ "/changeCurrentPosition",{id : posId},function(res) {
									if (res.STATE == "SUCCESS") {
										window.location = window.location;
									} else {
										alert(res.MSG);
									}
								},'json');
							}
					);
					/*
					asyncbox.confirm('切换岗位将会中断当前所有操作,并刷新工作台,确定切换吗?',
							'确认提示',
							function(r){
								if (r == 'ok') {
									$.post(getPath()+ "/changeCurrentPosition",{id : posId},function(res) {
										if (res.STATE == "SUCCESS") {
											window.location = window.location;
										} else {
											alert(res.MSG);
										}
									},'json');
								}
					});
					*/
				}
			});
		});
	},
	//初始化工具条
	initToolBar:function(){
		$("#ipt_home_search").bind('keyup', function(event) {
			if (event.keyCode == 13)
				$("#btn_home_search").click();
		});
		var _this = this ;
		$("#btn_home_search").click(function(){
			var searchWords = $("#ipt_home_search").val();
			if(_this.existPage("_erpSearchResult")){
				document.getElementById('_erpSearchResultIframe').contentWindow.ErpSearch.initQuery(searchWords);
				var tab = $('#pageListBar').find('li[pageId="_erpSearchResult"]');
				tab.trigger('click');
			}else{
				_this.openPage("_erpSearchResult", baseUrl
						+ "/interflow/erpsearch/index?searchKey="
						+ encodeURIComponent(encodeURIComponent(searchWords)), "ERP-站内搜索");
			}
		});
	},
	//登出
	logout:function(){
		window.location.href = getPath()+"/logout";
	}
}