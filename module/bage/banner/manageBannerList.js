/**
 * 项目列表
 */
$list_viewUrl = getPath()+'/bage/banner/list';
$list_editUrl = getPath()+'/bage/banner/edit';
$list_addUrl = getPath()+'/bage/banner/add';
$list_deleteUrl = getPath()+'/bage/banner/delete';
$list_saveUrl = getPath()+'bage/banner/save';
$list_editWidth = "680px";
$list_editHeight = "500px";
$list_dataType = "banner";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [
            {display: '操作', name: 'operate', align: 'center', width: 150,render:operateRender},
            {display: '名称', name: 'title', align: 'center', width:100},
			{display: '路径', name: 'path', align: 'center', width:100},
			{display: '预览图', name: 'pic', align: 'center', width:100,render:Picrender},
			{display: '尺寸', name: 'company.name', align: 'center', width:100,render:sizeRender},
			{display: '维护时间', name: 'lastUpdateTime', align: 'center', width:180},
			{display: '维护人', name: 'creator.name', align: 'center', width:100},
			{display: '轮播顺序', name: 'index', align: 'center', width:100},
			{display: '状态', name: 'status', align: 'center', width:150,render:statusRender},
			{display: '跳转方式', name: 'skipType', align: 'center', width:100,render:skipTypeRender},
			{display: '跳转链接', name: 'skipLink', align: 'center', width:200},
			{display: '描述', name: 'description', align: 'center', width:150}
      			
        ],
        url:getPath()+"/bage/banner/listData",
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	viewRow(rowData);
        }
    }));
	//绑定事件
	$("#selectData").click(function(){
		selectList();
	});
	
	inputEnterSearch("keyWord",selectList);
	
	var params ={};
	params.width = 260;
	params.inputTitle = "维护时间";	
	MenuManager.common.create("DateRangeMenu","updateDate",params);


	$("#serchBtn").click(function(){
		selectList();
	});
	

	
	//新增
	$("#add").click(function(){
		beforeAddRow();
	});
});

function beforeAddRow(){
	addRow({});
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	
	//注册时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["updateDate"]){
		queryStartDate = MenuManager.menus["updateDate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["updateDate"].getValue().timeEndValue;
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
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	var status =   $("#status").val();
		if(status){
			$list_dataParam['status'] = status;
		} else{
			delete $list_dataParam['status'];
		}
	resetList();
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	var status = data.status;
	var str='';
	if(status =="UNPUBLISH"){
		str+='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a> | ';
		str+='<a href="javascript:changePublishStatus({id:\''+data.id+'\',status:\'PUBLISHED\'});">发布</a>';
	}else if(status =="PUBLISHED"){
		str+='<a href="javascript:changePublishStatus({id:\''+data.id+'\',status:\'REJECTED\'});">撤回</a>';
	}else if(status =="REJECTED"){
		str+='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a> | ';
		str+='<a href="javascript:changePublishStatus({id:\''+data.id+'\',status:\'PUBLISHED\'});">重新发布</a>';
	}
	str+=' | <a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	return str;	
}

function sizeRender(data){
	var size = data.size;
	if(size=="SIZE380X300"){
		return "380*300";
	}else if(size=="SIZE400X260"){
		return "400*260";
	}
}
function Picrender(data){
	var src = data.path;
	var src_temp = (src?src.replace("size","900X300"):"")
	var path = base+'/images/'+src_temp;
	return "<img onerror=this.src='"+base+"/default/style/images/defaultimage/noimg_S.png' src='"+path+"' width='60px' height='20px' >";
	
}
function statusRender(data){
	var status = data.status;
	if(status=="UNPUBLISH"){
		return "未发布";
	}else if(status=="PUBLISHED"){
		return "已发布";
	}else if(status=="REJECTED"){
		return "已撤回";
	}
}

function skipTypeRender(data){
	var type = data.skipType;
	if(type=="LINK"){
		return "链接跳转";
	}else if(type=="PROTOSOMATIC"){
		return "原生态跳转";
	}
}

function changePublishStatus(data){
	var dia;
	$.post(getPath()+"/bage/banner/updateStatus",data,function(){
		if(data.status=="PUBLISHED"){
			dia = art.dialog.tips("发布成功");
		}else if(data.status=="REJECTED"){
			dia = art.dialog.tips("撤回成功");
		}else if(data.status=="UNPUBLISH"){
			dia = art.dialog.tips("重新发布成功");
		}
		selectList();
	})
	
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

//增加行
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
				 button:[{name:'保存',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this);
						}
						return false;
					}},{name:'保存并发布',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.savePub){
							dlg.iframe.contentWindow.savePub(this);
						}
						return false;
					}},{name:'取消',callback:function(){
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



//查看行
function viewRow(rowData){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+rowData.id;
		}
		
		art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:$list_dataType+'-VIEW',
				button:[{name:'关闭'}]}
		);
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
					 button:[{name:'保存',callback:function(){
							if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
								dlg.iframe.contentWindow.saveEdit(this);
							}
							return false;
						}},{name:'保存并发布',callback:function(){
							if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.savePub){
								dlg.iframe.contentWindow.savePub(this);
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
					});
		}
	}