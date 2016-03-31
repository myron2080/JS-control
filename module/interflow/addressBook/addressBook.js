//$list_editUrl = getPath()+"/basedata/org/edit";//编辑及查看url
//$list_addUrl = getPath()+"/basedata/org/add";//新增url
//$list_deleteUrl = getPath()+"/basedata/org/delete";//删除url
$list_editWidth = "580px";
$list_editHeight = "250px";
$list_dataType = "组织";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/org/simpleTreeData";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($("#main").height()-20);
//	var  toolBarObj= $("#toolBar").ligerToolBar({
//		items:[
//		       {id:'all',text:'全部',click:searchDataPositionName},
//		       {id:'jl',text:'经理',click:searchDataPositionName},
//		       {id:'jjr',text:'置业顾问',click:searchDataPositionName},
//		       {id:'zl',text:'行政秘书',click:searchDataPositionName}
//			]
//		});
//	
	initSimpleDataTree();
	$list_defaultGridParam.pageSize=15;
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '头像', name: 'photo', align: 'left',render:function(r){
            	var photo = r.photo;
            	if(null==photo || ""==photo){
            		photo = "default/style/images/home/man_head.gif";
            	}else{
            		photo = "images/"+photo;
            	}
            	return "<div><img src='"+ctx+"/"+photo+"' width='40px' height='40px' pop-name='"+r.name+"' person-pop='"+r.number+"'/></div>";
            	
            }},
            {display: '姓名', name: 'name', align: 'left'},
            {display: '部门', name: 'personPosition.position.belongOrg.name', align: 'left'},
            {display: '职位', name: 'personPosition.position.name', align: 'left'},
            {display: '性别', name: 'sex.name', align: 'left'},
            {display: '手机号码', name: 'phone', align: 'left'},
            {display: '短号', name: 'shortNumber', align: 'left'},
            {display: '操作', name: 'operate', align: 'center',render:operateRender}
        ],
        fixedCellHeight:false,
        url:getPath()+'/interflow/addressBook/listData',
        pageSize:15,
        delayLoad:true,
        pageSizeOptions:[10,15,20,30],
        onAfterShowData:function (data){
        	personPop.init();
        	//var items=toolBarObj.options.items;
//        	var positionNames="";
//        	for(var i=0;i<items.length;i++){
//        		var item= items[i];
//        		var text= item.text.replace(/\(\w*\)/g,"");
//        		//if(item.id=="all"){        			
//        		//	item.text=text+"("+data.recordCount+")";
//        		//}else{
//        			positionNames+=text;
//        			item.text=text;
//        			if(i<items.length-1){
//        				positionNames+=",";
//        			}
//        		//}
//        	}
        	//$("#tableContainergrid").css("height","630px");
        	var tree = $.fn.zTree.getZTreeObj("leftTree");
        	var selectNodes = tree.getSelectedNodes();
        	var orgLongNumber="";
        	var orgId = "";
        	
        	// 树节点为第一个节点时,不统计职位信息
        	if(selectNodes[0].level==0){
        		$("#toolBar").html("");
        		$("#toolBar").ligerToolBar({items:""});
        		return;
        	}
 
        	
        	if(selectNodes.length>0){
        		orgLongNumber = selectNodes[0].longNumber;
        		orgId = selectNodes[0].id;
        	}
        	if(!orgId){
        		if(!tree.getNodes()[0]){
        			alert(tree.getNodes()[0]);
        		orgId = tree.getNodes()[0].id;
        		}
        	}
        	$.post(getPath()+'/interflow/addressBook/queryPersonTotal',{orgId:orgId,orgLongNumber:orgLongNumber},function(json){
        		if(json&&json.ret==0){
        			var items=new Array();
					   for(var key in json.data){
//						for(var i=0;i<items.length;i++){
//							var item= items[i];
//							if(!json.data[item.text]){
//								
//								json.data[item.text]=0;
//							}
//								item.text=item.text+"("+json.data[item.text]+")";
//								
//							//}
						   var obj={id:key,text:key+"("+json.data[key]+")",click:searchDataPositionName};
						   if(key=="全部"){
							   obj.id='all';
							   items.unshift(obj);
						   }else{
							   items.push(obj);
						   }
						}
					   $("#toolBar").html("");
			        	$("#toolBar").ligerToolBar({items:items});
					//}
				}
        		
			});
        	
//        	$.post(getPath()+"/interflow/addressBook/selectPositionByOrg",{orgId:orgId},function(list){
//        		for(var i=0;i<list.length;i++){
//        			
//        		}
//        	});
//        	
        }
    }));
	$('#includeContainer').bind('click',searchData);
});
function operateRender(data,filterData){
	
		return '<a href="javascript:void(0);" onclick="shortMessage(\''+data.id+'\')">发短信</a>'+'&nbsp;&nbsp;<a href="javascript:void(0);" onclick="addLetter(\''+data.id+'\')">聊聊</a>';
			
}

function searchData(){
	
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
//根据左边的树ID加载右边的表格数据
function searchData(positionName){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	//$list_dataParam['orgId']="";
	var selectNodes = tree.getSelectedNodes();
	

	
	if(positionName){
		$list_dataParam['positionName']=positionName;
	}else{
		delete $list_dataParam['positionName'];
	}
	if(selectNodes.length>0){
		if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){
			delete $list_dataParam['id'];
			$list_dataParam['orgLongNumber'] = selectNodes[0].longNumber;
			//$list_dataParam['orgId'] = selectNodes[0].id;
		}else{
			//$list_dataParam['orgId'] = selectNodes[0].id;
			$list_dataParam['orgLongNumber'] = selectNodes[0].longNumber;
			//delete $list_dataParam['longNumber'];
		}
	}
	
	resetList();
}