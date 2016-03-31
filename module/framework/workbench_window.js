var taskRightMenu;//任务栏任务右键
var functinMainMenu;//桌面右键(主菜单)
var shortcutsMenu;//快捷方式上面的右键
var quickMenu;//快捷方式右键
//改写部份$.ligerui.win的方法
$.extend($.ligerui.win,{
	hasTask:function(){
		return true;
	},
	addTask: function (win)
    {
        var self = this;
        if(!self.taskWin){
        	self.taskWin = {};
        	self.taskSize = 0;
        }
        self.taskWin[win.id] = win;
        self.taskSize++;
        if (!self.taskbar) self.createTaskbar();
        if (self.tasks[win.id]) return self.tasks[win.id];
        var title = win.get('title');
        var task = self.tasks[win.id] = $('<div class="l-taskbar-task"><div class="l-taskbar-task-icon" '+(win.options.icon?'style="background:url(\''+win.options.icon+'\')"':'')+'></div><div class="l-taskbar-task-content" style="width:80px;overflow:hidden;" title="'+title+'">' + title + '</div></div>');
        self.taskbar.tasks.append(task);
        self.activeTask(win);
        task.bind('contextmenu',function(e){
        	taskRightMenu.win = win;
        	taskRightMenu.menu.css('z-index',11001);
        	taskRightMenu.show({top:(e.pageY-120),left:e.pageX});
        	return false;
        }).bind('click', function ()
        {
            self.activeTask(win);
            if (win.actived)
                win.min();
            else
                win.active();
            return false;
        }).hover(function ()
        {
            $(this).addClass("l-taskbar-task-over");
        }, function ()
        {
            $(this).removeClass("l-taskbar-task-over");
        });
        return task;
    },
	removeTask: function (win)
    {
        var self = this;
        if (!self.taskbar) return;
        if (self.tasks[win.id])
        {
            self.tasks[win.id].unbind();
            self.tasks[win.id].remove();
            delete self.tasks[win.id];
        }
        if (!self.hasTask())
        {
            self.removeTaskbar();
        }
        if(self.taskWin){
        	delete self.taskWin[win.id];
        }
        delete $.ligerui.managers[win.id];
        self.taskSize--;
    }
});
//初始化
$(document).ready(function(){
	var tb = $.ligerui.win.createTaskbar();//创建任务栏
	tb.bind("contextmenu",function(){
		return false;//禁止任务栏右键
	}).bind("click",function(){
		//任务栏空白处单击时最小化所有窗口
		if($.ligerui.win.taskWin){
			for(var wid in $.ligerui.win.taskWin){
				$.ligerui.win.taskWin[wid].min();
			}
		}
		return false;
	});
	//任务栏图标右键菜单
	taskRightMenu = $.ligerMenu({top:100,left: 100, width: 120, items: 
		[
		{text: '最大化',click: function(){
			taskRightMenu.win.active();
			taskRightMenu.win.max();
		}}, 
		{text: '恢复',click: function(){
			taskRightMenu.win.active();
		}}, 
		{text: '最小化',click: function(){
			taskRightMenu.win.min();
		}}, 
		{text: '设为快捷方式',click: function(){
			$.post(getPath()+'/permission/shortcuts/save',{"menu.id":taskRightMenu.win.id},function(res){
				if(res.STATE=='SUCCESS'){
					$.workbench.refresh();
					alert("成功");
				}else{
					if(res.MSG){
						alert(res.MSG);
					}else{
						alert("创建快捷方式失败");
					}
				}
			},"json");
		}}, 
		{text: '关闭',click: function(){
			taskRightMenu.win.close();
		}}
	]});
	//加载快捷方式
	$.workbench.init();
	//桌面右键菜单
	$.post(getPath()+'/permission/menu/getAllMenu',{},function(res){
		var items = [];
		if(res && res.length){
			for(var i = 0; i < res.length; i++){
				items[i] = createMenuItem(res[i]);
			}
		}
		functinMainMenu = $.ligerMenu({top:100,left: 100, width: 120, items:items});
		$('#workbench').bind('contextmenu',function(e){
			functinMainMenu.menu.css('z-index',11001);
			functinMainMenu.show({top:e.pageY,left:e.pageX});
			return false;
		});
	},'json');
});
//菜单项数据转换为菜单项
function createMenuItem(r){
	var item = {};
	item.id = r.id;
	item.text = r.name;
	item.icon = r.icon;
	item.url = r.link;
	if(r.children && r.children.length>0){
		item.children = [];
		for(var i = 0; i < r.children.length; i++){
			item.children[i] = createMenuItem(r.children[i]);
		}
	}else{
		item.click = function(){
			runTask(this.id,(this.url&&this.url.indexOf('http://')<0)?(getPath()+'/'+this.url):this.url,this.text,this.icon);
		};
	}
	return item;
}

