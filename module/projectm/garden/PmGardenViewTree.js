/**
* 楼盘树控件
 */

//加载树
jQuery(document).ready(function(){
	//loadTree(0);
//	$("#selectGardenTree").click(function() {
//		search();
//	});
	loadBuidTree();
});

function loadBuidTree(){
	$.post(base+"/broker/garden/buildingTree",{gardenId:gardenId},function(data){
		$('#buildUl').append(data);
		$('[buildId]').click(function(){
			var bid=$(this).attr('buildId');
			var gid=$(this).attr('gardenId');
			$("#roomLists").attr("src",getPath()+"/broker/garden/getRoomList?buildingId="+bid+"&gardenId="+gid);
			$(this).parents('ul').find('.current').removeClass('current');
			$(this).addClass('current');
		});
	});
}


function loadTree(statu){
			$.post(getPath()+"/broker/garden/gardenTree",{gardenId:gardenId},function(data){
				var result=data.treeData;
				var zNodes =eval(result);
				var setting = {
						view: {
							selectedMulti: false,
							dblClickExpand: false
						},
						edit: {
							enable: true,
							showRemoveBtn: false,
							showRenameBtn: false
						},
						data: {
							keep: {
								parent: false,
								leaf: false
							},

							simpleData: {
									enable: true
								}
							},
							callback: {
								onClick:function(a,b,c){
									if(c.level==2 || (c.level==1&&!c.isParent)){
										$("#roomLists").attr("src",getPath()+"/broker/garden/getRoomList?buildingId="+c.id+"&gardenId="+encodeURIComponent(gardenId));
									}
//									if(c.level==0){
//										art.dialog.open(ctx + "/buildmange/selectById?gardenId=" + encodeURIComponent(c.id), {
//											init : function() {
//											},
//											id : 'opernPersonWindow1',
//											title:"楼盘详情",
//											width : 960,
//											height : 530,
//											button : [ {
//												className : 'aui_state_highlight',
//												name : '保存',
//												 callback: function () {
//													 callDialogFun("opernPersonWindow1","com.shihua.broker.gardendail.updateGarden");
//												     return false;
//												 }
//											} ]
//										})
//									}
								},
								beforeRename:beforeRename,
								onRightClick: OnRightClick
							}
						};
				$.fn.zTree.init($("#resourceTree"), setting, zNodes);
				zTree = $.fn.zTree.getZTreeObj("resourceTree");
				rMenu = $("#rMenu");
			},"json");
}

