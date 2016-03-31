$list_editUrl = getPath()+"/projectm/task/editTask";//编辑及查看url
$list_addUrl = getPath()+"/projectm/task/addTask";//新增url
$list_deleteUrl = getPath()+"/projectm/task/deleteTask";//删除url
$list_editWidth = "722px";
$list_editHeight = "308px";
$list_dataType = "任务";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/task/simpleTreeData";
top.window.$addUrl = $list_addUrl;
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($("#main").height()-20);
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#treeSearch').val();
			treeLocate('leftTree','name',name);
			},icon:'search'}
		]
	});
			
	
	$("#toolBar").append(
		' <div style="display:inline;float:left;"><label id="includeContainer"><input type="checkbox" name="includeChild" id="includeChild" checked="checked" />包含下级</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+statusSelectTag+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开始时间：<input class="inputstyle" type="text" name="queryStartDate" id="queryStartDate" value="'+$("#queryStartDateStr").val()+'" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',alwaysUseStartDate:true})"/> 至 <input class="inputstyle" type="text" value="'+$("#queryEndDateStr").val()+'" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',alwaysUseStartDate:true})" id="queryEndDate" name="queryEndDate"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总工作量：<span id="totalSpan" style="color:red;"></span></div>'
		+'<div style="float:left;padding-left:5px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="任务名称" defaultValue="任务名称/责任人" value="任务名称/责任人" id="searchKeyWord" class="input"/>'
	    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><spanonclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
    	+'	</form>'
    	+'</div>'
	);
	$("#toolBar").ligerToolBar({
		items:[
		       {id:'add',text:'新增',click:addRow,icon:'add'}
		      
			]
		}); 
//	overflagSelectChangeFun();
	
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
           
            {display: '部门', name: 'org.name', align: 'left', width: 100},
            {display: '责任人', name: 'dutyPerson.name', align: 'left', width: 50},
            {display: '任务名称', name: 'displayName', align: 'left', width: 100},
            {display: '计划起始日期', name: 'beginDate', align: 'left', width: 100},
            {display: '计划结束日期', name: 'planEndDate', align: 'left', width: 100},
            {display: '工作量', name: 'workload', align: 'left', width: 50},
            {display: '详细内容', name: 'description', align: 'left', width: 230},
//            {display: '完成日期', name: 'endDate', align: 'left', width: 73},
            {display: '工作进度', name: 'tempo', align: 'left', width: 55,render:tempoRender},
            {display: '验证进度', name: 'validatedTempo', align: 'left', width: 55,render:validatedTempoRender},
            {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender}
        ],
        height:'95%',
        fixedCellHeight:true,
        url:getPath()+'/projectm/task/listData',
        delayLoad:true
    }));
	
	$('#includeContainer').bind('change',searchData);
	$("#searchKeyWord").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
});

function validatedTempoRender(data){
	return "<a style='cursor:pointer;' onclick='javascript:modifyTempo(\""+data.id+"\",\"validatedTempo\");'>"+((data.validatedTempo == '' || data.validatedTempo == null) ? 0 : data.validatedTempo)+ "%</a>";
}

function afterAddRow(){
	searchData();
}

function afterEditRow(){
	searchData();
}

function afterDeleteRow(){
	searchData();
}



function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {parent:selectNodes[0].id};
		}else{
			artDialog.alert("请先选择树节点",function(){})
			return 'notValidate';
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
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){
			delete $list_dataParam['oid'];
			$list_dataParam['longNumber'] = selectNodes[0].longNumber;
		}else{
			$list_dataParam['oid'] = selectNodes[0].id;
			delete $list_dataParam['longNumber'];
		}
	}else{
		delete $list_dataParam['id'];
		delete $list_dataParam['longNumber'];
	}
	$list_addUrl = top.window.$addUrl;
	$list_addUrl = $list_addUrl+"?orgId="+selectNodes[0].ID+"&orgName="+encodeURIComponent(encodeURIComponent(selectNodes[0].NAME));
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
	
	var queryStartDate = $("#queryStartDate").val();
	var queryEndDate = $("#queryEndDate").val();
	if(queryStartDate != null && queryStartDate != '' && queryEndDate!=null && queryEndDate != '' && queryStartDate > queryEndDate){
		art.dialog.tips("查询时间第一个框的值不能够大于第二个框的值！！");
		return;
	}
	
	if(null == queryStartDate || queryStartDate == ''){
		delete $list_dataParam['queryStartDate'];
	} else {
		$list_dataParam['queryStartDate'] = queryStartDate;
	}
	
	if(null == queryEndDate || queryEndDate == ''){
		delete $list_dataParam['queryEndDate'];
	} else {
		$list_dataParam['queryEndDate'] = queryEndDate;
	}
	
	var overflag = $("#overflag option:selected").val();
	if(overflag == null || '' == overflag){
		delete $list_dataParam['overflag'];
	} else {
		$list_dataParam['overflag'] = overflag;
	}
	
	resetList();
	
	/**
	 * 得到总的工作量
	 */
	$.post(getPath()+'/projectm/task/getTotalWorkload',
		{
		oid:$list_dataParam['oid'],
		longNumber:$list_dataParam['longNumber'],
		id:$list_dataParam['id'],
		key:$list_dataParam['key'],
		queryStartDate:$list_dataParam['queryStartDate'],
		queryEndDate:$list_dataParam['queryEndDate'],
		overflag:$list_dataParam['overflag']
		},function(result){
		if(null == result.totalWorkload  || '' == result.totalWorkload){
			$("#totalSpan").html('0');
		} else {
			$("#totalSpan").html(result.totalWorkload);
		}
	},'json');
}

/**
 * 禁用 / 启用
 * @param config
 * @param t
 */
function enableRow(config){
	var t = (config.status=='ENABLE'?'启用':'禁用');
	art.dialog.confirm('确定'+t+'数据吗?',function(){
	$.post(getPath() + '/basedata/org/enable',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
	});
}

function moveRow(rowData,flag){
	editRow(rowData,flag);
}



//编辑行
function editRow(rowData,editState){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
				paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
		}else{
				paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
		}
		if(editState){
			art.dialog.data("EDITSTATE",'MOVE');
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle(editState?'MOVE':'EDIT'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-EDIT",
				 button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(this);
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){
					 art.dialog.data("EDITSTATE",null);
					 if(flag){
						 if(typeof(afterEditRow)=='function'){
							 afterEditRow();
						 }
						 refresh();
					 }
				 }
				});
	}
}

//获取弹出窗口的标题
function getTitle(viewstate){
	if(!$list_dataType){
		$list_dataType = "数据";
	}
	switch(viewstate){
		case 'ADD':return $list_dataType+'-新增';
		case 'VIEW':return $list_dataType+'-查看';
		case 'EDIT':return $list_dataType+'-编辑';
		default:return $list_dataType;
	}
}
