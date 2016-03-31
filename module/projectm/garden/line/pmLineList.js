/**
 * 片区列表
 */
var parentId='';
var type='';
var lineId = '';
var nodeLevel;
$(document).ready(function(){
	loadTreeData();
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftToolBar").ligerToolBar({
		items:[
		       {id:'addNode',text:'新增',click:addLine,icon:'add'},
		       {id:'updateLine',text:'编辑',click:updateLine,icon:'modify'},
		       {id:'deleteNode',text:'删除',click:deleteLine,icon:'delete'}
		       ]
	});
	$("#toolBar").ligerToolBar({
		 items:[
		        {id:'add',text:'新增',click:addStation,icon:'add'}
//		        {id:'importLine',text:'批量新增站点',click:importLine,icon:'add'}
		 ]
		});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
			{display: '配套设施', name: 'name', align: 'left', width:100,render: operateRenderToMap},
			{display: '配套设施类型', name: 'line.name', align: 'left', width: 120 },
			{display: '全拼', name: 'fullPinyin', align: 'left', width:100 },
			{display: '简拼', name: 'simplePinyin', align: 'left', width:80 },
			{display: '备注', name: 'desc', align: 'left', width: 150},
			{display: '操作', name: 'clienteleagent', align: 'left', width: 160,render:operateRender}
        ],
	onDblClickRow : function (resultData, rowindex, rowobj){
    	/*$.post(getPath()+"/projectm/pmStation/toViewStation",{fid:resultData.id},function(data){
    		if(data.result){
    			var station = data.result;
    			$("#saveStation").resetForm();
    			$("#saveStation #lineId").val(station.line.name).attr("disabled", true);
    			$("#saveStation #name").val(station.name).attr("disabled", true);
    			$("#saveStation #fullPinyin").val(station.fullPinyin).attr("disabled", true);
    			$("#saveStation #simplePinyin").val(station.simplePinyin).attr("disabled", true);
    			$("#saveStation #desc").val(station.desc).attr("disabled", true);
    			art.dialog({
    				lock: true,
    				id:"toViewStation",
    				title:"查看",
    					content: $("#toViewStation").get(0),
    					width:382,
    					height:52,
    					cancelVal: '关闭',
    				    cancel: true 
    			});
    		}else{
    			art.dialog.alert("该记录可能已经被删除！");
    		}
    	});*/
    }
    }));
	$("#garea,#barea").click(function(){
		$(".on").removeClass("on");
		$(this).closest("li").addClass("on");
		selectList();
	});
});

function loadTreeData(){
	$.post(getPath()+'/projectm/pmLine/getNode',{}, function(data) { 
		lineManage.init(eval(data.treeData));
	},"json");
}


function addLine(){
	art.dialog.data("iframeId","opernLineAddWindow");
	art.dialog.open(getPath()+'/projectm/pmLine/addView?areaId='+parentId, {
		title:"新增",
		id : 'opernLineAddWindow',
		width :420,
		height :166,
		lock: true,
		ok:function(){
			art.dialog.data("saveLine")();
			loadTreeData();
			return false;
		},
		close:function(){
			loadTreeData();			
		},
		okVal:'保存',
		cancelVal: '关闭',
		    cancel: true 
	});
}


function updateLine(){
	art.dialog.data("iframeId","opernLineAddWindow");
	if(parentId==null || parentId==""){
		art.dialog.alert("请选择节点");
		return;
	}
	if(nodeLevel==0){
		art.dialog.alert("请选择配套设施节点");
		return;
	}
	art.dialog.open(getPath()+'/projectm/pmLine/addView?id='+lineId, {
		title:"编辑",
		id : 'opernLineAddWindow',
		width :430,
		height :200,
		ok:function(){
			art.dialog.data("saveLine")();
			loadTreeData();	
			return false;
		},
		okVal:'保存',
		cancelVal: '关闭',
		    cancel: true 
	});
}

function deleteLine(){
	if(parentId==null ||parentId==""){
		art.dialog.alert("请选择节点");
		return;
	}
	if(nodeLevel==0){
		art.dialog.alert("请选择配套设施节点");
		return;
	}
	art.dialog.confirm('确定删除该配套设施?',function(){
		$.post(getPath()+'/projectm/pmLine/deleteLine?id='+lineId,function(res){ 
			loadTreeData();	
			art.dialog.tips("删除成功！",null,"succeed");
		},'json');
	});
}

//新增站点
function addStation(){
	var tree = $.fn.zTree.getZTreeObj("areaTree");
	var node = tree.getSelectedNodes();
	if(!node[0]){
		art.dialog.tips('请选择设施节点...');
		return false;
	}
	if(!node[0].lineId){
		art.dialog.tips('请选择设施节点...');
		return false;
	}
	
	art.dialog.open(getPath()+'/projectm/pmStation/toAddStation?areaId='+parentId + '&lineId=' + lineId, {
		title:"新增",
		id : 'addUpdateStation',
		width :440,
		height :363,
		ok:function(){
			art.dialog.data("saveStation")();
			setTimeout(function(){
				selectList();
			},300);
			return false;
		},
		okVal:'保存',
		cancelVal: '关闭',
		    cancel: true 
	});
}
function selectList(){
	var json = {
//			areaNumber:areaNumberTemp
	};
	
	var tree = $.fn.zTree.getZTreeObj("areaTree");
	
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		json.lineId=node[0].lineId;
		json.areaNumber=node[0].areaNumber;
	}