function search (){
	gardenId = $("#gardenId").val();
	if(gardenId!=""){
		gardenId = gardenId .replace(",","");
	}
	loadTree(1);
}
var zTree, rMenu,curSrcNode, curType;
//当右击时
function OnRightClick(event, treeId, treeNode){
	if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
		zTree.cancelSelectedNode();
		showRMenu("root", event.clientX,event.clientY);
	} else if (treeNode && !treeNode.noR) {
		zTree.selectNode(treeNode);
		showRMenu("node", event.clientX,(event.clientY-60));
		if(treeNode.level==0){
			showRMenu("node", event.clientX,event.clientY);
		}
	}
}
//显示右键菜单
function showRMenu(type, x, y) {
	$("#rMenu ul").show();
	if (type=="root") {
		$("#rMenu ul").hide();
	} else {
		var selectnode = zTree.getSelectedNodes()[0];
		if(selectnode.level==0){
			$("#m_copy").hide();
			$("#m_add").show();
		}
		if(selectnode.level==1 && selectnode.isParent){
			$("#m_copy").hide();
			$("#m_add").show();
		}
		if(selectnode.level==1 && !selectnode.isParent){
			$("#m_add").show();
			$("#m_copy").show();
		}
		if(selectnode.level==2 ){
			$("#m_add").hide();
			$("#m_copy").show();
		}
	}
	rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

	$("body").bind("mousedown", onBodyMouseDown);
}
//隐藏菜单
function hideRMenu() {
	if (rMenu) rMenu.css({"visibility": "hidden"});
	$("body").unbind("mousedown", onBodyMouseDown);
}
//当页面点击
function onBodyMouseDown(event){
	if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
		rMenu.css({"visibility" : "hidden"});
	}
}
var addCount = 1;
//增加节点
function addTreeNode() {
	hideRMenu();
	var selectnode = zTree.getSelectedNodes()[0];
	var att = "请输入单元名！";
	var fla=0;
	
	if(selectnode.id ==gardenId){
		att="请输入楼栋名！";
		fla=1;
	}
	var name=art.dialog.prompt(att,function(val){
		 if (val!=null && val!="")
		  {
			  var data =  zTree.getNodesByParam("name",val.replaceAll(" ",""),selectnode);
			  if(data!=''){
				  art.dialog.alert(selectnode.name+"下存在:"+val);
				  return;
			  }
			 if(fla==1){
				// var nodejson =  zTree.addNodes(selectnode, [{ name:val}]);
				 var regisrName = val;
				 var name=val;
				 var json={name:name,registerName:regisrName,unitName:" ",gardenId:gardenId};
				 $.post(ctx+"/buildblock/add",json,function(data){
					 	if(data.ret=="1"){
					 		art.dialog.alert("新增成功");
					 		var nodejson =  zTree.addNodes(selectnode, [{ name:val,id:data.buildid}]);
					 	}
					});
			 }else{
				 //得到当前节点的名字
				 var regisrName = selectnode.name;
				 var name=regisrName;
				 var json={name:name,registerName:regisrName,unitName:val,gardenId:gardenId};
				 //
				// addBuliding(json);
				 $.post(ctx+"/buildblock/add",json,function(data){
					 	if(data.ret=="1"){
					 		art.dialog.alert("新增成功");
					 		var nodejson =  zTree.addNodes(selectnode, [{ name:val,id:data.buildid}]);
					 	}
					});
			 }
		  }else{
			  art.dialog.alert("输入的单元名为空！");
		  }
		
	})
}
//删除单元
function removeTreeNode() {
	hideRMenu();
	var nodes = zTree.getSelectedNodes();
	if (nodes && nodes.length>0) {
		if (nodes[0].children && nodes[0].children.length > 0) {
			var msg = "楼栋下有单元，请确认删除！";
			if (confirm(msg)==true){
				//遍历子节点
				var buildids="";
				for(var i=0;i<nodes[0].children.length;i++){
					buildids+=nodes[0].children[i].id+",";
				}
				$.post(ctx+"/buildblock/deleteByName?buildids="+buildids,null,function(data){
					if(data.ret=="2"){
						art.dialog.alert("删除成功！");
						var parentNode  = nodes[0].getParentNode();
						zTree.removeNode(nodes[0]);
						if(!parentNode.isParent){
							zTree.removeNode(parentNode);
						}
					}else{
						art.dialog.alert("删除失败！");
						flag=1;
					}
					
				});
				zTree.removeNode(nodes[0]);
			}
		} else {
			$.post(ctx+"/buildmange/isBuildingExistHouse",{buildid:nodes[0].id},function(data){
				
				if(data.ret=="1"){
					var flag = art.dialog.confirm("请确认删除这个单元",
							function(){
								$.post(ctx+"/buildblock/delete?buildingid="+nodes[0].id,null,function(data){
									if(data.ret=="2"){
										art.dialog.alert("删除成功！");
										var parentNode  = nodes[0].getParentNode();
										zTree.removeNode(nodes[0]);
										if(!parentNode.isParent){
											zTree.removeNode(parentNode);
										}
									}else{
										art.dialog.alert("删除失败！");
										flag=1;
									}
									
								});
							}
					);
				}else{
					art.dialog.alert("单元下存在放盘数据，不能删除！");
				}
			});
		}
	}
}
//选中单元
function checkTreeNode(checked) {
	var nodes = zTree.getSelectedNodes();
	if (nodes && nodes.length>0) {
		zTree.checkNode(nodes[0], checked, true);
	}
	hideRMenu();
}
//修改
function updateTreeNode(){
	/*nodes = zTree.getSelectedNodes();
	treeNode = nodes[0];
	if (nodes.length == 0) {
		alert("请先选择一个节点");
		return;
	}
	hideRMenu();
	zTree.editName(treeNode);*/

		art.dialog.open(ctx + "/buildingList?id="
				+ encodeURIComponent(gardenId), {
			init : function() {
			},
			title:"楼栋",
			id : 'opernupdate',
			width : "99%",
			height :"99%"
		})
		hideRMenu();
}
//复制
function copyTreeNode(){
	
	nodes = zTree.getSelectedNodes();
	if (nodes.length == 0) {
		alert("请先选择一个节点");
		return;
	}
	curType = "copy";
	setCurSrcNode(nodes[0]);
	hideRMenu();
	//节点是否是建模楼栋
	var bid = nodes[0].id;
	$.post(ctx+"/buildmange/selectfloor",{buildingid:bid},function(data){
		if(data.ret==1){
			art.dialog.open(ctx + "/room/batchCopy?gardenId="
					+ encodeURIComponent(gardenId)+"&buildid="+nodes[0].id, {
				init : function() {
				},
				title:"批量复制",
				id : 'opernCopyWindow',
				width : 300,
				height : 510,
				button : [ {
					className : 'aui_state_highlight',
					name : '保存',
					 callback: function () {
						 callDialogFun("opernCopyWindow","com.shihua.broker.room.batch.copySave");
					     return false;
					 }
				} ]
				
			})
		}else{
			art.dialog.alert("你选中的节点未建模,请重新选择复制！");
		}
	});
}
//粘帖
function paseTreeNode(){
	if (!curSrcNode) {
		alert("请先选择一个节点进行 复制");
		return;
	}
	nodes = zTree.getSelectedNodes(),
	targetNode = nodes.length>0? nodes[0]:null;
	if (curSrcNode === targetNode) {
		alert("不能移动，源节点 与 目标节点相同");
		return;
	} else if (curType === "cut" && ((!!targetNode && curSrcNode.parentTId === targetNode.tId) || (!targetNode && !curSrcNode.parentTId))) {
		alert("不能移动，源节点 已经存在于 目标节点中");
		return;
	} else if (curType === "copy") {
		targetNode = zTree.copyNode(targetNode, curSrcNode, "inner");
	} else if (curType === "cut") {
		targetNode = zTree.moveNode(targetNode, curSrcNode, "inner");
		if (!targetNode) {
			alert("剪切失败，源节点是目标节点的父节点");
		}
		targetNode = curSrcNode;
	}
	setCurSrcNode();
	delete targetNode.isCur;
	zTree.selectNode(targetNode);
	hideRMenu();
}
function setCurSrcNode(treeNode) {
	if (curSrcNode) {
		delete curSrcNode.isCur;
		var tmpNode = curSrcNode;
		curSrcNode = null;
		fontCss(tmpNode);
	}
	curSrcNode = treeNode;
	if (!treeNode) return;

	curSrcNode.isCur = true;			
	zTree.cancelSelectedNode();
	fontCss(curSrcNode);
}
function fontCss(treeNode) {
	var aObj = $("#" + treeNode.tId + "_a");
	aObj.removeClass("copy").removeClass("cut");
	if (treeNode === curSrcNode) {
		if (curType == "copy") {
			aObj.addClass(curType);
		} else {
			aObj.addClass(curType);
		}			
	}
}
function batchCopy(){
	zTree.setting.check.enable={
		enable:false
	};
}
//修改单元名
function beforeRename(treeId,treeNode,newName){
	//判断名字是否有重
	var selectnode = zTree.getSelectedNodes()[0];
	$("#rMenu ul").show();
	  var parentNode =  treeNode.getParentNode();
	  var data =  zTree.getNodesByParam("name",newName.replaceAll(" ",""),parentNode);
	 
	  if(data!=''){
		  //如果是楼盘节点
		  if(data[0].id ==treeNode.id){
			  zTree.cancelEditName();
			  return false;
		  }
		  if(selectnode.level!=0){
			  alert(parentNode.name+"下存在:"+newName);
			  zTree.cancelEditName();
			  return false;
		  }
	  }
	  if(selectnode.level==0){
		  var flg=0;
		  $.post(ctx+ "/buildmange/isExist?name="+newName+"&ststu=1",null,function(data){
				  if(data.ret =="1"){
					  art.dialog.alert("楼盘名："+newName+"已经存在！");
					  flg=1;
				  }
			});
		  if(flg==1){
			  zTree.cancelEditName();
			  return false;
		  }
		  
		  $.post(ctx+ "/buildmange/update",{gardenId:gardenId,name:newName,ststu:1},function(data){
			  if(data.ret =="1"){
				  art.dialog.alert("修改成功！");
			  }else{
				  art.dialog.alert("修改失败！");
				  zTree.cancelEditName();
				  return false;
			  }
		});
	  }
	  var oldName= treeNode.name;
	  if(selectnode.level==1){
		  $.post(ctx+"/buildblock/updateName",{gardenId:gardenId,oldName:oldName,newName:newName},function(data){
				art.dialog.alert("修改成功！");
			});
	  }
	  var trrid = treeNode.id;
	  if(selectnode.level==2){
		  $.post(ctx+"/buildblock/update",{unitId:trrid,unitName:newName},function(data){
				art.dialog.alert("修改成功！");
			});
	  }
}
String.prototype.replaceAll = function(s1,s2) { 
    return this.replace(new RegExp(s1,"gm"),s2); 
}
