$list_editUrl = getPath()+"/cmct/phoneDeputyNum/edit";//编辑及查看url
$list_addUrl = getPath()+"/cmct/phoneDeputyNum/add";//新增url
$list_deleteUrl = getPath()+"/cmct/phoneDeputyNum/delete";//删除url
$list_editWidth = 540;
$list_editHeight = 120;
$list_dataType = "副号转接" ;

$(document).ready(function(){
	
	$("#key").focus(function(){
		if($(this).val()=="副号号码/绑定人"){
			$(this).val("");
		}
	}).blur(function(){
		if($(this).val()==""){
			$(this).val("副号号码/绑定人");
		}
	});
	
	//注册控件key的回车查询事件
	inputEnterSearch('key',searchData);
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});

	//清空
	$("#clear").click(function(){
		MenuManager.menus["operatedate"].resetAll();
		$("#key").val("副号号码/绑定人");
	});
	
	params ={};
	params.inputTitle = "创建日期";	
	MenuManager.common.create("DateRangeMenu","operatedate",params);	
	var columnsParam=[ 
	                    {display: '操作', name: '', align: 'center', width: 100,render:editMethod},
	                    {display: '副号转接号码', name: 'billNumber', align: 'center', width:100},
	                    {display: '所属人', name: 'bindPerson.name', align: 'center', width:80},
	                    {display: '描述', name: 'description', align: 'center', width: 80},
		                {display: '创建时间', name:'createTime', align: 'center', width: 120}
		            ];
    
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		columns: columnsParam,
        url:getPath() + '/cmct/phoneDeputyNum/listData'
    }));
});

function editMethod(data){
	return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
			+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

function searchData(){
	//录入时间
	var startDate = "";
	var endDate = "";
	if(MenuManager.menus["operatedate"]){
		startDate = MenuManager.menus["operatedate"].getValue().timeStartValue;
		endDate = MenuManager.menus["operatedate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(startDate != ""){
		$list_dataParam['startDate'] = startDate;
	} else {
		delete $list_dataParam['startDate'];
	}
	//查询结束时间
	if(endDate != ""){
		$list_dataParam['endDate'] = endDate;
	} else {
		delete $list_dataParam['endDate'];
	}
	
	var key=$("#key").val();
	if(key == '副号号码/绑定人'){
		key='';
	}
	$list_dataParam['key'] = key;
	resetList();
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 
