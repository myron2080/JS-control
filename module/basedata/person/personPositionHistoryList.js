$list_editUrl = getPath()+"/basedata/person/personPositionHisEdit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/person/add";//新增url
$list_deleteUrl = getPath()+"/basedata/person/delete";//删除url
$list_editWidth = "820px";
$list_editHeight = "400px";
$list_dataType = "人员任职历史调整";//数据名称
$(document).ready(function(){
	 
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '状态', name: '', align: 'left', width: 85,render:descRender},
            {display: '工号', name: 'number', align: 'left', width: 85},
            {display: '姓名', name: 'name', align: 'left', width: 90},
            {display: '身份证', name: 'idCard', align: 'left', width: 130},
            {display: '组织', name: 'org.name', align: 'left', width: 130},
            {display: '岗位状态', name: 'jobStatus.name', align: 'left', width: 80},
            {display: '操作', name: 'operate', align: 'center', width: 120,render:operateRender}
        ],
        pageSize:25,
        height:'95%',
        url:getPath()+'/basedata/person/personPositionHisListData',
        delayLoad:true
    }));
	 
	searchData();
	eventFun($("#keyConditions"));
	$("#searchBtn").bind("click",searchData);
	$("#viewLogBtn").bind("click",viewLogs);
	$("#keyConditions").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
});
 
 
function descRender(data,filterData){
   if(data.description=='Y'){
	   return '正常'
   }else{
	   return '<font color="red">不正常</font>';
   }
	 
}
  
function operateRender(data,filterData){
	var operateStr =  '<a href="javascript:editRow({id:\''+data.id+'\'});">修改任职历史</a>' ;  
	return operateStr;
}

function changeOrg(oldValue,newValue,doc){
	$("#longNumber").val(newValue.longNumber||'');
}
 
function searchData(){
	 
	var jobStatusId = $('#jobStatusId').val();
	var longNumber = $('#longNumber').val();
	var kw = $('#keyConditions').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#keyConditions').val(kw);
	 
	if(jobStatusId){
		$list_dataParam['jobStatusId'] = jobStatusId;
	}else{
		delete $list_dataParam['jobStatusId'];
	}
	if(longNumber){
		$list_dataParam['longNumber'] = longNumber;
	}else{
		delete $list_dataParam['longNumber'];
	}
	if(!kw || kw==$('#keyConditions').attr('defaultValue')){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	 
	//$list_dataParam['notDimission'] = "Y";//不查离职人员
	//$list_dataParam['orderByClause'] = ' O.FLONGNUMBER ASC ,PO.FNAME ASC ';
	resetList();
}

function viewLogs(){
	var u = getPath()+"/basedata/person/personPositionHisLogList";
	var flag = true;
	var dlg = art.dialog.open(u,
		{title:"任职历史调整 日志查看",
		 lock:true,
		 width:800,
		 height:560,
		 id:"user-viewlog",
		 cancelVal:'关闭'
		 
		});
}