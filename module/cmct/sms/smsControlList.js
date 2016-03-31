$list_editUrl = getPath()+"/cmct/smsControl/editPersonalControl";//编辑及查看url
$list_addUrl = getPath()+"/cmct/smsControl/add";//新增url
$list_deleteUrl = getPath()+"/cmct/smsControl/delete";//删除url
$list_editWidth = 450;
$list_editHeight = 140;

$list_dataType = "短信控制";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/cmct/smsControl/treeDataAll";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	 
	initDelayTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '工号', name: 'objectNumber', align: 'left', width: 80},
            {display: '姓名', name: 'objectName', align: 'left', width: 80},
            {display: '状态', name: '', align: 'left', width: 60,render:showState},
            {display: '上限控制', name: 'topLimitAmount', align: 'left', width: 120,render:topLimitAmountRender},
            {display: '余额控制', name: 'balanceAmout', align: 'left', width: 130,render:balanceAmoutRender},
            {display: '操作', name: 'operate', align: 'center', width: 200,render:operateRender}
        ],
        url:getPath()+'/cmct/smsControl/listData',
        delayLoad:true,
        height:"96%",
        usePager:true,
        enabledSort:false
    }));
	
	bindEvent(); 
	searchData();
});

 

function bindEvent(){
	
	//新增
	$("#toAddBtn").bind("click",addRow);
	$("#toConfigBtn").bind("click",toConfigBtn);
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	
	//清空
	$("#resetBtn").click(function(){
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
	});
	
	eventFun($("#searchKeyWord"));
	inputEnterSearch('searchKeyWord',searchData);
}

function showState(data){
	if(data.id){
		 return "开通";
	 }else{
		 return "未开通";
	 }
}

function topLimitAmountRender(data){
	 var str = "无控制";
	 if(!data.id){
		 str = "";
		 return str;
	 }
	 if(data.limitStrategyFlag && data.limitStrategyType){
		 str = data.limitStrategyType.name + data.topLimitAmount+"条";
	 } 
	return  str;
}

function balanceAmoutRender(data){
	 var str = "无控制";
	 if(!data.id){
		 str = "";
		 return str;
	 }
	 if(data.balanceStrategyFlag){
		 str =  data.balanceAmout+"条  ";
		
		 str += ' <a href="javascript:changeBalance({controlId:\''+data.id+'\',operationtype:\'CHARGE_TYPE\'});">充值</a>';
		 str += ' |<a href="javascript:changeBalance({controlId:\''+data.id+'\',operationtype:\'DEDUCTION_TYPE\'});">扣减</a>';
	 }
	return  str;
}

function operateRender(data){
	 var str = '<a href="javascript:editRow({id:\''+data.id+'\',objectId:\''+data.objectId+'\',objectNumber:\''+data.objectNumber+'\',objectName:\''+data.objectName+'\'});">开通</a>';
	 if(!data.id){
		 str += ' |<a href="javascript:viewSMSControlHistory({objectId:\''+data.objectId+'\'});">查看历史</a>';
		 return str;
	 }
	 str = '<a href="javascript:editRow({id:\''+data.id+'\',objectId:\''+data.objectId+'\',objectNumber:\''+data.objectNumber+'\',objectName:\''+data.objectName+'\'});">设置</a>';
	 str += ' |<a href="javascript:deleteRow({id:\''+data.id+'\',balanceAmout:\''+data.balanceAmout+'\'});" class="delete_font">关闭</a>';
	 str += ' |<a href="javascript:viewSMSControlHistory({objectId:\''+data.objectId+'\'});">查看历史</a>';
	 //str += ' |<a href="javascript:sendMessage(\''+data.objectId+'\');">短信发送</a>';
	return  str;
}

function deleteRow(rowData){
	if($list_deleteUrl && $list_deleteUrl!=''){
		var title = '关闭短信控制后不能发短信，且清空余额，确定关闭？';
		art.dialog.confirm(title,function(){
			$.post($list_deleteUrl,{id:rowData.id},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					if(typeof(afterDeleteRow)=='function'){
						afterDeleteRow();
					}
					refresh();
				}
			},'json');
			return true;
		},function(){
			return true;
		});
	}
}


//测试发送短信
function sendMessage(senderId){
	 
		$.post(getPath()+"/cmct/smsControl/sendMessage",{senderId:senderId},function(data){
			
			art.dialog.tips(data.MSG);
		},'json');
	 
}

function toConfigBtn(){
	 
  var url = getPath()+"/cmct/smsControl/toSmsConfig";		 
  var flag = true;
  var dlg = art.dialog.open(url,
		{title:'短信服务配置',
		 lock:true,
		 width:850||'auto',
		 height:400||'auto',
		 id:"SMSCONFIG-EDIT",
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
		});
}

function editRow(rowData){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=EDIT&id='+rowData.id+'&objectId='+rowData.objectId+'&objectNumber='+rowData.objectNumber+'&objectName='+rowData.objectName;
		}else{
			paramStr = '?VIEWSTATE=EDIT&id='+rowData.id+'&objectId='+rowData.objectId+'&objectNumber='+rowData.objectNumber+'&objectName='+rowData.objectName;
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('EDIT'),
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
				});
	}
}


function changeBalance(param){
	var u = getPath()+"/cmct/smsControl/toChangeBalance";
	var paramStr = '?controlId='+param.controlId+'&operationtype='+param.operationtype;
	var flag = true;
	var title = "充值";
	if(param.operationtype=="DEDUCTION_TYPE"){
		title = "扣减";
	}
	var dlg = art.dialog.open(u+paramStr,
		{title:title,
		 lock:true,
		 width:'380px',
		 height:'150px',
		 id:"changeBalance",
		 button:[{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.changeBalance){
					dlg.iframe.contentWindow.changeBalance(this);
				}
				return false;
			}},{name:'取消',callback:function(){
				 
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

function viewSMSControlHistory(param){
	var u = getPath()+"/cmct/smsControl/toControlHistory";
	var paramStr = '?objectId='+param.objectId;
	var flag = true;
	var dlg = art.dialog.open(u+paramStr,
		{title:"查看历史",
		 lock:true,
		 width:'620px',
		 height:'450px',
		 id:"changeBalance",
		 button:[{name:'取消',callback:function(){
				 
				return true;
			}}]
		});
}



function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes && selectNodes.length>0){
			return {parent:selectNodes[0].id};
		}
	}
	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id}; 
	}
	return null;
}

function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	searchData();
}
function searchData(){
	
	$list_dataParam['controlType']='PERSONAL_TYPE';
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		$list_dataParam['orgLongNumber']=selectNodes[0].longNumber;
		$list_dataParam['includeChild']=true;
	}else{
		delete $list_dataParam['id'];
		delete $list_dataParam['orgLongNumber'];
	}
	//不查离职人员 jobStatusNotIn=1
	$list_dataParam['jobStatusNotIn'] = 1;
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	
	resetList();
}