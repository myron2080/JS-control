$list_addUrl = getPath()+"/cmct/smsControl/viewShortMessage";//查看url
$list_editWidth = 450;
$list_editHeight = 140;
var map={SEND_ING:"发送中",SEND_SUCCESS:"发送成功",SEND_FAIL:"发送失败"};
$list_dataType = "短信查看";//数据名称
 
$(document).ready(function(){
	 
	params ={};
	params.inputTitle = "发送时间";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '工号', name: 'senderNumber', align: 'left', width: 80},
            {display: '姓名', name: 'senderName', align: 'left', width: 80},
            {display: '创建时间', name: 'createTime', align: 'left', width: 120},
            {display: '发送时间', name: 'sendTime', align: 'left', width: 120},
            {display: '类别', name: 'type.name', align: 'left', width: 50},
            {display: '账户', name: 'controlType.name', align: 'left', width: 50},
            {display: '接收人', name: 'receiverName', align: 'left', width: 80},
            {display: '电话', name: 'receiverPhoneNum', align: 'left', width: 90},
            {display: '短信条数', name: 'sendSmsCount', align: 'left', width: 80},
            {display: '回执状态', name: 'status', align: 'left', width: 120,render:enumRender},
            {display: '内容', name: 'content', align: 'left', width: 280,render:contentRender}
        ],
        url:getPath()+'/cmct/smsControl/listShortMessageData',
        delayLoad:true,
        usePager:true,
        enabledSort:false
    }));
	
	bindEvent(); 
	searchData();
});

function contentRender(data){
	return "<span title='"+data.content+"'>"+data.content+"</span>";
}
function enumRender(data){
	if(data.status != 'SEND_ING'){
		return map[data.status];
	}else{
		return "";
	}
}

 

function bindEvent(){
	
 
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	
	//清空
	$("#resetBtn").click(function(){
		MenuManager.menus["effectdate"].resetAll();
		clearDataPicker('keyPerson');
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		$("#senderName").val($("#senderName").attr("defaultValue"));
	});
	
	$("#searchKeyWord").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
	
	eventFun($("#searchKeyWord"));
	eventFun($("#senderName"));
	
	inputEnterSearch('searchKeyWord',searchData);
}


 
  
function searchData(){
	
	$list_dataParam['controlType']='PERSONAL_TYPE';
	$list_dataParam['orderByClause'] = " D.FSENDTIME desc";
	
	var senderId = $('#senderId').val();
	if(senderId){
		$list_dataParam['senderId'] = senderId;
	}else{
		delete $list_dataParam['senderId'];
	}
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["effectdate"]){
		queryStartDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
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
	
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	
	resetList();
}