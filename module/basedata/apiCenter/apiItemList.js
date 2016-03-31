$list_addUrl = getPath()+"/basedata/apiCenter/add";//新增url
$list_editUrl = getPath()+"/basedata/apiCenter/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/basedata/apiCenter/delete";//删除url
$list_editWidth = "630px";
$list_editHeight = "430px";
$list_dataType = "接口中心";
$(document).ready(
			function() {
					$("#main").ligerLayout({});
					
					$list_dataGrid = $("#tableContainer").ligerGrid(
							$.extend($list_defaultGridParam,
									{
								columns : [
								            {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender},
								            {display: '编码', name: 'number', align: 'left', width: 150},
								            {display: '名称', name: 'name', align: 'left', width: 200},
								            {display: '接口路径', name: 'apiUrl', align: 'left', width: 250},
								            {display: '接口说明', name: 'description', align: 'left', width: 350},
								            {display: '数据来源', name: 'syncType', align: 'left', width: 50,render:resourceRender}
										],
										url : getPath()+ '/basedata/apiCenter/listData?isModuleType='+isModuleType+'&moduleType='+moduleType
									}));
				});




function operateRender(data,filterData){
  var operateStr="";
  operateStr +='<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|';
  operateStr +='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
  return operateStr;
}
function resourceRender(data,filterData){
	var imgDis =   '';
	if(data.syncType=='CLOUD'){
		imgDis = '云端';
	}else{
		imgDis = '本地';
	}
	return imgDis;
}
/**
 * 禁用 / 启用
 * @param config
 * @param t
 */
function enableRowEvent(config,t){
	if(t=="禁用"){
		art.dialog.confirm('禁用会导致编号规则无效,是否继续?',function(){
			$.post(getPath() + '/basedata/code/updateStatus',config,function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					refresh();
				}
			},'json');
		});
		return;
	}
	$.post(getPath() + '/basedata/code/updateStatus',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}

/**
 * 点击新增按钮前,设置参数
 * @returns
 */
function getAddRowParam(){
	if(moduleType==""|| moduleType==null){
		artDialog.alert("请选择最小节点数。",function(){})
		return 'notValidate';
		return {moduleType:null};
	}
	return {moduleType:moduleType};
}
