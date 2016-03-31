$list_editUrl = getPath()+"/ebhouse/projectconfig/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebhouse/projectconfig/add";//新增url
$list_deleteUrl = getPath()+"/ebhouse/projectconfig/delete";//删除url
$list_editWidth = "350px";
$list_editHeight = "150px";
$list_dataType = "项目配置";//数据名称
var manager;
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	manager = $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
      			{display: '所属项目', name: 'houseProject.registerName', align: 'left', width:130 },
      			{display: '电脑端配置页面', name: 'pageUrl', align: 'left', width:250 },
      			{display: '移动端配置页面', name: 'mobileUrl', align: 'left', width:250},
      			{display: '操作', name: 'operate', align: 'center', width: 180,render:operateRender} 
        ],
        url:getPath()+'/ebhouse/projectconfig/listData',
        delayLoad:false
    }));
	bindEvent();
});
function operateRender(data,filterData){
	var str ='';
	str+= '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
	str+= ' | <a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	return str;	
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
function bindEvent(){
	 //新增
    $("#add").click(function(){
	 beforeAddRow();
     });
	$("#selectData").click(function(){
		selectList();
	});
//清除
	$("#clearData").click(function(){	
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
		$("#houseProjectId").val("");
		selectList();
	});
	$("#keyConditions").keydown(function(e){
    	enterSearch(e);
	});
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	//关键字
	var key=$("#keyConditions").val();
	
	//项目
	/*if($("#houseProjectId").val()!= ""){
		$list_dataParam['projectId'] = $("#houseProjectId").val();
	} else {
		delete $list_dataParam['projectId'];
	}*/
	
	//关键字
	if(key && ($('#keyConditions').attr("defaultValue") != key) && key!=$("#keyConditions").attr("defaultValue")){
		$list_dataParam['keyWord'] = key;
	}else{
		delete $list_dataParam['keyWord'];
	}
	resetList();
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
