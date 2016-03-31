$(function(){
	//日期控件
	var params ={};
	params.inputTitle = "查询日期";	
	MenuManager.common.create("DateRangeMenu","searchDate",params);
	
	//数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '用户', name: 'userName', align: 'center', width: 120,render:function(data){
            	var showName;
            	if(data.userName && data.userName != ''){
            		showName = data.userName;
            	}else{
            		//显示解密后的手机号
            		showName = data.plaintext;
            	}
            	return '<a href="javascript:recommendDetail({id:\''+data.id+'\'});">'+showName+'</a>';
            }},
            {display: '电话', name: 'plaintext', align: 'center', width:120},
			{display: '一级下线', name: 'oneCount', align: 'center', width:80},
			{display: '二级下线', name: 'twoCount', align: 'center', width:80},
			{display: '一级推荐赠送分钟', name: 'onePresentationMinute', align: 'center', width:120},
			{display: '二级推荐赠送分钟', name: 'twoPresentationMinute', align: 'center', width:120}
        ],
        
        url: getPath()+"/bage/recommendManager/listData"
    }));
	
	//回车事件绑定
    $('#keyWord').on('keyup', function(event) {
        if (event.keyCode == "13") {
        	searchData();
        }
    });
});

//查询按钮
function searchData(){
	//发布日期
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["searchDate"]){
		queryStartDate = MenuManager.menus["searchDate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["searchDate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	var keyWord= $("#keyWord").val();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	resetList();
}

//清空
function onEmpty(){
	MenuManager.menus["searchDate"].resetAll();
	delete $list_dataParam['keyWord'];	
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
}

//导出数据
/**
 * 导出Excel
 */ 
function backup(){
	//发布日期
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["searchDate"]){
		queryStartDate = MenuManager.menus["searchDate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["searchDate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
	} 
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
	}
	var keyWord= $("#keyWord").val();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		
	} else{
		keyWord='';
	}
	var url = getPath()+"/bage/recommendManager/backup?keyWord="+keyWord+"&queryStartDate="+queryStartDate+"&queryEndDate"+queryEndDate;
	var frame = $('#downLoadFile');
	frame.attr('src',url);
}

/**
 * 显示推荐细节
 * @param data
 */
function recommendDetail(data){
	//开启一个窗口
	var dlg = art.dialog.open(getPath()+'/bage/recommendManager/recommendShow?id='+data.id, {
		title : '推荐明细',
		lock : true,
		width : '850px',
		height : '600px',
		id : 'recommendDetailDlg',
		button : [ {
			name : '取消',
			callback : function() {
				flag = false;
				return true;
			}
		} ],
		close : function() {
			refresh();
		}
	});
}