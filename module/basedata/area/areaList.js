/**
 * 片区列表
 */
$list_editUrl = getPath()+'/basedata/garden/updateView';
$list_addUrl = '/shihua-surety/scheme/initEdit';
$list_deleteUrl = getPath()+'/basedata/garden/deleteGarden';
$list_buildingUrl = getPath()+'/basedata/building/getList';
$list_imageUrl = getPath()+'/basedata/garden/deleteGarden';
$list_modelUrl = getPath()+'/basedata/room/modelManager';
$tree_async_url = getPath()+"/basedata/area/getTreeArea";
$tree_container = "areaTree";
var parentId='';
var type='';
var initSimple="";
$(document).ready(function(){
//	$.post(getPath()+'/basedata/area/getNode',{}, function(data) { 
//		areaManage.init(eval(data.treeData));
//	},"json");
	
	$("#main").ligerLayout({leftWidth:250,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	
	$("#leftToolBar").ligerToolBar({
		items:[
		       {id:'addArea',text:'新增',click:addArea,icon:'add'},
		       {id:'updateNode',text:'编辑',click:updateNode,icon:'modify'},
		       {id:'deleteNode',text:'删除',click:deleteNode,icon:'delete'}
		       ]
		});
	initSimple=initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
			{display: '名称', name: 'name', align: 'left', width:160,render: showMapRender},
			{display: '编码', name: 'number', align: 'left', width: 150 },
			{display: '全拼', name: 'fullPinyin', align: 'left', width:150 },
			{display: '简拼', name: 'simplePinyin', align: 'left', width: 50},
			{display: '描述', name: 'description', align: 'left', width: 55},
			{display: '操作', name: 'clienteleagent', align: 'left', width: 150,render:operateRender}
        ],
        url:getPath()+'/basedata/area/getListData2',
        delayLoad:true,
        onDblClickRow : function (resultData, rowindex, rowobj){
        	$.post(getPath()+"/basedata/area/getAreaInfoById",{fid:resultData.id},function(data){
        		if(data.result){
        			var area = data.result;
        			$("#saveArea").resetForm();
        			$("#saveArea #name").val(area.name).attr("disabled", true);
        			$("#saveArea #number").val(area.number).attr("disabled", true);
        			$("#saveArea #fullPinyin").val(area.fullPinyin).attr("disabled", true);
        			$("#saveArea #simplePinyin").val(area.simplePinyin).attr("disabled", true);
        			$("#saveArea #description").val(area.description).attr("disabled", true);
        			$("#saveArea #cityName").val(area.city.name).attr("disabled", true);;
        			art.dialog({
        				lock: true,
        				id:"QueryCitywindow",
        				title:"查看",
        					content: $("#addCity").get(0),
        					width:382,
        					height:52,
        					cancelVal: '关闭',
        				    cancel: true 
        			});
        		}else{
        			art.dialog.alert("该记录可能已经被删除！");
        		}
        	});
        }
    }));
/*	$("#garea,#barea").click(function(){
		$(".hover").removeClass("hover");
		$(this).closest("li").addClass("hover");
		selectList();
	});*/
	
	
	
	$("#configDefaultMap").click(function(){
		art.dialog.open(getPath()+'/basedata/system/initMapData', {
			title:"地图初始化状态设置",
			id : 'opernInitMap',
			width:1082,
			height:562
		});
	});
	
	
	$("#name").bind("change",function(){
		var name =$(this).val();
		$('#name').val(name);
		toPinyin($(this).val(),function(result){
			$('#simplePinyin').val(result.simple);
			$('#fullPinyin').val(result.full);
		});
	});
});



function loadTreeData(){
	$.post(getPath()+'/basedata/area/getNode',{}, function(data) { 
		areaManage.init(eval(data.treeData));
	},"json");
}


