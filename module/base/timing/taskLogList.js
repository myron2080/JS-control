$(document).ready(function(){
	$("#main").ligerLayout({});
	if(taskName!=""){
		$("#key").val(taskName);
		$("#key").attr("disabled","disabled");
		$("#key").attr("style","width:150px;");
	}
	eventFun($("#key"));
	params ={};
	params.inputTitle = "有效期";	
	MenuManager.common.create("DateRangeMenu","effectTime",params);
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '任务名称', name: 'task.name', align: 'left', width: 220},
            {display: '执行方式',name:'',align:'left',width:110,render:runTypeOprator},
            {display: '执行时间',name:'createTime',align:'left',dateFormat:"yyyy-MM-dd HH:mm",formatters:"date",width:160},
            {display: '执行日志',name:'',align:'center',width:200,render:infoOperator},
            {display: '失败日志',name:'',align:'center',width:200,render:oprator}
        ],
        url:getPath()+'/base/task/queryTaskLog?taskId='+taskId
    }));
});

function oprator(data){
	var info = data.info;
	info = info.replace(/'/g, "\\'");
	if(info=='执行成功'){
		return '';
	}
	return '<a href="javascript:infoDetail(\''+info+'\');">查看</a>';
}

function runTypeOprator(data){
	if(data.creatorName!=''){
		return "手动("+data.creatorName+")";
	}else{
		return "自动";
	}
}

function infoOperator(data){
	var info=data.info;
	if(info.indexOf("执行成功")<0){
		return "<lable style='color:red;'>执行失败</lable>";
	}else{
		return data.info;
	}
}

function infoDetail(info){
	artDialog(
	        {	
	        	width:350,
	        	height:400,
	            content:info,
	            lock:true,
	            style:'succeed noClose'
	        }
	);
}

function searchData(){
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	var queryDate = "";
	if(MenuManager.menus["effectTime"]){
		queryStartDate = MenuManager.menus["effectTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectTime"].getValue().timeEndValue;
	}
	if(queryStartDate == queryEndDate && queryEndDate != ""){
		$list_dataParam['queryDate'] = queryStartDate;
	}else{
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
		delete $list_dataParam['queryDate'];
	}
	
	var key = $('#key').val();
	if(key && ($('#key').attr("defaultValue") != key)){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	
	var status = $('#status option:selected').val();
	if(status != null && status != ""){
		if(status=="success"){
			$list_dataParam['success'] = "执行成功";
			delete $list_dataParam['failure'];
		}else{
			$list_dataParam['failure'] = "info";
			delete $list_dataParam['success'];
		}
	}else{
		delete $list_dataParam['success'];
		delete $list_dataParam['failure'];
	}
	
	resetList();
}