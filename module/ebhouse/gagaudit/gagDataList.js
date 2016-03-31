$list_editUrl = getPath()+"/gagDataList/edit";
$list_addUrl = getPath()+"/gagDataList/add";
$list_deleteUrl = getPath()+"/gagDataList/delete";
$list_editWidth = "850px";
$list_editHeight = "450px";
$list_dataType = "攻略数据";//数据名称
$(document).ready(function(){
	params ={};
	params.inputTitle = "发布时间";	
	MenuManager.common.create("DateRangeMenu","dealDate",params);
	
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
	      		/*	{display: '所属区域', name: 'area.name', align: 'left', width:120},*/
	      			{display: '标题', name: 'title', align: 'left', width:200 },
	      			{display: '内容', name: 'textContent', align: 'left', width:300 },
	      			{display: '评论数', name: 'gagCount', align: 'left', width:100 },
	      			{display: '发布人', name: 'personName', align: 'left', width:100 ,render:personRender},
	      			{display: '攻略类型', name: 'gagTypeStr', align: 'left', width: 100 },
	      			{display: '发布时间', name: 'createTimeStr', align: 'left', width: 200},
	      			{display: '处理', name: '', align: 'left', width: 140,render:operationRender},
	      			{display: '操作', name: '', align: 'center', width:140,render:operateRender}
	        ],
        delayLoad:false,
        url:getPath()+'/gagDataList/listData',
        onDblClickRow:function(data){
        	//viewDetail(data.id);
        }
    }));
	searchData();
	bindEvent();
});

//
function returnTime(data){
//	alert(data.createTime);
	return data.createTimeStr;
}

function personRender(data,filterData){
	if(!isNotNull(data.personName) && !isNotNull(data.personPhone)){
		return "系统新增";
	}
	return (isNotNull(data.personName) ? data.personName : data.personPhone) ;
}

function operationRender(data,filterData){
	return   '<a href="javascript:setHot({id:\''+data.id+'\',isEssenceFlag:\'' + data.isEssenceFlag + '\'});">' + (data.isEssenceFlag == "Y" ? "取消热点" : "设为热点") + '</a>|'
	+'<a href="javascript:refreshdata({id:\''+data.id+'\'});">刷新时间</a>';
	/*return '<a href="javascript:setHot({id:\''+data.id+'\'});">a</a>';*/
}
function operateRender(data,filterData){
	return   '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>|'
			+'<a href="javascript:toAddGagData(\''+data.id+'\');">修改</a>';
}

//设置热点
function setHot(data){
	var t = (data.isEssenceFlag=='Y'? '取消热点' : '设为热点');
	art.dialog.confirm('确定'+t+'数据吗?',function(){
	$.post(getPath() + '/gagDataList/setHot',data,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
	});
}
//刷新时间
function refreshdata(data){
	art.dialog.confirm('确定刷新时间吗?',function(){
	$.post(getPath() + '/gagDataList/refreshTime',data,function(res){
	
		if(res.STATE=='SUCCESS'){
			art.dialog.tips(res.MSG);
			refresh();
		}
	},'json');
	});
}

//查看
function viewDetail(rowData){
		var	url="viewDetail?id="+rowData;
		var flag = true;
		var dlg = art.dialog.open(getPath()+"/gagDataList/"+url,
				{title:"攻略-查看",
				 lock:true,
				 width: "725px",
				 height: "500px",
				 id:$list_dataType+"-EDIT"
				});
}
/**清除查询，日期框*/
function clearSearch(){
	$("#key").val($("#key").attr("defaultValue"));
}
function bindEvent(){
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	//清空
	$("#resetBtn").click(function(){
		//MenuManager.menus["dealDate"].resetAll();
		$("#key").val($("#key").attr("defaultValue"));
	});
	eventFun($("#key"));
}
 
function eventFun(obj){
	$(obj).blur(function(){
		if(!$(obj).val() || ($(obj).val() == "")){
			$(obj).val($(obj).attr("defaultValue"));
		}
	}).focus(function(){
		if($(obj).val() && ($(obj).val() == $(obj).attr("defaultValue"))){
			$(obj).val("");
		}else {
			$(obj).select();
		}
	});
}
function searchData(){
	var key = $('#key').val();
	if(key && ($('#key').attr("defaultValue") != key)){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	if(isNotNull($('#gagType').val())){
		$list_dataParam['gagType'] = $('#gagType').val();
	}else{
		delete $list_dataParam['gagType'];
	}
	//	resetList();
	$list_dataParam['orderByClause'] = "D.FCREATETIME desc";
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["dealDate"]){
		queryStartDate = MenuManager.menus["dealDate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["dealDate"].getValue().timeEndValue;
	}
	
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
	
	//关键字条件 [发布人/标题/内容/]
	var keyConditions = $('#key').val();
	if(keyConditions && ($('#key').attr("defaultValue") != key)){
		$list_dataParam['key'] = keyConditions;
	}else{
		delete $list_dataParam['key'];
	}
	 
	resetList();
}


//查看
function toAddGagData(id){
	var title = "攻略-新增";
		if(isNotNull(id)){
			title = "攻略-修改"
		}
		var flag = true;
		var dlg =art.dialog.open($list_addUrl+ "?id=" +id,
				{
					
					title:title,
					 lock:true,
					 width: $list_editWidth,
					 height: "500px",
					 id:$list_dataType+"-EDIT",
					lock : true,
					button : [ {
						className : 'aui_state_highlight',
						name : '保存',
						callback : function() {
							if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
								dlg.iframe.contentWindow.save(dlg);
								searchData();
							}
							return false;
						}
					} , {
						name : '取消',
						callback : function() {
						}   
					}],
					close:function(){					
						searchData();
					 }
				});	
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 
