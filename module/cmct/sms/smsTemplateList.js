$list_editUrl = getPath()+"/cmct/smsTemplate/edit";//编辑及查看url
$list_addUrl = getPath()+"/cmct/smsTemplate/add";//新增url
$list_deleteUrl = getPath()+"/cmct/smsTemplate/delete";//删除url
$list_editWidth = "550px";
$list_editHeight = "200px";
$list_dataType = "短信模板";//数据名称
$(document).ready(function(){
	
	$("#toolBar").ligerToolBar({
		  items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
	});
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '模板编码', name: 'number', align: 'left', width: 120,height:40},
		            {display: '模板内容', name: 'smsContent', align: 'left', width: 320,height:40},
		            {display: '状态', name: 'templateStatus.name', align: 'left', width: 80,height:40},
		            {display: '操作', name: '', align: 'center', width: 160,render:operateRender}
		        ],
        delayLoad:false,
        url:getPath()+'/cmct/smsTemplate/listData'
    }));
});

function operateRender(data,filterData){
	var str='';
	var flag=data.templateStatus.value;
	if(flag=='ENABLED'){
		str+='<a href="javascript:updateFlag({id:\''+data.id+'\',flag:\''+flag+'\'});">禁用</a>|';
	}
	if(flag=='DISABLE'){
		str+='<a href="javascript:updateFlag({id:\''+data.id+'\',flag:\''+flag+'\'});">启用</a>|';
	}
	str+='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>|';
	str+='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	return str;
}

function updateFlag(rowData){
	var url=getPath()+"/cmct/smsTemplate/updateFlag";
	var flag=rowData.flag;
	var str='';
	if(flag=='ENABLED'){
		str='禁用';
	}
	if(flag=='DISABLE'){
		str='启用';
	}
		art.dialog.confirm('确定'+str+'该行数据?',function(){
			$.post(url,{id:rowData.id},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					refresh();
				}
			},'json');
			return true;
		},function(){
			return true;
		});
}
