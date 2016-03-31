$list_deleteUrl = getPath()+"/permission/personPermission/delete";//删除url
var leftGrid;
var $leftGrid_param = {};
$(document).ready(function(){
	$("#main").ligerLayout({topHeight:24,leftWidth:280,allowLeftCollapse:false,allowLeftResize:false,allowRightResize:false});
	$("#leftToolBar").ligerToolBar({
		items:[]
		});
	$("#leftToolBar").append(
		'<div style="float:right;padding-right:5px;display:inline;">'
    	+'	<form onsubmit="searchLeftData();return false;">'	
	    +'		<input type="text" name="leftSearchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="权限名称/编码" defaultValue="权限名称/编码" value="权限名称/编码" id="leftSearchKeyWord" class="input"/>'
	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchLeftData();return false;">查询</span></a>'
    	+'	</form>'
    	+'</div>'
	);
	/*$("#toolBar").ligerToolBar({
		items:[
		      {id:'add',text:'增加',click:addPermission,icon:'add'},
		      {id:'delete',text:'删除',click:deletePermission,icon:'delete'}
		    ]
		});*/
//	$("#toolBar").append(
//		'<div style="float:right;padding-right:10px;display:inline;">'
//    	+'	<form onsubmit="searchData();return false;">'	
//	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="权限名称" defaultValue="权限名称" value="权限名称" id="searchKeyWord" class="input"/>'
//	    +'		<a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>'
//    	+'	</form>'
//    	+'</div>'
//	);
	var ppid = $('#personPosition').val();
	leftGrid = $("#leftGridContainer").ligerGrid($.extend({},$list_defaultGridParam,{
	      columns: [ 
	             /* {display: '类型', name: 'permissionItem.group.name', align: 'left', width: 80},*/
		          {display: '名称', name: 'permissionItem.name', align: 'left', width: 80},
		          {display: '描述', name: 'permissionItem.description', align: 'left', width: 100}
	          ],
          url:getPath()+'/permission/personPermission/jobPermission',
          parms:{personPosition:ppid}
    }));
	$leftGrid_param['personPosition'] = ppid;
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            /*{display: '类型', name: 'permissionItem.group.name', align: 'left', width: 80},*/
            {display: '名称', name: 'permissionItem.name', align: 'left', width: 80},
            {display: '描述', name: 'permissionItem.description', align: 'left', width: 100},
            {display: '操作', name: 'operate', align: 'center', width: 40,render:operateRender}
        ],
        checkbox:true,
        url:getPath()+'/permission/personPermission/personPermission',
        parms:{personPosition:ppid}
    }));
	$list_dataParam['personPosition'] = ppid;
});

function addPermission(){
	openDataPicker('permissionItem');
}

function selectPermission(oldValue,newValue,doc){
	if(newValue && newValue.length > 0){
		var ps = '';
		for(var i = 0; i < newValue.length; i++){
			ps += newValue[i].id;
			if(i < newValue.length - 1){
				ps += ';';
			}
		}
		$.post(getPath()+'/permission/personPermission/savePersonPermission',{permissions:ps,personPosition:$('#personPosition').val()},function(res){
			art.dialog.tips(res.MSG);
			refresh();
		},'json');
	}
}

function deletePermission(){
	var rows = $list_dataGrid.getSelectedRows();
	if(rows.length>0){
		art.dialog.confirm('确定删除这些数据吗?',function(){
			var ids = '';
			for(var i = 0; i < rows.length; i++){
				ids += rows[i].id;
				if(i < rows.length - 1){
					ids += ';';
				}
			}
			$.post(getPath()+'/permission/personPermission/deleteBatch',{ids:ids},function(res){
				art.dialog.tips(res.MSG);
				refresh();
			},'json');
		});
	}else{
		art.dialog.tips('请先选择需要删除的行');
	}
}

function nameRender(data){
	return data.person.name + '('+data.person.number + ')';
}

function operateRender(data,filterData){
	if(data.type=='person'){
		return '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	}
	return '';
}

function searchLeftData(){
	var kw = $('#leftSearchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#leftSearchKeyWord').val(kw);
	if(kw==$('#leftSearchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $leftGrid_param['key'];
	}else{
		$leftGrid_param['key'] = kw;
	}
	leftGrid.setOptions({
		parms:$leftGrid_param
	});
	leftGrid.loadData();
	leftGrid.changePage('first');
}
function searchData(){
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
	resetList();
}