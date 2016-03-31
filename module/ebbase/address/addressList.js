$list_editUrl = getPath()+"/ebbase/address/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebbase/address/add";//新增url
$list_deleteUrl = getPath()+"/ebbase/address/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "140px";
$list_dataType = "地址管理";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/ebbase/address/simpleTreeData";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($("#main").height()-45);
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val().trim();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
	        {display: '操作', name: 'operate', align: 'center', width: 170,render : operateRender},
	        {display: '名称', name: 'name', align: 'left', width: 120},
	        {display: '地址全称', name: 'fullName', align: 'left', width: 260},
            {display: '编码', name: 'number', align: 'left', width: 100},
            {display: '行政级别', name: 'workUnitEnumStr', align: 'center', width: 80},
            {display: '所属单位', name: 'parent.name', align: 'left', width: 130},
            {display: '顺序号', name: 'sortNum', align: 'left', width: 50},
            {display: '负责仓库', name: 'storageName', align: 'left', width: 180},
            {display: '负责人', name: 'personName', align: 'left', width: 130},
            {display: '状态', name: 'isEnable', align: 'left', width: 130,render:function(data){
            	if(data.isEnable==1){
            		return "启用";
            	}
            	return '<span style="color:red">禁用</span>';
            }}
        ],
        height:'95%',
        fixedCellHeight:false,
        url:getPath()+'/ebbase/address/listData',
        delayLoad:true
    }));
	$('#includeContainer').bind('change',searchData);
	$("#searchKeyWord").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
});

function operateRender(data) {
	 var res ="";
	 if(DZBJ && DZBJ == 'Y'){
		 res +="<a style=\"color:blue\" href=\"javascript:editRow({id:'"+ data.id + "'})\">编辑</a>";
	 }
	 if(DZSC && DZSC =='Y'){
		 if(res!=""){
			 res+=" | ";
		 }
		 res +="<a style=\"color:blue\" href=\"javascript:deleteRow({id:'"+ data.id +"'})\">删除 </a>";
	 }
	 if(res!=""){
		 res+=" | ";
	 }
	 /* res +="<a style=\"color:blue\" href=\"javascript:reflushTime('"+ data.id +"')\">刷新 </a>";*/
 	 if (data.isEnable == 1) {
 		res = res+'<a style=\"color:blue\" href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a>';
 	 } else{
 		res = res+'<a style=\"color:blue\" href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a>';
 	 } 
	 return res;
}

function onEmpty() {
	delete $list_dataParam['key'];
	delete $list_dataParam['workUnit'];
	$("#workUnit").val("");
	$("#searchKeyWord").attr("value", $("#searchKeyWord").attr("defaultValue"));
	$("#isEnable").val("");
	searchData();
}
function reflushTime(objId){ //更新最后更新时间
	$.post(getPath()+'/ebbase/address/reflushTime',{id:objId},function(res){
		searchData();
	},'json');
}
function editRowData(data){
	$list_editUrl = getPath()+"/ebbase/address/edit";
	editRow(data);
}

function afterAddRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function afterEditRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function afterDeleteRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {parent:selectNodes[0].id};
		}
//		else{
//			artDialog.alert("请先选择树节点",function(){})
//			return 'notValidate';
//		}
		
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
			delete $list_dataParam['id'];
			$list_dataParam['longNumber'] = selectNodes[0].longNumber;
		}else{
			$list_dataParam['id'] = selectNodes[0].id;
			delete $list_dataParam['longNumber'];
		}
	}else{
		delete $list_dataParam['id'];
		delete $list_dataParam['longNumber'];
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
	var workUnit = $("#workUnit").val();
	if(workUnit==null || workUnit == ''){
		delete $list_dataParam['workUnit'];
	}else{
		$list_dataParam['workUnit'] = workUnit;
	}
	var isEnable = $("#isEnable").val();
	if(isEnable!=2){
		$list_dataParam['isEnable'] = isEnable;
	}else{
		delete $list_dataParam['isEnable'];
	}
	resetList();
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
			paramStr +='&move=1';
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

/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	if (data.status == 1) {
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/ebbase/address/onOff', {
				id : data.id,
				isEnable : 1
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} else if (data.status == 0) {
		art.dialog.confirm('确定禁用操作吗?', function() {
			$.post(getPath() + '/ebbase/address/onOff', {
				id : data.id,
				isEnable : 0
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} 

}
