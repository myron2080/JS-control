$list_editUrl = getPath()+"/projectm/pmDefinePackage/edit";
$list_addUrl = getPath()+"/projectm/pmDefinePackage/add";
$list_deleteUrl = getPath()+"/projectm/pmDefinePackage/delete";
$list_editWidth = "280px";
$list_editHeight = "300px";
$list_dataType = "套餐";//数据名称
$(document).ready(function(){
	$("#toolBar").ligerToolBar({
		  items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
	});
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '套餐名称', name: 'name', align: 'left', width: 120,height:40},
		            {display: '套餐模式', name: 'packageEnum.name', align: 'left', width: 80,height:40},
		            {display: '套餐金额', name: 'packageCost', align: 'left', width: 80,height:40},
		            {display: '包含分钟数', name: 'containsMinutes', align: 'center', width: 80,height:40},
		            {display: '月租费', name: 'monthlyRent', align: 'left', width: 60,height:40},
		            {display: '市话资费', name: 'localCharges', align: 'left', width: 60,height:40},
		            {display: '国内长途资费', name: 'longCharges', align: 'left', width: 80,height:40},
		            {display: '国际长途', name: 'internationCharges', align: 'left', width: 60,height:40},
		            {display: '状态', name: 'flag.name', align: 'center', width: 80,height:40},
		            {display: '操作', name: '', align: 'center', width: 160,render:operateRender}
		        ],
        delayLoad:false,
        url:getPath()+'/projectm/pmDefinePackage/listData',
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	okSelect();
	    }
    }));
});

function okSelect(){
	var selects = $list_dataGrid.getSelected();
	if(selects.flag.value=='DISABLED'){
		art.dialog.tips('禁用的不能选择');
		return false;
	}
	if(selects==null || selects.length==0){
		artDialog.alert('请选择数据');
	}else{
		artDialog.open.origin[art.dialog.data("returnFunName")].call(null, selects);
		art.dialog.close();
	}
}

function operateRender(data,filterData){
	var str='';
	var flag=data.flag.value;
	if(flag=='ENABLE'){
		str+='<a href="javascript:updateFlag({id:\''+data.id+'\',flag:\''+flag+'\'});">禁用</a>|';
	}
	if(flag=='DISABLED'){
		str+='<a href="javascript:updateFlag({id:\''+data.id+'\',flag:\''+flag+'\'});">启用</a>|';
	}
	str+='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
	return str;
}

function updateFlag(data){
	$.post(getPath()+"/projectm/pmDefinePackage/enable",data,function(res){
		if(res.STATE=="SUCCESS"){
			refresh();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}