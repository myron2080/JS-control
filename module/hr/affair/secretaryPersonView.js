$list_editUrl = getPath()+"/hr/secretaryPerson/edit";//编辑及查看url
$list_addUrl = getPath()+"/hr/secretaryPerson/add";//新增url
$list_deleteUrl = getPath()+"/hr/secretaryPerson/delete";//删除url
//$list_editWidth = "650px";
//$list_editHeight = "400px";
$list_editWidth = "952px";

$list_editHeight = ($(window).height()-150)+"px";
$list_dataType = "职员";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/hr/secretaryPerson/treeData";
var jobStatus ="ONDUTY";
$list_dataParam['jobStatus'] = jobStatus;
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	//$("#toolBar").ligerToolBar();
	params ={};
	params.inputTitle = "任职时间";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	
	//initDelayTree();
	initSimpleDataTreeLoc();
	initTable();
	$('#includeContainer').bind('click',searchData);
	
	$('#status').bind('change',function(){
		searchData();
	});
	
	$("div[class=system_tab_title] li").click(
			function() {
				$(this).addClass("hover").siblings("li").removeClass("hover");
				var key = $(this).attr("key");
				if(key=="ONDUTY"){
					jobStatus = "ONDUTY";
					$list_dataParam['jobStatus'] = jobStatus;
					$("#jobStatusIn").val("ONDUTY");
					delete $list_dataParam['jobStatusIn'];
					
				}else if(key=="RUNDISK"){
					jobStatus = "'RUNDISK','PROBATION'";
					$list_dataParam['jobStatusIn'] = jobStatus;
					$("#jobStatusIn").val("RUNDISK");
					delete $list_dataParam['jobStatus'];
				}else if(key=="DIMISSION"){
					jobStatus = "DIMISSION";
					$list_dataParam['jobStatus'] = jobStatus;
					$("#jobStatusIn").val("DIMISSION");
					delete $list_dataParam['jobStatusIn'];
				}
				initTable();
				searchData();
			});
	
	//清空
	$("#resetBtn").click(function(){
		MenuManager.menus["effectdate"].resetAll();
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
	});
	
	//导出按钮
	$("#exportBtn").bind("click",function(){
		exportPersonByCond();
	});
	
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
});

function initSimpleDataTreeLoc(){
	$.post($tree_async_url,{},function(treeData){
		var tree = $.fn.zTree.init($("#"+$tree_container), {
			async: {
				enable: false
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					if(typeof(onTreeNodeClick) == "function"){
						onTreeNodeClick(event, treeId, treeNode);
					}
				},
				onAsyncSuccess:function(event, treeId, node, msg){
					if(typeof(onTreeAsyncSuccess) == "function"){
						onTreeAsyncSuccess(event, treeId, node, msg);
					}
				}
			},
			data:{
				simpleData:{
					enable: true,
					idKey: "id",
					pIdKey: "pid",
					rootPId: null
				}
			}
		},treeData);
		var nodes = tree.getNodes();
		if(nodes && nodes.length > 0){
			tree.expandNode(nodes[0], true, false, true);
			tree.selectNode(nodes[0]);
			$('#longN').val(nodes[0].longNumber);
		}
		if(searchData){
			searchData();
		}
	},'json');
}
/**
 * 导出Excel
 */ 
function exportPersonByCond(){
	var param = "";
	var orgLongNum = $('#longN').val();
	if(orgLongNum){
		param += "longNumber="+orgLongNum;
	} else {
		//如果为空，提示请选择组织
		art.dialog.tips('请选择需要导出数据的组织');
		return ;
	}
	 
	var url = getPath()+"/hr/person/exportPersonByCond?jobStatus="+$("#jobStatusIn").val()+"&includeChild="+$("#includeChild").val()+"&"+param;
	var frame = $('#downLoadFile');
	frame.attr('src',url);
}

