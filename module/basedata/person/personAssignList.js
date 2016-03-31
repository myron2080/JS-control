$list_editUrl = getPath()+"/basedata/person/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/person/add";//新增url
$list_deleteUrl = getPath()+"/basedata/person/delete";//删除url
$list_editWidth = "820px";
$list_editHeight = "400px";
$list_dataType = "人员指定";//数据名称
$(document).ready(function(){
	 
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '工号', name: 'number', align: 'left', width: 85},
            {display: '姓名', name: 'name', align: 'left', width: 90},
            {display: '入职日期', name: 'innerDate', align: 'left', width: 90},
            {display: '系统组织', name: 'personPosition.position.belongOrg.name', align: 'left', width: 110},
            {display: '系统岗位', name: 'personPosition.position.name', align: 'left', width: 110},
            {display: '部门', name: 'oldOrgName', align: 'left', width: 120},
            {display: '岗位', name: 'oldPosiName', align: 'left', width: 160},
            {display: '操作', name: 'operate', align: 'center', width: 120,render:operateRender}
        ],
        url:getPath()+'/basedata/person/personAssignListData',
        delayLoad:true
    }));
	 
	searchData();
	eventFun($("#keyConditions"));
	$("#searchBtn").bind("click",searchData);
});
 

function operateRender(data,filterData){
	var operateStr = '' ;
	  if(!data.personPosition || !data.personPosition.id || !data.personPosition.position || !data.personPosition.position.id){
		operateStr += '<a href="javascript:editRow({id:\''+data.id+'\'});">指定</a>' ;   
	    operateStr += ' |<a href="javascript:deleteRow({id:\''+data.id+'\'});" class="delete_font">删除</a>';
	  }else{
		  operateStr += '已指定' ; 
	  }
		return operateStr;
}
  
 
function searchData(){
	 
	var assignedFlag = $('#assignedFlag').val();
	var kw = $('#keyConditions').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#keyConditions').val(kw);
	 
	if(assignedFlag){
		$list_dataParam['assignedFlag'] = assignedFlag;
	}else{
		delete $list_dataParam['assignedFlag'];
	}
	if(!kw || kw==$('#keyConditions').attr('defaultValue')){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	 
	$list_dataParam['notDimission'] = "Y";//不查离职人员
	$list_dataParam['orderByClause'] = ' O.FLONGNUMBER ASC ,PO.FNAME ASC ';
	resetList();
}

function personAssign(){
	var u = getPath()+"/permission/user/edit";
	var flag = true;
	var dlg = art.dialog.open(u,
		{title:"人员-指定",
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"user-assign",
		 cancelVal:'关闭',
		 cancel:function(){
			 refresh();
			},
		 close:function(){
			 refresh();
		 }
		});
}