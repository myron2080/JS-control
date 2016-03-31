$list_editUrl =  "";//编辑及查看url
$list_addUrl = "";//新增url
$list_deleteUrl = "";//删除url
$list_editWidth = "820px";
$list_editHeight = "400px";
$list_dataType = "人员任职历史调整";//数据名称
$(document).ready(function(){
	 
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '员工', name: 'personName', align: 'left', width: 85},
            {display: '部门', name: 'personOrgIdName', align: 'left', width: 90},
            {display: '类型', name: 'operateType.name', align: 'left', width: 50},
            {display: '描述', name: 'description', align: 'left', width: 330,render:descriptionRender},
            {display: '操作人', name: 'creatorName', align: 'left', width: 80},
            {display: '操作日期', name: 'createTime', align: 'center', width: 120}
        ],
        pageSize:25,
        height:'95%',
        url:getPath()+'/basedata/person/personPositionHisLogListData',
        delayLoad:true
    }));
	 
	searchData();
	eventFun($("#keyConditions"));
	eventFun($("#description"));
	$("#searchBtn").bind("click",searchData);
});
 
 
  
function descriptionRender(data,filterData){
	var description =  '<div title="'+data.description+'">'+data.description+"</div>" ;  
	return description;
}

function changeOrg(oldValue,newValue,doc){
	$("#longNumber").val(newValue.longNumber||'');
}
 
function searchData(){
	 
	var operateType = $('#operateType').val();
	var description = $('#description').val();
	var kw = $('#keyConditions').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	description = description.replace(/^\s+|\s+$/g,'');
	$('#keyConditions').val(kw);
	$('#description').val(description);
	 
	if(operateType){
		$list_dataParam['operateType'] = operateType;
	}else{
		delete $list_dataParam['operateType'];
	}
	 
	if(!kw || kw==$('#keyConditions').attr('defaultValue')){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	if(!description || description==$('#description').attr('defaultValue')){
		delete $list_dataParam['description'];
	}else{
		$list_dataParam['description'] = kw;
	}
	 
	$list_dataParam['orderByClause'] = ' D.FCREATETIME DESC ';
	resetList();
}
 