//打开任务
function runTask(id,url,title,icon){
	if($.ligerui.win.tasks[id]){
		$.ligerui.win.taskWin[id].active();
	}else{
		if($.ligerui.win.taskSize && $.ligerui.win.taskSize>8){
			alert("当前打开的窗口过多，请先关闭部份窗口。");
			return;
		}
		var win = $.ligerDialog.open({
			id:id,
			height: 600, 
			url:url, 
			width: 900, 
			showMax: true, 
			showToggle: false, 
			showMin: true, 
			isResize: true, 
			modal: false, 
			title: title,
			icon:icon?icon:'default/style/images/menu/defaultIcon.gif'
		});
		//win.max();
	}
}

window.workbench = $.workbench = {
	init:function(){
		if($("#workbench").length>0){
			return this;
		}
		this.bench = $('<div id="workbench" style="float:left;width:100%;height:100%;"></div>')
			.appendTo($("body"));
		this.lineBars = [];
		this.addLineBar();
		this.maxSize = Math.floor(($(window).height()-10-40) / 80);
		this.loadShortCuts();
		this.rightMenu = $.ligerMenu({top:100,left: 100, width: 120, items: 
			[
				{text: '打开',click: function(){
					var st = $.workbench.rightMenu.shortcuts;
					runTask(st.menu?st.menu.id:st.id,st.link.indexOf('http://')<0?(getPath()+'/'+st.link):st.link,st.name);
				}}, 
				{text: '删除快捷方式',click: function(){
					var st = $.workbench.rightMenu.shortcuts;
					$.post(getPath()+"/permission/shortcuts/delete",{id:st.id},function(res){
						$.workbench.refresh();
					},'json');
				}}
			]});
		return this;
	},
	addLineBar:function(){
		var bar = $('<div style="float:left;padding-top:20px;padding-left:20px;width:50px;height:100%"></div>').appendTo(this.bench);
		this.lineBars[this.lineBars.length] = bar;
		bar.size = 0;
		return bar;
	},
	addShortcuts:function(st){
		var bar;
		for(var i = 0; i < this.lineBars.length; i++){
			if(this.lineBars[i].size < this.maxSize){
				bar = this.lineBars[i];
			}
		}
		if(bar==null){
			bar = this.addLineBar();
		}
		var bk = st.iconPath?st.iconPath:"default/style/images/menu/defaultMaxIcon.gif";
		var shortCuts = $('<div style="width:50px;height:80px;">'
				+'<div style="background: url(\''+bk+'\');width:50px;height:50px"></div>'
				+'<div style="text-align:center">'+st.name+'</div>'
				+'</div>')
				.appendTo(bar)
				.bind('dblclick',function(){
					runTask(st.menu?st.menu.id:st.id,st.link.indexOf('http://')<0?(getPath()+'/'+st.link):st.link,st.name);
				}).bind("contextmenu",function(e){
					$.workbench.rightMenu.shortcuts = st;
					$.workbench.rightMenu.show({top:e.pageY,left:e.pageX});
					return false;
				});
		bar.size++;
		return shortCuts;
	},
	clear:function(){
		this.bench.empty();
		this.lineBars = [];
	},
	refresh:function(){
		this.clear();
		this.loadShortCuts();
	},
	loadShortCuts:function(){
		$.post(getPath()+'/permission/shortcuts/listData',{pageSize:1000},function(res){
			if(res && res.items){
				var sts = res.items;
				for(var i = 0; i < sts.length;i++){
					$.workbench.addShortcuts(sts[i]);
				}
			}
		},'json');
	}
}