//	if(nodeLevel!=0){
		$.post(getPath()+'/projectm/pmStation/getListData',json,function(res){ 
			$list_dataGrid.loadData(res); 
		},'json');
//	}
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	return '<a href="javascript:mapMark(\''+data.id+'\');">地图标点</a> | '
	+ '<a href="javascript:updateStation(\''+data.id+'\');">修改</a> | <a href="javascript:deleteStation(\''+data.id+'\');">删除</a>';
}

function operateRenderToMap(data,filterData){
	var zoom = data.zoom;
	return data.name+"&nbsp&nbsp" + (zoom>0?"<img style='height:15px;' src='" + getPath()+"/default/style/images/marker_red.png'/>":"");
}


/**
 * *************************************
 * 地图标点
 * *************************************
 * */
function mapMark(id){
	art.dialog.data("flag",false);
	art.dialog.open(getPath()+'/projectm/pmStation/toMapMark?fid=' + id,
	{
		lock : true,
		id : "toMapMark",
		title : "站点地图标点",
		width:1082,
		height:588,
		close:function(){
			if(art.dialog.data("flag")){
				selectList();
				art.dialog.tips("保存成功",null,"succeed");
			}
		}
	});
}



/**
 * *************************************
 * 修改站点
 * *************************************
 * */
function updateStation(id){
	art.dialog.open(getPath()+'/projectm/pmStation/toUpdateStation?id=' + id,
	{
		lock : true,
		id : "addUpdateStation",
		title : "修改站点",
		width :440,
		height :363,
		ok:function(){
			art.dialog.data("saveStation")();
			selectList();
			return false;
		},
		okVal:'保存',
		cancelVal: '关闭',
		    cancel: true 
	});
}


/**
 * *************************************
 *  删除站点
 * *************************************
 * */
function deleteStation(id){
	art.dialog.confirm('确定删除该片区?',function(){
		$.post(getPath()+'/projectm/pmStation/deleteStation?id='+id,function(res){ 
			selectList();
			art.dialog.tips("删除成功！",null,"succeed");
		},'json');
	});
}
function selectImage(id){
	art.dialog.open($list_buildingUrl+"?gardenId="+id
			, {
		init : function() {
		},
		id : 'selectImageWindow',
		width : 998,
		title:"新增楼盘",
		height : 550,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 art.dialog.data("updateGarden")();
				 return false;
			 }
		} ]
	});
}



lineManage ={
		init:function(data){
			var setting = { 
					view: {
						selectedMulti: false
					},
					
					async: {
						enable: false,  
						dataFilter: lineManage.lineFilter
					},
					callback: { 
						onClick: lineManage.getLineList
					}
			};
			//加载树
			var treeObj = $.fn.zTree.init($("#areaTree"), setting,data);
			$('.ztree').css('height', ($('#container').height())+'px');
		}, 
		getLineList:function(event, treeId, treeNode, clickFlag){
					parentId = '';
					lineId = '';
					if(treeNode.level == 0){
						parentId =treeNode.id;
					}else if(treeNode.level == 1){
						parentId =treeNode.getParentNode().id;
						lineId = treeNode.id;
					}
					nodeLevel = treeNode.level;
					selectList();
		},
		deleteArea:function(id){
			$.get(ctx+"/projectm/pmArea/delete",{id:id},function(data){
				if(data.ret==1){
					art.dialog.tips("保存成功",null,"succeed");
					//刷新
					var treeId = art.dialog.data("getAreaList_ID");
					var treeNode = art.dialog.data("etAreaList_treeNode");
					var clickFlag = art.dialog.data("etAreaList_clickFlag");
					var events= art.dialog.data("getAreaList_event");
					art.dialog.data("getLineList")(events,treeId,treeNode,clickFlag);
				}else{
					art.dialog.alert("删除失败！");
				}
			});
			
		},
		lineFilter:function(treeId, parentNode, childNodes){ 
			if (!childNodes) return null;
			for (var i=0, l=childNodes.length; i<l; i++){
				childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
				if(childNodes[i].level == 1){
					alert(childNodes[i].name);
				}
			}
			return childNodes; 
		}, 
		formatType:function(cellValue){
			if(cellValue == '3'){
				return "地理片区";
			} else if(cellValue == '4'){
				return "商业片区";
			}else if(cellValue == '5'){
				return "关键字段"
			}
		},
		formatHtml:function(cellValue){
			return "<a onclick=lineManage.showEditPanel('"+encodeURIComponent(cellValue)+"') href='javascript:void(0)'>编辑</a>";
		},
		showEditPanel:function(areaId){
			art.dialog.open(ctx+'/projectm/pmArea/add?areaId='+areaId, {
				title:"编辑",
				id : 'opernEditArea',
				width : 385,
				height :195,
				ok:function(){
					art.dialog.data("saveArea")();
					return false;
				},
				okVal:'保存',
				cancelVal: '关闭',
	   		    cancel: true 
			})
		}
}