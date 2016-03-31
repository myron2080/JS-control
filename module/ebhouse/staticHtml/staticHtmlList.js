var d;
$(function(){
	params ={};
	params.inputTitle = "操作时间";	
	MenuManager.common.create("DateRangeMenu","operateTime",params);
	
	bindEvent();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作时间', name: 'formatOperateTime', align: 'left', width: 148},
            {display: '操作人', name: 'operatorName', align: 'left', width: 100},
            {display: '操作内容', name: 'content', align: 'left', width: 550}
        ],
        delayLoad:true,
        url:getPath()+'/ebhouse/staticHtml/listData'
    }));
	
	searchData();
});



function searchData(){
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["operateTime"]){
		queryStartDate = MenuManager.menus["operateTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["operateTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	
	resetList();
}

function openDialog(){
	d = art.dialog({
		title:'操作提示',
	    content: document.getElementById('waitDiv'),
	    id: 'waitDiv',
	    lock:true});
}

function closeDialog(){
	d.close();
}

/**
 * 绑定事件
 */
function bindEvent(){
	$("#searchBtns").bind("click",function(){
		searchData();
	});
	
	$("#staticIndex").bind("click",function(){
		//静态化首页
		art.dialog.confirm("确定要静态化首页吗？",function(){
			openDialog();
			$.post(getPath()+"/ebhouse/staticHtml/staticIndex",{},function(data){
				closeDialog();
				if(data.STATE == 'SUCCESS'){
					art.dialog({
						icon: 'succeed',
					    time: 1,
					    content: data.MSG
					});
					setTimeout(searchData,1000);
				}else {
					art.dialog.alert(data.MSG);
				}
			},"json");
		});
	});
	
	$("#staticProjectView").bind("click",function(){
		//静态化项目查看界面
		art.dialog.confirm("确定要静态化项目查看页面吗？",function(){
			openDialog();
			$.post(getPath()+"/ebhouse/staticHtml/staticProjectView",{},function(data){
				closeDialog();
				if(data.STATE == 'SUCCESS'){
					art.dialog({
						icon: 'succeed',
					    time: 1,
					    content: data.MSG
					});
					setTimeout(searchData,1000);
				}else {
					art.dialog.alert(data.MSG);
				}
			},"json");
		});
	});
	
	$("#staticFindhomeList").bind("click",function(){
		//静态化新房团购界面
		art.dialog.confirm("确定要静态化新房团购页面吗？",function(){
			openDialog();
			$.post(getPath()+"/ebhouse/staticHtml/staticFindhomeList",{},function(data){
				closeDialog();
				if(data.STATE == 'SUCCESS'){
					art.dialog({
						icon: 'succeed',
					    time: 1,
					    content: data.MSG
					});
					setTimeout(searchData,1000);
				}else {
					art.dialog.alert(data.MSG);
				}
			},"json");
		});
	});
	
	$("#staticMarketactivityList").bind("click",function(){
		//静态化最新活动界面
		art.dialog.confirm("确定要静态化最新活动页面吗？",function(){
			openDialog();
			$.post(getPath()+"/ebhouse/staticHtml/staticMarketactivityList",{},function(data){
				closeDialog();
				if(data.STATE == 'SUCCESS'){
					art.dialog({
						icon: 'succeed',
					    time: 1,
					    content: data.MSG
					});
					setTimeout(searchData,1000);
				}else {
					art.dialog.alert(data.MSG);
				}
			},"json");
		});
	});
	
	$("#staticDecoratingList").bind("click",function(){
		//静态化精品装修界面
		art.dialog.confirm("确定要静态化精品装修页面吗？",function(){
			openDialog();
			$.post(getPath()+"/ebhouse/staticHtml/staticDecoratingList",{},function(data){
				closeDialog();
				if(data.STATE == 'SUCCESS'){
					art.dialog({
						icon: 'succeed',
					    time: 1,
					    content: data.MSG
					});
					setTimeout(searchData,1000);
				}else {
					art.dialog.alert(data.MSG);
				}
			},"json");
		});
	});
	
}