function initTable(){
	var columns = [];
	var path = getPath()+'/hr/secretaryPerson/listData';
	if(jobStatus=='DIMISSION'){
		columns = [ 
	               {display: '工号', name: 'number', align: 'left', width: 100},
	               {display: '登录账号', name: 'userName', align: 'left', width: 100},
	               {display: '姓名', name: 'name', align: 'left', width: 70},
	               {display: '组织', name: 'org.name', align: 'left', width: 120},
	               {display: '岗位状态', name: 'jobStatus.name', align: 'center', width: 60},
	               {display: '性别', name: 'sex.name', align: 'center', width: 60},
	               {display: '身份证号', name: 'idCard', align: 'center', width: 150},
	               {display: '离职日期', name: 'leaveDate', align: 'center', width: 120}
	           ];
		path = getPath()+'/hr/secretaryPerson/listDimissionData'; 
	}else{
		columns = [ 
			         {display: '工号', name: 'number', align: 'left', width: 100},
			         {display: '登录账号', name: 'userName', align: 'left', width: 100},
			         {display: '姓名', name: 'name', align: 'left', width: 70},
			         {display: '组织', name: 'personPosition.position.belongOrg.name', align: 'left', width: 120},
			         {display: '职位', name: 'personPosition.position.name', align: 'left', width: 100,render:positionRender},
			         {display: '岗位状态', name: 'jobStatus.name', align: 'center', width: 60},
			         {display: '性别', name: 'sex.name', align: 'center', width: 60},
			         {display: '身份证号', name: 'idCard', align: 'center', width: 150},
			         {display: '任职时间', name: 'personPosition.effectDate', align: 'center', width: 80,dateFormat:"yyyy-MM-dd",formatters:"date"},
			         {display: '操作', name: 'operate', align: 'center', width: 180,render:operateRender,isSort:false}
			     ];
	}
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columns,
        url:path,
        delayLoad:true,
        height: '99%', 
        usePager: true,
        enabledSort:true
    }));
}

function positionRender(data){
	if(data.personPosition.jobLevel.name){
		return data.personPosition.jobLevel.name;
	}
	return personPosition.position.name;
}
function operateRender(data,filterData){
	if("DIMISSION"==data.jobStatus.number){
		return "";
	}
	var e = (data.status.name=='启用'?'DISABLED':'ENABLE');
	var t = (data.status.name=='启用'?'禁用':'启用');
	var str = '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>  |  <a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a>';
	if($("#hasPermission").val() && ("true" == $("#hasPermission").val())){	//如果有权限
		str += ' |  <a href="javascript:editUser({id:\''+data.id+'\'});">登录设置</a>';
	}
	return str;
}


function editUser(user,state){
		var u = getPath()+"/permission/user/edit";
		var paramStr = '?VIEWSTATE=EDIT&id='+user.id;
		var flag = true;
		var dlg = art.dialog.open(u+paramStr,
			{title:"用户-编辑",
			 lock:true,
			 width:'580px',
			 height:'250px',
			 id:"user-EDIT",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit();
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
			});
}

function enableRow(config){
	$.post(getPath() + '/permission/user/enable',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}



function viewRow(rowData){
	art.dialog.open(getPath()+"/hr/secretaryPerson/view"+"?id="+rowData.id,
			{title:getTitle('VIEW'),
			lock:true,
			width:$list_editWidth||'auto',
			height:$list_editHeight||'auto',
			id:$list_dataType+'-VIEW',
			button:[{name:'关闭'}]}
	);
}


function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {parent:selectNodes[0].id};
		}
	}
	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id}; 
	}
	return null;
}

function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	$('#longN').val(treeNode.longNumber);
	searchData();
}
function searchData(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		if($('#status').val() == '' || $('#status').val() == undefined){
			delete $list_dataParam['status'];
			$list_dataParam['orgLongNumber']=selectNodes[0].longNumber;
			$list_dataParam['includeChild']=true;
			$("#includeChild").val("true");
		}else{
			$list_dataParam['orgLongNumber']=selectNodes[0].longNumber;
			$list_dataParam['status'] = $('#status').val();
			$list_dataParam['includeChild']=true;
			$("#includeChild").val("true");
		}
	}else{
		delete $list_dataParam['id'];
		delete $list_dataParam['orgLongNumber'];
		$("#includeChild").val("");
		return false;
	}
	
	//任职时间
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
	
	if($('#includeDisabled:checked').attr('checked') == true || $('#includeDisabled:checked').attr('checked') == 'checked'){
		$list_dataParam['includeDisabled'] = true;
	}else{
		delete $list_dataParam['includeDisabled'];
	}
	resetList();
}