function addNode(){
	//var type2 = $(".on a").attr("id");//类型
	var parentData = getPrentData();
	if(!parentData.parentAreaId){
		art.dialog.tips("请在左边选择大区");
		return false;
	}
	var type2=$("#selector").val();
	var title='';
	if(type2=='GEOGRAPHY'){
		title='片区';
		}
	if(type2=='BUSINESS'){
		 title='商圈';
		}
	$("#saveArea").resetForm();
	$("#areaId").val("");
	$("#saveArea #parentid").val(parentData.parentAreaId).attr("disabled", false);
	$("#saveArea #cityId").val(parentData.cityId);
	$("#saveArea #cityName").val(parentData.cityName).attr("disabled", true);
	$("#saveArea #name").attr("disabled", false);
	$("#saveArea #number").attr("disabled", false);
	$("#saveArea #fullPinyin").attr("disabled", false);
	$("#saveArea #simplePinyin").attr("disabled", false);
	$("#saveArea #description").attr("disabled", false);
	art.dialog({
		lock: true,
		id:"addCitywindow",
		title:'新增'+title,
			content: $("#addCity").get(0),
			width:382,
			height:52,
			ok: function(){
				addNodeSavve();
				return false;
			},
			okVal:'确定',
			cancelVal: '关闭',
		    cancel: true 
	});
}
function updateNode(){
	var parentData=getPrentData();
	if(!parentData.parentAreaId){
		art.dialog.tips('请选择大区...');
		return false;
	}
	var dlg = art.dialog.open(getPath()+'/basedata/area/addView?parentAreaId='+parentData.parentAreaId, {
		title:"编辑",
		id : 'opernAreaAddWindow',
		width :400,
		height :230,
		 button:[{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveArea){
					dlg.iframe.contentWindow.saveArea(dlg);
					loadTreeData();
				}
				return false;
			}},{name:'取消',callback:function(){
				
				return true;
			}}],
			close:function(){
				/*$.post(getPath()+'/basedata/area/getNode',{}, function(data) { 
					areaManage.init(eval(data.treeData));
				},"json");
				selectList();	
				loadTreeData();*/
				$('#'+$tree_container).empty();
				initSimpleDataTree();
			},
	});
}

/**
 * 
 * 删除片区
 */
function deleteNode(){
	var parentData=getPrentData();
	if(!parentData.parentAreaId){
		art.dialog.tips('请选择大区...');
		return false;
	}
	art.dialog.confirm('确定删除该大区以及关联下的片区?',function(){
		$.post(getPath()+"/basedata/area/deleteArea",{areaId:parentData.parentAreaId},function(res){ 
			if(res!=null){
				if(res.STATE=='SUCCESS'){
					art.dialog.tips(res.MSG,null,"succeed");
					$('#'+$tree_container).empty();
					initSimpleDataTree();
				}else{
					art.dialog.alert(res.MSG);
				}
			}
		},'json');
	});
}

function addNodeSavve(){
	//var type2 = $(".on a").attr("id");//类型
	var type2=$("#selector").val();
	
	$("#areaType").val(type2);
	
	if(!validate()){
		return;
	}else{
		$.post(getPath()+"/basedata/area/addArea",$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						id:"sid",
						content: res.MSG,
						time:1,
						close:function(){
							art.dialog.list['addCitywindow'].close();
						},
						width:200
					});
					refresh();
				}else{
					art.dialog.list["addCitywindow"].close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');
	}
}
function addArea(){
	var parentData=getPrentData();
	if(parentData.parentAreaId){
		art.dialog.tips('此处只能新增大区');
		return false;
	}
	var dlg = art.dialog.open(getPath()+'/basedata/area/addView?cityId='+parentData.cityId, {
		title:"新增",
		id : 'opernAreaAddWindow',
		width :400,
		height :230,
		ok:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveArea){
				dlg.iframe.contentWindow.saveArea();
			}
			return false;
		},
		close:function(){
			/*$.post(getPath()+'/basedata/area/getNode',{}, function(data) { 
				areaManage.init(eval(data.treeData));
			},"json");
			selectList();	
			loadTreeData();*/
			$('#'+$tree_container).empty();
			initSimpleDataTree();
		},
		okVal:'保存',
		cancelVal: '关闭',
		    cancel: true 
	})
}

/************************
 * 根据条件查询数据
 * **********************
 */

function addCity(){
	
	art.dialog({
		lock: true,
		id:"addCitywindow",
		title:"新增城市",
			content: $("#addCity").get(0),
			width:382,
			height:52,
			ok: function(){
				updateBillStatus(id);
			},
			okVal:'确定',
			cancelVal: '关闭',
		    cancel: true 
	});
}

function selectList(){
	//var type = $(".on a").attr("id");//类型
	var type=$("#selector").val();
	
	var json = {
			parentId:parentId,
			areaType:type
	};
	
	$.post(getPath()+'/basedata/area/getListData',json,function(res){ 
		$list_dataGrid.loadData(res); 
	},'json');
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	return '<a href="javascript:mapMark(\''+data.id+'\');">地图标点</a> | '
	+ '<a href="javascript:update(\''+data.id+'\');">修改</a> | <a href="javascript:deleteArea(\''+data.id+'\');">删除</a>';
}

function showMapRender(data,index,cdata){
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
	art.dialog.open(getPath()+'/basedata/area/toMapMark?fid=' + encodeURIComponent(id),
	{
		lock : true,
		id : "toMapMark",
		title : "片区地图标点",
		width:1082,
		height:590,
		close:function(){
			if(art.dialog.data("flag")){
				art.dialog.tips("保存成功",null,"succeed");
				searchData();
			}
		}
	});
}


/**
 * *************************************
 * 修改
 * *************************************
 * */
