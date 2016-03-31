$list_deleteUrl = getPath()+"/basedata/info/delete";//删除url
$(document).ready(function(){
	params ={};
	params.inputTitle = "消息日期";
	MenuManager.common.create("DateRangeMenu","createtTime",params);
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
	    columns: [ 
	              {display: '操作', name: 'operate', align: 'center', width: 80,render:operateRender},
                  {display: '类型', name: 'typeStr', align: 'center', width: 100,isSort: false},
	              {display: '消息日期', name: 'createDate', align: 'center', width: 150,isSort: true},
	              {display: '消息接收人', name: 'person.name', align: 'center', width: 100,isSort: false},
	              {display: '是否已读', name: 'isRead', align: 'center', width: 100,isSort: false,render:isRead},
	              {display: '是否弹窗', name: 'remindType', align: 'center', width: 100,isSort: false,render:remindType},
	              {display: '内容', name: 'content', align: 'center', width: 250,render:contentRender,isSort: false},               
	          ],
	    checkbox:false,
	    fixedCellHeight:false,
	    delayLoad:true,
	    enabledSort:true,
	    url:getPath()+'/basedata/info/listData'
			
	}));
	searchData();
})
function isRead(data,filterData){
	var e = (data.isRead==1?0:1);
	var t = (data.isRead==1?'未读':'已读');
	var desc;
	
	var desc;
	if(data.isRead==1){
		desc="已读";
	}else{
		desc="未读"+'&nbsp;<a href="javascript:isReadRow({id:\''+data.id+'\',isRead:\''+e+'\'});">'+t+'</a>';
	}
	return desc;
}
/**
 * 已读 / 未读
 * @param config
 * @param t
 */
function isReadRow(config){
	var t = (config.isRead==0?'未读':'已读');
	art.dialog.confirm('确定为'+t+'数据吗?',function(){
	$.post(getPath() + '/basedata/info/isRead',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
	});
}
function  remindType(data,filterData){
	var desc;
	if(data.remindType=='FLOAT_BOX_ED'){
		desc="已弹窗";
	}else if(data.remindType=='FLOAT_BOX'){
		desc="未弹窗";
	}else{
		desc="不提示";
	}
	return desc;
}
function contentRender(data,filterData){
	return convertImg(data.content);
}
function operateRender(data,filterData){
	return  '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}
//批量标已读
function batchIsReadBtn(){
	
	var dlg = art.dialog.open(getPath()+'/basedata/info/batchReadedList',{
		 title:'批量标已读',
		 lock:true,
		 width:'250px',
		 height:'150px',
		 id:"batchIsReadDiv",
		 button:[{name:'确定',callback:function(){
			 dlg.iframe.contentWindow.batchReaded(dlg);
			 return false;
		 }},{name:'取消'}]
		});
}
//查询
function searchData(){
	var receiver = $("#receiver").val();
	if(receiver!='消息接收人' && receiver!=''){
		$list_dataParam['receiver']=$("#receiver").val();
	}
	var type=$("#type").val();
	if(type!=""){
		$list_dataParam['type']=$("#type").val();
	}
	var isRead=$("#isRead").val();
	if(isRead!=""){
		$list_dataParam['isRead']=$("#isRead").val();
	}
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['searchKeyWord'];
	}else{
		$list_dataParam['searchKeyWord'] = kw;
	}
	
	var queryStartDate = "";
	var queryEndDate = "";
	var queryDate = "";
	if(MenuManager.menus["createtTime"]){
		queryStartDate = MenuManager.menus["createtTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createtTime"].getValue().timeEndValue;
	}
	if(queryStartDate == queryEndDate && queryEndDate != ""){
		$list_dataParam['queryDate'] = queryStartDate;
	}else{
		//查询开始时间
		if(queryStartDate != ""){
			$list_dataParam['queryStartDate'] = queryStartDate;
		} else {
			delete $list_dataParam['queryStartDate'];
		}
		//查询结束时间
		if(queryEndDate != ""){
			$list_dataParam['queryEndDate'] = queryEndDate;
		} else {
			delete $list_dataParam['queryEndDate'];
		}
		delete $list_dataParam['queryDate'];
	}
	resetList();
}
	
function clearAll(){
	$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
	$('#type').find("option").first().attr("selected","true");
	MenuManager.common.resetAll();
}

function getHouseName(oldObj,newObj,doc){

}





