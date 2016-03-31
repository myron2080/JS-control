$list_editUrl = getPath()+"/ebbase/address/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebbase/address/add";//新增url
$list_deleteUrl = getPath()+"/ebbase/address/delete";//删除url
$list_editWidth = "500px";
$list_editHeight="550px";
$list_dataType = "地址管理";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/ebbase/address/simpleTreeData";
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($list_editHeight-45);
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
	        {display: '状态', name: 'operate', align: 'center', width: 130,render : operateRender},
            {display: '地址', name: 'fullName', align: 'left', width: 500}//,render : addressun
        ],
        height:'95%',
        fixedCellHeight:false,
        url:getPath()+'/ebbase/address/listStorageData',
		checkbox:true,
        delayLoad:true
    }));
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


function deleteAddress(dlg){
	currentDialog = dlg;
	var rows = $list_dataGrid.getSelectedRows();
	if(rows.length>0){
		var ids = '';
		for(var i = 0; i < rows.length; i++){
			ids += rows[i].id;
			if(i < rows.length - 1){
				ids += ';';
			}
		}
		$.post(getPath()+'/storage/storageInAddress/removeAddressByNumber',{ids:ids,storageId:id},function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						content: res.MSG,
						time:1,
						close:function(){
							art.dialog.close();
						},
						width:200
					});
				}else{
					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');

		if(currentDialog){
			currentDialog.button({name:"确定绑定",disabled:true});
			currentDialog.button({name:"取消绑定",disabled:true});
		}
	}else{
		art.dialog.tips('请先选择需要删除的地址');
	}

}
function saveEdit(dlg){

	currentDialog = dlg;
	var selectNodes = $list_dataGrid.getSelectedRows();
	if(selectNodes && selectNodes.length > 0){
		var ids = '';
		for(var i = 0; i <selectNodes.length; i++){
			ids += selectNodes[i].id;
			if(i < selectNodes.length - 1){
				ids += ';';
			}
		}
		$.post(base +'/storage/storageInAddress/saveAddressByNumber',
				{ids:ids,storageId:id},function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						content: res.MSG,
						time:1,
						close:function(){
							art.dialog.close();
						},
						width:200
					});
				}else{
					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');
		if(currentDialog){
			currentDialog.button({name:"确定绑定",disabled:true});
			currentDialog.button({name:"取消绑定",disabled:true});
		}
		return false;
    }
}

function operateRender(data) {
	 var res ='';
	if(data.storageInAddressId==null || data.storageInAddressId==""){
		res="未绑定";
	}
	else if(id==data.storageInAddressId){

		res="<font color='red'>本分店绑定</font>";
	}
	else{

		res="<font color='red'>已绑定</font>";
	}
	return res;
}
function addressun(data){
	var str='';
	if(data.name4!="" && data.name4!=null){
		str+=data.name4;
	}
	if(data.name3!="" && data.name3!=null){
		str+=data.name3;
	}
	if(data.name2!="" && data.name2!=null){
		str+=data.name2;
	}
	if(data.name1!="" && data.name1!=null){
		str+=data.name1;
	}
	if(data.parent!=null){


		if(data.parent.name!="" && data.parent.name!=null){
			str+=data.parent.name;
		}
	}
	if(data.name!="" && data.name!=null){
		str+=data.name;
	}
	return str;
}

function onEmpty() {
	delete $list_dataParam['key'];
	delete $list_dataParam['startagestart'];
	$("#startagestart option:first").prop("selected", 'selected');
	$("#searchKeyWord").attr("value", $("#searchKeyWord").attr("defaultValue"));
	resetList();
}
function reflushTime(objId){ //更新最后更新时间
	$.post(getPath()+'/ebbase/address/reflushTime',{id:objId},function(res){
		searchData();
	},'json');
}
function editRowData(data){
	$list_editUrl = getPath()+"/ebbase/address/edit";
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
	if(selectNodes.length>0){/*
		if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){*/
			delete $list_dataParam['id'];
			$list_dataParam['longNumber'] = selectNodes[0].longNumber;
		/*}else{
			$list_dataParam['id'] = selectNodes[0].id;
			delete $list_dataParam['longNumber'];
		}*/
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
	var workUnit = $("#startagestart").val();
	if(workUnit==null || workUnit == ''){
		delete $list_dataParam['startagestart'];
	}else{
		$list_dataParam['startagestart'] = workUnit;
		console.log("t");
		if(workUnit==3){

			$list_dataParam['bfstorageid'] = id;
		}
	}
	resetList();
}


