$list_viewUrl = getPath()+'/bage/systemmsg/list';
$list_editUrl = getPath()+'/bage/systemmsg/edit';
$list_addUrl = getPath()+'/bage/systemmsg/add';
$list_deleteUrl = getPath()+'/bage/systemmsg/delete';
$list_editWidth = "780px";
$list_editHeight = "450px";
$list_dataType = "系统通知";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: '120',render:operateRender},
            {display: '标题', name: 'title', align: 'left', width:'80'},
			{display: '查看范围', name: 'receiveObject.name', align: 'left', width:'80',render:function(data){
				var str = '';
				if(data.receiveObject.value=="COMPANY"){
				str='<a href="javascript:systemItemListView({id:\''+data.id+'\'});">'+data.receiveCompany.name+'</a>';
				}else{
				str='<a href="javascript:systemItemListView({id:\''+data.id+'\'});">'+data.receiveObject.name+'</a>';	
				}
				return str;
			}},
			{display: '发布人', name: 'publisher.name', align: 'left', width:'150'},
			{display: '发布时间', name: 'publishTime', align: 'left', width:'100'},
			{display: '创建时间', name: 'createTime', align: 'left', width:'100'},
			{display: '状态', name: 'publishStatus.name', align: 'left', width:'100'}
        ],
        url:getPath()+"/bage/systemmsg/listData"
    }));
	//绑定事件
	var params ={};
	params.width = 260;
	params.inputTitle = "发布时间";	
	MenuManager.common.create("DateRangeMenu","publishTime",params);
	
	$("#search").click(function(){
		selectList();
	});
	
	//清除
	$("#clearData").click(function(){
		MenuManager.menus["publishTime"].resetAll();
		delete $list_dataParam['keyWord'];	
		$("#keyWord").attr("value", "标题/发布人");
	});
	
	//回车操作
	inputEnterSearch("keyWord",selectList);

	
	//新增
	$("#add").click(function(){
		beforeAddRow();
	});
});

function beforeAddRow(){
	addRow({});
}
function formarPhone(phone){
	return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	//发布时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["publishTime"]){
		queryStartDate = MenuManager.menus["publishTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["publishTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	var keyWord= $("#keyWord").val();
	if(isNotNull(keyWord) && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	//debugger;
	resetList();
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	var str='';
	if(data.publishStatus.value=="SAVE"){
		str+='<a href="javascript:publish({id:\''+data.id+'\',publishStatus:\'PUBLISH\'});">发布</a>';	
		str+='<a href="javascript:editRow({id:\''+data.id+'\'});"> |修改 |</a>';
		str+='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	}
	return str;	
}

function publish(config){
	art.dialog.confirm('确定要进行该操作吗?',function(){
	$.post(getPath()+'/bage/systemmsg/publish',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
	});
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
				 button:[{name:'发布并保存',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAddForm){
							dlg.iframe.contentWindow.saveAddForm(this,"PUBLISHANDSAVE");
						}
						return false;
					}},{name:'保存',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAddForm){
							dlg.iframe.contentWindow.saveAddForm(this,"SAVE");
						}
						return false;
					}},{name:'取消',callback:function(){
						//dlg.iframe.contentWindow.saveAdd(this,"CANCEL");
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
function editRow(rowData){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('EDIT'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-EDIT",
				 button:[
				         /*{name:'保存并发布',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAddForm){
							dlg.iframe.contentWindow.saveAddForm(this,"PUBLISHANDSAVE");
						}
						return false;
					}},*/{name:'保存',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAddForm){
							dlg.iframe.contentWindow.saveAddForm(this,"SAVE");
						}
						return false;
					}},{name:'取消',callback:function(){
						//dlg.iframe.contentWindow.saveAdd(this,"CANCEL");
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
				});
	}
}
function systemItemListView(data){
	var u = getPath()+"/bage/systemmsg/msgItemListView";
	var paramStr = '?id='+data.id;
	var flag = true;
	var dlg = art.dialog.open(u+paramStr,
		{title:"接收人列表",
		 lock:true,
		 width:'650px',
		 height:'500px',
		 id:"USER-FRIEND-LIST",
		 button:[{name:'关闭',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
		 }
		});
}
/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}

