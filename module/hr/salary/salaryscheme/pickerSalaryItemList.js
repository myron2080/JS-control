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
      			{display: '获取方式', name: 'itemType.name', align: 'left', width:80},
      			{display: '状态', name: 'status', align: 'left', width:80,render:function(data){
      				return (data.status=='ENABLE'?'启用':'禁用')
                } },
      			{display: ' 描述', name: 'remark', align: 'left', width:200 }
        ],
        checkbox:true,
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

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
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

function returnVal(){
	art.dialog.tips("请选择项目");
}
