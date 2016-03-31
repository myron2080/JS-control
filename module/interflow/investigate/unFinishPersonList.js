//$list_editUrl = getPath()+"/basedata/org/edit";//编辑及查看url
//$list_addUrl = getPath()+"/basedata/org/add";//新增url
//$list_deleteUrl = getPath()+"/basedata/org/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "200px";
$list_dataType = "组织";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$list_defaultGridParam.pageSize=15;
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [
            {display: '姓名', name: 'name', align: 'left',width: 120},
            {display: '职位', name: 'personPosition.position.name', align: 'left',width: 120},
            {display: '职级', name: 'personPosition.jobLevel.name', align: 'left',width: 120},
            {display: '组织', name: 'personPosition.position.belongOrg.name', align: 'left',width: 120},
            {display: '操作', name: 'operate', align: 'center',width: 120,render:operateRender}
        ],
        checkbox:false,
        fixedCellHeight:false,
        url:base+url+'?questionnaireId='+id+'&partyType='+type+'&longNumber='+longNumber+'&consType='+consType+'&debateType='+debateType,
        pageSize:15,
        pageSizeOptions:[10,15,20,30],
        onAfterShowData:function (data){
        	
        }
    }));
	$('#includeContainer').bind('click',searchData);
});
function operateRender(data,filterData){
	
		return '<a href="javascript:void(0);" onclick="shortMessage(\''+data.id+'\')">发短信</a>';
			
}

function searchData(){
	
	$list_dataParam["searchKey"] = $("#searchKey").val()=="姓名/职位/职级/组织"?'':$("#searchKey").val();
	resetList();
}

/**
 * 发短信
 */

var detailMessage;
function shortMessage(id){
	detailMessage=$.ligerDialog.open({height:460,
		width:660,
		url: getPath()+"/cmct/note/topicMessage?personId="+id,
		title:"发送短信",
		isResize:true,
		isDrag:true});
}

function closeDetailMessage(){
	detailMessage.close();
}

//function shortMessage(personId){
//	var dlg = art.dialog.open(base+"/interflow/note/message?personId="+personId,{
//		id : 'add',
//		title:"短信发送",
//		width : 520,
//		height : 320,
//		lock:true,
//		button:[{name:'发送',callback:function(){
//			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.sendMessageForm){
//				dlg.iframe.contentWindow.sendMessageForm(dlg);
//			}
//			return false;
//		}},{name:'取消',callback:function(){
//			return true;
//		}}]
//	});
//}

function addLetter(receiveId){
	art.dialog.data("result",null); 
	art.dialog.open(getPath()+"/basedata/cchat/show?receiveId="+receiveId,{
		title:'鼎尖聊聊',
		 lock:false,
		 width:'450px',
		 height:'300px',
		 id:"addLetter",
		 close:function(){
			 if(art.dialog.data("result") && "success"==art.dialog.data("result")){
				
				 //art.dialog.alert("发送成功！");
				 art.dialog({
					 content:"发送成功！",
					 time:1,
					 close:function(){
					 },
					 width:200
				 });
				 
			 }else if(art.dialog.data("result") && "faild"==art.dialog.data("result")){
				 art.dialog.alert("发送失败！");
			 }
		 }
	});
}

function afterAddRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function afterEditRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
}

function afterDeleteRow(){
	$('#'+$tree_container).empty();
	initSimpleDataTree();
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

function postionSetting(org){
	if(org){
		var dlg = art.dialog.open(getPath()+'/basedata/org/positionSetting?VIEWSTATE=ADD&org='+org.id,{
			 title:'岗位设置',
			 lock:true,
			 width:'630px',
			 height:'320px',
			 id:"positionSetting",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd();
					}
					return false;
				}},{name:'取消'}]
			});
	}
}

function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	searchData();
}
function searchDataPositionName(){
	if(this.id!="all"){
		var text= this.text.replace(/\(\w*\)/g,"");
		searchData(text);
	}else{
		searchData("");
	}
}
////根据左边的树ID加载右边的表格数据
//function searchData(positionName){
//	var tree = $.fn.zTree.getZTreeObj("leftTree");
//	//$list_dataParam['orgId']="";
//	var selectNodes = tree.getSelectedNodes();
//	
//
//	
//	if(positionName){
//		$list_dataParam['positionName']=positionName;
//	}else{
//		delete $list_dataParam['positionName'];
//	}
//	if(selectNodes.length>0){
//		if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){
//			delete $list_dataParam['id'];
//			$list_dataParam['orgLongNumber'] = selectNodes[0].longNumber;
//			//$list_dataParam['orgId'] = selectNodes[0].id;
//		}else{
//			//$list_dataParam['orgId'] = selectNodes[0].id;
//			$list_dataParam['orgLongNumber'] = selectNodes[0].longNumber;
//			//delete $list_dataParam['longNumber'];
//		}
//	}
//	
//	resetList();
//}