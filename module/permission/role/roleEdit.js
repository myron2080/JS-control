var editGrid;
$(document).ready(function(){
	$('#main').ligerLayout({topHeight:50,allowTopResize:false});
	editGrid = $('#tableContainer').ligerGrid($.extend($edit_defaultGridParam,{
		toolbar:{
			items:[{id:'add',text:'增加',click:addPermission,icon:'add',disable:($edit_viewstate=='VIEW')},
			       {id:'delete',text:'删除',click:deletePermission,icon:'delete',disable:($edit_viewstate=='VIEW')}]
		},
		columns: [ 
	        {display: '编码', name: 'number', align: 'left', width: 200},
            {display: '名称', name: 'name', align: 'left', width: 200}
        ],
		height:320,
		url:getPath()+"/permission/role/rolePermissionData",
		parms:{role:$('#dataId').val()}
	}));
});

function addPermissionToTable(oldValue,newValue){
	if(newValue && newValue.length > 0){
		var datas = editGrid.getData();
		if(datas && datas.length > 0){
			var flag = true;
			for(var i = 0; i < newValue.length ;i++){
				flag = true;
				for(var j = 0; j < datas.length; j++){
					if(newValue[i].id==datas[j].id){
						flag = false;
						break;
					}
				}
				if(flag==true){
					editGrid.addRow(newValue[i]);
				}
			}
		}else{
			editGrid.addRows(newValue);
		}
	}
}

function addPermission(){
	openDataPicker('permission');
}

function deletePermission(){
	editGrid.deleteSelectedRow();
}

function saveEdit(){
	var datas = editGrid.getData();
	if(datas && datas.length > 0){
		var str = "";
		for(var i = 0; i < datas.length;i++){
				if(datas[i].id && datas[i].id!='undefined'){
					str += datas[i].id;
				}
				if(i != datas.length-1){
					str += ",";
				}
		}
		$('#entrys').val(str);
	}
	$("form").submit();
	return false;
}