function update(id){
	var parentData = getPrentData();
	$.post(getPath()+"/basedata/area/getAreaInfoById",{fid:id},function(data){
		if(data.result){
			var area = data.result;
			$("#saveArea").resetForm();
			$("#saveArea #name").val(area.name).attr("disabled", false);
			$("#saveArea #number").val(area.number).attr("disabled", false);
			$("#saveArea #fullPinyin").val(area.fullPinyin).attr("disabled", false);
			$("#saveArea #simplePinyin").val(area.simplePinyin).attr("disabled", false);
			$("#saveArea #description").val(area.description).attr("disabled", false);
			$("#saveArea #areaId").val(id);
			$("#saveArea #cityId").val(parentData.cityId);
			$("#saveArea #cityName").val(parentData.cityName).attr("disabled", true);;
			art.dialog({
				lock: true,
				id:"addCitywindow",
				title:"修改",
					content: $("#addCity").get(0),
					width:382,
					height:52,
					ok: function(){
						addNodeSavve();
						refresh();
						return false;
					},
					okVal:'保存',
					cancelVal: '关闭',
				    cancel: true 
			});
		}else{
			art.dialog.alert("该记录可能已经被删除！");
		}
	});
}

/**
 * *************************************
 * 删除
 * *************************************
 * */
function deleteArea(id){
	art.dialog.confirm('确定删除该区域?',function(){
		$.post(getPath()+"/basedata/area/deleteArea",{areaId:id},function(res){ 
			if(res!=null){
				if(res.STATE=='SUCCESS'){
					art.dialog.alert(res.MSG);
					refresh();
				}else{
					art.dialog.alert(res.MSG);
				}
			}
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
function selectBuilding(id){
	art.dialog.open($list_buildingUrl+"?gardenId="+id
			, {
		init : function() {
		},
		id : 'selectBuildingWindow',
		width : 800,
		title:"楼栋设置",
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
function selectModel(id){
	art.dialog.open($list_modelUrl+"?gardenId="+id
			, {
		init : function() {
		},
		id : 'selectModelWindow',
		width : 800,
		title:"建模",
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

areaManage ={
		init:function(data){
			var setting = { 
					view: {
						selectedMulti: false
					},
					
					async: {
						enable: false,  
						dataFilter: areaManage.areaFilter
					},
					callback: { 
						onClick: areaManage.getAreaList
					}
			};
			//加载树
			var treeObj = $.fn.zTree.init($("#areaTree"), setting,data);
			$('.ztree').css('height', ($('#container').height())+'px');
		}, 
		addCityArea:function(){
			
		},
		getAreaList:function(event, treeId, treeNode, clickFlag){
					type = treeNode.level;
					parentId =treeNode.id;
					var paramNode = {childType:treeNode.type,parentId:parentId};
					selectList();
		},
		deleteArea:function(id){
			$.get(ctx+"/area/delete",{id:id},function(data){
				if(data.ret==1){
					art.dialog.tips("保存成功",null,"succeed");
					//刷新
					var treeId = art.dialog.data("getAreaList_ID");
					var treeNode = art.dialog.data("etAreaList_treeNode");
					var clickFlag = art.dialog.data("etAreaList_clickFlag");
					var events= art.dialog.data("getAreaList_event");
					art.dialog.data("getAreaList")(events,treeId,treeNode,clickFlag);
				}else{
					art.dialog.alert("删除失败！");
				}
			});
			
		},
		areaFilter:function(treeId, parentNode, childNodes){ 
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
			return "<a onclick=areaManage.showEditPanel('"+encodeURIComponent(cellValue)+"') href='javascript:void(0)'>编辑</a>";
		},
		showEditPanel:function(areaId){
			art.dialog.open(ctx+'/area/add?areaId='+areaId, {
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


function validate(){
	if($("#number").val()==''){
		art.dialog.tips("编码不能为空！");
		return false;
	}
	if($("#name").val()==''){
		art.dialog.tips("名称不能为空！");
		return false;
	}
	if($("#cityName").val()==''){
		art.dialog.tips("城市不能为空！");
		return false;
	}
	return true;
	
}
function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}

function getPrentData(){
	var data={};
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		data.cityId=node[0].cityId;
		data.parentAreaId=node[0].parentAreaId;
		data.cityName=node[0].cityName;
		return data;
	}
	return false;
}

function searchData(){
	var parentData = getPrentData();
	if(!parentData){
		art.dialog.tips("请先在左边选择数据类型");
		return false;
	}
	if(parentData.parentAreaId){
		delete $list_dataParam['cityId'];
		$list_dataParam['parentId'] = parentData.parentAreaId;
	}else{
		delete $list_dataParam['parentId'];
		$list_dataParam['cityId'] = parentData.cityId;
	}
	$list_dataParam['areaType'] = $('#selector').val();
	resetList();
}
function getAddRowParam(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		return {parentId:node[0].parentAreaId,cityId:node[0].cityId,areaType:$('#selector').val()};
	}
	return {};
}
