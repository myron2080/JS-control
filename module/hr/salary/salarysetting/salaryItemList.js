$list_editUrl = getPath()+"/hr/salaryItem/edit";//编辑及查看url
$list_addUrl = getPath()+"/hr/salaryItem/add";//新增url
$list_deleteUrl = getPath()+"/hr/salaryItem/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "180px";
$list_dataType = "薪酬项目";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
                {display: '编号', name: 'number', align: 'left', width:80},
      			{display: '名称', name: 'name', align: 'left', width:80},
      			{display: '状态', name: 'status', align: 'left', width:80,render:function(data){
      				return (data.status=='ENABLE'?'启用':'禁用')
                } },
      			{display: ' 描述', name: 'remark', align: 'left', width:200 },
      			{display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender} 
        ],
        url:getPath()+'/hr/salaryItem/listData',
        delayLoad:false
    }));
	$("#selectData").click(function(){
		selectList();
	});
	$("#addNew").click(function(){
		beforeAddRow();
	});
	//清除
	$("#clearData").click(function(){	
		MenuManager.menus["createTime"].resetAll();
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
	});
	eventFun($("#keyConditions"));
});

function operateRender(data,filterData){
	var e = (data.status=='ENABLE'?'DISABLED':'ENABLE');
	var t = (data.status=='ENABLE'?'禁用':'启用');
	return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
	+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>'
	+ '|<a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a>';
}
/**
 * 禁用 / 启用
 * @param config
 * @param t
 */
function enableRow(config){
	var t = (config.status=='ENABLE'?'启用':'禁用');
	art.dialog.confirm('确定'+t+'数据吗?',function(){
	$.post(getPath() + '/hr/salaryItem/enable',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
	});
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	//时间
	/*var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
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
	}*/
	//关键字条件
	var keyConditions = $('#keyConditions').val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		$list_dataParam['keyConditions'] = keyConditions;
	}else{
		delete $list_dataParam['keyConditions'];
	}
	resetList();
}
function eventFun(obj){
	$(obj).blur(function(){
		if(!$(obj).val() || ($(obj).val() == "")){
			$(obj).val($(obj).attr("defaultValue"));
		}
	}).focus(function(){
		if($(obj).val() && ($(obj).val() == $(obj).attr("defaultValue"))){
			$(obj).val("");
		}else {
			$(obj).select();
		}
	});
}


function getAddRowParam(){

	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function beforeAddRow(){
	addRow({});
}

/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}
