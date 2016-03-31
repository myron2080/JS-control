$list_editWidth = 570;
$list_editHeight = 230;
$list_dataType = "电话" ;
var map={RADIO:'无线电话',PHONE:'手机',TEL:'固定电话',SHAR:'共享',PERSONAL:'专用'};
$(document).ready(function(){
	params ={};
	params.width = 260;
	params.inputTitle = "开通日期";
	MenuManager.common.create("DateRangeMenu","openDate",params);
	
	$("#key").focus(function(){
		if($(this).val()=="号码/分配号码/mac地址"){
			$(this).val("");
		}
	}).blur(function(){
		if($(this).val()==""){
			$(this).val("号码/分配号码/mac地址");
		}
	});
	
	//注册控件key的回车查询事件
	inputEnterSearch('key',searchData);
	
	/**
	 * 设置默认值
	 */
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	var columnsParam=[ 
                    {display: '操作', name: '', align: 'center', width: 120,render:editMethod, isSort:false},
	                {display: '注册号码', name: 'loginNumber', align: 'center',  width: 120, isSort:false},
	                {display: '分配固定号码', name: 'showPhone', align: 'center', width: 120, isSort:false},
	                {display: '使用模式', name: 'useType', align: 'center', width: 120,render:getName, isSort:false},
		            {display: '当前套餐', name: '', align: 'center',  width: 150, isSort:false},
	                  ];
    
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        width:"99%",
        enabledSort:true,
        parms:{orgId:$("#orgId").val()},
        url:getPath() + '/cmct/phoneComboManage/listData'
    }));
});

function editMethod(data){
	return '<a href="javascript:comboManage({id:\''+data.id+'\'});">套餐管理</a>'
}

function comboManage(data){
	art.dialog.tips('该功能暂未开放');
	/*var url="";
	var flag = true;
	var dlg = art.dialog.open(url,
			{title:"套餐管理",
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
				
				 if(flag){
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
			});*/
}
function getName(record, rowindex, value, column){
	return map[value];
}

function searchData(){
	var key=$("#key").val();
	if(key == '号码/分配号码/mac地址'){
		key='';
	}
	$list_dataParam['key'] = key;
	$list_dataParam['state'] = $("#state").val();
	$list_dataParam['orgId'] = $("#orgId").val();
	resetList();
}
