$list_editUrl = getPath()+"/basedata/person/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/person/add";//新增url
$list_deleteUrl = getPath()+"/basedata/person/delete";//删除url
$list_editWidth = "820px";
$list_editHeight = "400px";
$list_dataType = "职员";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/org/simpleTreeData";
var jobStatus="ONDUTY";
$(document).ready(function(){
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
	/*$("#toolBar").append(
			' <div style="display:inline;float:left;padding:0 0 0 3px;"><label id="includeContainer"><input type="checkbox" name="includeChild" id="includeChild" checked="checked" />包含下级</label></div>'
			+' <div style="display:inline;float:left;"><input type="checkbox" name="includeDisabled" id="includeDisabled" /><label for="includeDisabled">包含禁用员工</label></div>'
			//+' <div class="l-toolbar-item l-panel-btn l-toolbar-item-hasicon" toolbarid="add" onclick="addBillByType(1)">人员离职<div class="l-icon l-icon-add"/></div>'
			//+' <div class="l-toolbar-item l-panel-btn l-toolbar-item-hasicon" toolbarid="add" onclick="addBillByType(2)">人员调动<div class="l-icon l-icon-add"/></div>'
			+'<div style="padding:0 0 0 12px;float: left;">'
	    	+'	<form onsubmit="searchData();return false;">'	
		    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码/登陆账号" defaultValue="名称/编码/登陆账号" value="名称/编码/登陆账号" id="searchKeyWord" class="input"/>'
		    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
	    	+'	</form>'
	    	+'</div>'
		);*/
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	
	var items = [
			       {id:'add',text:'新增',click:addRow,icon:'add'},
			       {id:'add',text:'人员指定',click:personAssign,icon:'right_b'},
			       {id:'add',text:'任职历史调整',click:personPositionHisList,icon:'right_b'}
				];
	/*var permissionContent = {id:'permission',text:'批量授权',click:permissionManager,icon:'calendar'};
	if($("#hasPermission").val() && ("true" == $("#hasPermission").val())){	//如果有权限
		items.push(permissionContent);
	}*/
	/*$("#toolBar").ligerToolBar({
		items:items
		});*/
	
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	initSimpleDataTree();
	initTable();
	$("div[class=system_tab_title] li").click(
			function() {
				$(this).addClass("hover").siblings("li").removeClass("hover");
				var key = $(this).attr("key");
				if(key=="ONDUTY"){
					jobStatus = "ONDUTY";
					$list_dataParam['jobStatus'] = jobStatus;
					delete $list_dataParam['jobStatusIn'];
					
				}else if(key=="RUNDISK"){
					jobStatus = "'RUNDISK','PROBATION'";
					$list_dataParam['jobStatusIn'] = jobStatus;
					delete $list_dataParam['jobStatus'];
				}else if(key=="DIMISSION"){
					jobStatus = "DIMISSION";
					$list_dataParam['jobStatus'] = jobStatus;
					delete $list_dataParam['jobStatusIn'];
				}else if(key=='TEMPORARY'){//临时
					jobStatus = "'RUNDISK','PROBATION'";
					$list_dataParam['jobStatusIn'] = jobStatus;
					delete $list_dataParam['jobStatus'];
				}else if(key=="RETENTION"){//留职
					jobStatus = "'STAYUNTILRETIRE','STOPSALARYONDUTY'";
					$list_dataParam['jobStatusIn'] = jobStatus;
					delete $list_dataParam['jobStatus'];
				}
				initTable();
				searchData();
	});
	$("#two1").trigger("click");
	$('#includeChild').bind('change',searchData);
	$('#includeDisabled').bind('click',function(){
		var checkboxComp = $(this).find(":checkbox");
		checkboxComp.attr("checked",!checkboxComp.attr("checked"));
		searchData();
	});
});

