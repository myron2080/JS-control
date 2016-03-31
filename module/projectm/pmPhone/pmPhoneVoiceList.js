$list_editUrl = getPath()+"/projectm/pmPhoneVoice/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/pmPhoneVoice/add";//新增url
$list_deleteUrl = getPath()+"/projectm/pmPhoneVoice/delete";//删除url
$list_editWidth = "480px";
$list_editHeight = "195px";
$list_dataType = "语音";
$(document).ready(function(){
	$("#toolBar").ligerToolBar({
		  items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
	});
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '本地名称', name: 'name', align: 'center', width: 120,height:40},
		            {display: '接口名称', name: 'simplePinyin', align: 'center', width: 180,height:40},
		            {display: '核算渠道', name: 'pmPhoneConfig.configName', align: 'center', width: 100,height:40},
		            {display: '上传时间', name: 'createTime', align: 'center', width: 80,height:40},
		            {display: '上传人', name: 'creator.name', align: 'center', width: 80,height:40},
		            {display: '备注', name: 'description', align: 'center', width: 80,height:40},
		            {display: '操作', name: '', align: 'center', width: 140,render:operateRender}
		        ],
        delayLoad:false,
        parms:$list_dataParam,
        url:getPath()+'/projectm/pmPhoneVoice/listData'
    }));
});

function operateRender(data,filterData){
	var str="";
	str+='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>|';
	str+='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	return str;
}

function addRow(source){
	if($list_addUrl && $list_addUrl!=''){
		var paramStr = '';
		if($list_addUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=ADD';
		}else{
			paramStr = '?VIEWSTATE=ADD';
		}
		if(typeof(getAddRowParam) == "function"){
			var param = getAddRowParam();
			//临时增加不满足则不打开窗口
			if(param=='notValidate') return;
			if(param){
				for(var p in param){
					paramStr = paramStr + '&' + p + '=' + param[p];
				}
			}
		}
		var flag = true;
		var dlg = art.dialog.open($list_addUrl+paramStr,
				{title:getTitle('ADD'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-ADD",
				 button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this);
						}
						return false;
					}},{name:'取消',callback:function(){
						resetList();
						flag = false;
						return true;
					}}],
				 close:function(){
					 if(flag){
						 if(typeof(afterAddRow)=='function'){
							 afterAddRow();
						 }
						 resetList();
					 }
				 }
				});
	}
}