$list_editUrl = getPath()+"/hr/salaryStandard/edit";//编辑及查看url
$list_addUrl = getPath()+"/hr/salaryStandard/add";//新增url
$list_deleteUrl = getPath()+"/hr/salaryStandard/delete";//删除url
$list_editWidth = "550px";
$list_editHeight = "180px";
$list_dataType = "薪酬标准";//数据名称
var columns;
var g;
var itemLength;
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	getCol();
	$("#selectData").click(function(){
		selectList();
	});
	$("#addNew").click(function(){
		beforeAddRow();
	});
	//清除
	$("#clearData").click(function(){	
		//MenuManager.menus["createTime"].resetAll();
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
	});
	eventFun($("#keyConditions"));
});
var colIds = [] ;
function getCol(){
	/*
	var columns = [] ;
	var jsonModel = {} ;
	jsonModel.display = "111" ;
	jsonModel.name = "name" ;
	jsonModel.align = "align" ;
	columns.push(jsonModel);
	*/
	$.post(getPath()+"/hr/salaryItem/getItemBycolumns",function(data){
		var cols="";
		itemLength = data.length;
		if(data.length>0){
			colIds = [] ;
			for(var i = 0;i< data.length;i++){
				cols+="{display: '"+data[i].name+"', name: '', align: 'left',id: '"+data[i].name+"',width:80,render:getSalaryItem},";
				colIds.push(data[i].id);
		}}
		columns = eval("["
				+"{display: '岗位', name: 'job.name', align: 'left', width:80},"
				+"{display: '职级', name: 'jobLevel.name', align: 'left', width:80},"
				+cols
				+"{display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender} "
				+"]");
		g=$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
			columns:columns,
	        url:getPath()+'/hr/salaryStandard/listData',
	        delayLoad:false,
	        onAfterShowData:function(rowData,rowIndex){
	        	rdIndex = 0 ;
	        }
	    }));
	},'json');
}
var rdIndex = 0 ;
function getSalaryItem(data,rowIndex){	
	//\''+data.id+'\',\'bill\'
	 var obj = data.standardItemList;
	 var size = obj.length ;
	 var str = "" ;
	 for(var i = 0 ; i < size ; i ++){
		 if(obj[i].salaryItem.id == colIds[rdIndex]){
			 str = obj[i].amount ;
			 break ;
		 }
	 }
	 rdIndex ++;
	 if(itemLength==rdIndex){
		 rdIndex = 0;
	 }
	 return str;
}

function operateRender(data,filterData){
	return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
	+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
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

//getItemBycolumns
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