function initTable(){
	var columns = [];
	var path = getPath()+'/basedata/person/listData';
	var jobStatusTemp=$(".system_tab li[class='hover']").attr("key");
	if(jobStatusTemp=='DIMISSION'){
		columns = [ 
	               {display: '工号', name: 'number', align: 'left', width: 100},
	               {display: '姓名', name: 'name', align: 'left', width: 70},
	               {display: '登陆账号', name: 'userName', align: 'left', width: 80},
	               {display: '组织', name: 'org.name', align: 'left', width: 120},
	               {display: '岗位状态', name: 'jobStatus.name', align: 'center', width: 60},
	               {display: '性别', name: 'sex.name', align: 'center', width: 60},
	               {display: '身份证号', name: 'idCard', align: 'center', width: 150},
	               {display: '离职日期', name: 'leaveDate', align: 'center', width: 120}
	           ];
		path = getPath()+'/hr/secretaryPerson/listDimissionData'; 
	}else if(jobStatusTemp=='ONDUTY'){
		columns = [ 
		           {display: '工号', name: 'number', align: 'left', width: 80},
		            {display: '姓名', name: 'name', align: 'left', width: 70},
		            {display: '登陆账号', name: 'userName', align: 'left', width: 80},
		            {display: '组织', name: 'personPosition.position.belongOrg.name', align: 'left', width: 120},
		            {display: '职位', name: 'personPosition.position.name', align: 'left', width: 100,render:positionRender},
		            {display: '入职日期', name: 'innerDate', align: 'left', width: 80},
		            {display: '分管部门', name: 'personPosition.chargeOrgNames', align: 'left', width: 120},
		            {display: '用户状态', name: 'status.name', align: 'center', width: 60},
		            {display: '职员维护', name: 'operate', align: 'center', width: 80,render:operateRender},
		            {display: '用户维护', name: 'operate', align: 'center', width: 150,render:userOperateRender}
			     ];
	}else{
		columns = [ 
			         {display: '工号', name: 'number', align: 'left', width: 100},
			         {display: '姓名', name: 'name', align: 'left', width: 70},
			         {display: '组织', name: 'personPosition.position.belongOrg.name', align: 'left', width: 120},
			         {display: '职位', name: 'personPosition.position.name', align: 'left', width: 100,render:positionRender},
			         {display: '岗位状态', name: 'jobStatus.name', align: 'center', width: 60},
			         {display: '性别', name: 'sex.name', align: 'center', width: 60},
			         {display: '身份证号', name: 'idCard', align: 'center', width: 150},
			         {display: '任职时间', name: 'personPosition.effectDate', align: 'center', width: 80,dateFormat:"yyyy-MM-dd",formatters:"date"},
			         {display: '操作', name: 'operate', align: 'center', width: 180,render:operateRenderTemporary,isSort:false}
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


function operateRenderTemporary(data,filterData){
	var e = (data.status.name=='启用'?'DISABLED':'ENABLE');
	var t = (data.status.name=='启用'?'禁用':'启用');
	var str = '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>  |  <a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a>';
	if($("#hasPermission").val() && ("true" == $("#hasPermission").val())){	//如果有权限
		str += ' |  <a href="javascript:editUser({id:\''+data.id+'\'});">登录设置</a>';
	}
	return str;
}

function addBillByType(type,personId){
	var url = getPath()+"/basedata/leaveOffice/add";
	var width = "952px";
	var height = "335px"
	if(type==2){
		url = getPath()+"/hr/positionchange/add";
		width = "750px";
		height = "400px"
	}else if(type==1){
		url = getPath()+"/basedata/leaveOffice/add";
		width = "520px";
		height = "235px"
	    if(personId){
	    	url += "?personId="+personId;
	    }
	}
	if(url && url!=''){
		var paramStr = '';
		if(url.indexOf('?')>0){
			paramStr = '&VIEWSTATE=ADD';
		}else{
			paramStr = '?VIEWSTATE=ADD';
		}
		if(typeof(getAddRowParam) == "function"){
			var param = getAddRowParam();
			//临时增加不满足则不打开窗口
			if(param=='notValidate') return;
			if(param){
				for(var p in param){
					paramStr = paramStr + '&' + p + '=' + param[p];
				}
			}
		}
		var flag = true;
		var dlg = art.dialog.open(url+paramStr,
				{title:'员工离职',
				 lock:true,
				 width:width||'auto',
				 height:height||'auto',
				 id:$list_dataType+"-ADD",
				 button:[{name:'保存',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this,"APPROVED");
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){
					 if(flag){
						 if(typeof(afterAddRow)=='function'){
							 afterAddRow();
						 }
						 resetList();
					 }
				 }
				});
	}
}

function permissionManager(){
	if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem('assignUserPermission',getPath()+'/permission/personPermission/list','职员权限');
	}
}

function operateRender(data,filterData){
		return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>  |<a href="javascript:addBillByType(1,\''+data.id+'\');">离职</a>';
}

function userOperateRender(data){
	var e = (data.status.name=='启用'?'DISABLED':'ENABLE');
	var t = (data.status.name=='启用'?'禁用':'启用');
	var str = '<a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a>';
	if($("#hasPermission").val() && ("true" == $("#hasPermission").val())){	//如果有权限
		str += '|<a href="javascript:personPermission({id:\''+data.id+'\'});">权限设置</a>';
	}
	if($("#hasLoginSetPermission").val() && ("true" == $("#hasLoginSetPermission").val())){//如果有权限
		str += '|<a href="javascript:editUser({id:\''+data.id+'\'});">登录设置</a>';
	}
	return  str;
}

function personPermission(person){
	art.dialog.open(getPath()+"/permission/personPermission/singlePersonPermission?person="+person.id,{
		title:'权限设置',
		lock:true,
		width:'800px',
		height:'480px',
		id:"personPermission",
		button:[{name:'确定'}]
	});
}

function viewUser(user){
	var u = getPath()+"/permission/user/edit";
	var paramStr = '?VIEWSTATE=VIEW&id='+user.id;
	var flag = true;
	var dlg = art.dialog.open(u+paramStr,
		{title:"用户-查看",
		 lock:true,
		 width:'580px',
		 height:'250px',
		 id:"user-VIEW",
		 button:[{name:'确定'}]
		});
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
	searchData();
}
function searchData(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){
			$list_dataParam['includeChild'] = true;
			$list_dataParam['orgLongNumber'] = selectNodes[0].longNumber;
		}else{
			$list_dataParam['orgLongNumber'] = selectNodes[0].longNumber;
			delete $list_dataParam['includeChild'];
		}
	}else{
		delete $list_dataParam['id'];
		delete $list_dataParam['orgLongNumber'];
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
		$list_dataParam['includeDisabled'] = 'DISABLED';
		delete $list_dataParam['status'];
	}else{
		$list_dataParam['status']='ENABLE';
		delete $list_dataParam['includeDisabled'];
	}
	$list_dataParam['sortname'] = 'longNumberAndPost';
	$list_dataParam['sortorder'] = 'asc';
	resetList();
}

function personAssign(){
	/*var u = getPath()+"/basedata/person/personAssignList";
	var flag = true;
	var dlg = art.dialog.open(u,
		{title:"人员-指定",
		 lock:true,
		 width:($(window).width()-300),
		 height:($(window).height()-100),
		 id:"to-user-assign",
		 cancelVal:'关闭',
		 cancel:function(){
			 refresh();
			},
		 close:function(){
			 refresh();
		 }
		});*/
	if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem('personAssign',getPath()+'/basedata/person/personAssignList','人员指定');
	}	
}
function personPositionHisList(){
	 
	if(typeof(window.top.addTabItem)=='function'){
		window.top.addTabItem('personPositionHisList',getPath()+'/basedata/person/personPositionHisList','人员任职历史调整');
	}	
}