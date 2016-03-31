$list_editUrl = getPath() + '/ebsite/startupparam/edit';// 编辑及查看url
$list_deleteUrl = getPath() + "/ebsite/startupparam/delete";// 删除url
$list_addUrl = getPath() + '/ebsite/startupparam/add';// 新增url
$list_editWidth = "600px";
$list_editHeight = "150px";
$list_dataType = "启动页配置";// 数据名称
$(document).ready(
		function() {
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [{
							display : '版本',
							name : 'deviceVision',
							align : 'center',
							width : 120
						}, {
							display : '设备名称',
							name : 'deviceName',
							align : 'center',
							width :120
						}, {
							display : '尺寸(PX)',
							name : '',
							align : 'center',
							width : 120,
							render : widthAndHight
						}, {
							display : '最大容量',
							name : 'devicePicSize',
							align : 'center',
							width : 120
						},{
							display : '操作',
							name : '',
							align : 'center',
							width : 120,
							render : operateRender
						}],
					    checkbox:true,
						url : getPath() + '/ebsite/startupparam/listData'
				}));
		});
//宽度加高度
function widthAndHight(data){
	return data.deviceSize+"*"+data.deviceSize2;
}


//禁用启用  效果
function operateRender(data) {
	var str="";
		if(data.status == 1){
			str += '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\',deviceVision:\'' + data.deviceVision + '\'});">禁用</a> | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a> | '
		} else if(data.status == 0){
			str += '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\',deviceVision:\'' + data.deviceVision + '\'});">启用</a> | <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a> | '
		}
		str +='<a href="javascript:deleteParamsById({id:\''+ data.id + '\'});">删除</a>';
	 return str;
}
//删除功能
function deleteParamsById(data){
	art.dialog.confirm('你确定要删除这条数据吗？',function(){
		$.post(getPath() + '/ebsite/startupparam/deleteParamsById',{"id":data.id},function(res){
			art.dialog.tips(res.MSG);
			if (res.STATE == 'SUCCESS') {
				refresh();
			}
		},'json');
	});
	
}
//禁用启用功能
function onOff(data,type,version){
	var isEnable=0;
	var msg="";
	if (data.status == 1) {
		isEnable=1;
		msg="确定启用操作吗?";
	}else if(data.status == 0){
		msg="确定禁用操作吗?";
	}
	art.dialog.confirm(msg, function() {
		$.post(getPath() + '/ebsite/startupparam/updateStatus', {"id":data.id,"isEnable":isEnable,"version":data.deviceVision}, function(res) {
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
//批量删除
function deleteParams(){
	var rows = $list_dataGrid.getSelectedRows();
	if(rows.length>0){
		for(var i = 0; i < rows.length; i++){
			if(!rows[i].id){
				art.dialog.tips('请选择已授权的行');
				return;
			}
		}
		art.dialog.confirm('确定删除这些数据吗?',function(){
			var ids = '';
			for(var i = 0; i < rows.length; i++){
				ids += rows[i].id;
				if(i < rows.length - 1){
					ids += ';';
				}
			}
			$.post(getPath()+'/ebsite/startupparam/updateStatusBatch',{ids:ids},function(res){
				art.dialog.tips(res.MSG);
				refresh();
			},'json');
		});
	}else{
		art.dialog.tips('请先选择需要删除的行');
	}
}



		
