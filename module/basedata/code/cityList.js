$list_editUrl = getPath()+"/basedata/cityList/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/cityList/add";//新增url
$list_deleteUrl = getPath()+"/basedata/cityList/delete";//删除url
$list_editWidth = "520px";
$list_editHeight = "130px";
$list_dataType = "省份城市";//数据名称
$tree_container = "cityTree";
$tree_async_url = getPath()+"/basedata/cityList/simpleTreeData";
var parentId='';
$(document).ready(function(){
	
	
	$.post(getPath()+'/basedata/cityList/getNode',{}, function(data) { 
		cityManage.init(eval(data.treeData));
	},"json");
	$("#main").ligerLayout({leftWidth:250,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$("#cityTree").height($("#main").height()-20);
	$("#leftToolBar").ligerToolBar({
		items:[
		       {id:'addNode',text:'新增',click:addNode,icon:'add'},
		       {id:'updateNode',text:'编辑',click:updateNode,icon:'modify'},
		       {id:'deleteNode',text:'删除',click:deleteNode,icon:'delete'}
		       ]
		});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '名称', name: 'name', align: 'left', width: 200},
            {display: '简码', name: 'simpleName', align: 'left', width: 80},
            {display: '全名', name: 'fullName', align: 'left', width: 80},
            {display: '所属省份', name: 'parent.name', align: 'left', width: 80},
            {display: '数据来源', name: 'syncType', align: 'center', width: 50,render:syncTypeRender},
            {display: '操作', name: 'operate', align: 'center', width: 100,render:operateRender}
        ],
        fixedCellHeight:false,
        url:getPath()+'/basedata/cityList/listData',
        delayLoad:true
    }));
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
	
});
function operateRender(data,filterData){
		return '<a href="javascript:updateCity(\''+data.id+'\');">编辑</a>|'
			+'<a href="javascript:deleteCity(\''+data.id+'\');">删除</a>';
		
}
function syncTypeRender(data){
	return data.syncType=='CLOUD'?"云端":"本地";
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
		}else{
//			artDialog.alert("请先选择树节点",function(){})
//			return 'notValidate';
			return {parent:null}
		}
		
	}
	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function loadTreeData(){
	$.post(getPath()+'/basedata/cityList/getNode',{}, function(data) { 
		cityManage.init(eval(data.treeData));
	},"json");
}
//新增省份
function addNode(){
	var dlg = art.dialog.open(getPath()+'/basedata/cityList/add', {
		title:"新增",
		id : 'opernCityAddWindow',
		width :500,
		height :120,
		ok:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveCity){
				dlg.iframe.contentWindow.saveCity(dlg);
			}
			return false;
		},
		close:function(){
			$.post(getPath()+'/basedata/cityList/getNode',{}, function(data) { 
				cityManage.init(eval(data.treeData));
			},"json");
			setTimeout(function(){
				loadTreeData();
			},300);
		},
		okVal:'保存',
		cancelVal: '关闭',
		    cancel: true 
	})
}
//修改省份
function updateNode(){
	if(parentId==null ||parentId==""){
		art.dialog.tips("请选择节点");
		return;
	}
	var dlg = art.dialog.open(getPath()+'/basedata/cityList/add?id='+parentId+"", {
		title:"编辑",
		id : 'opernCityAddWindow',
		width :500,
		height :100,
		 button:[{name:'保存',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveCity){
					dlg.iframe.contentWindow.saveCity(dlg);
					setTimeout(function(){
						loadTreeData();
					},300);
				}
				return false;
			}},{name:'关闭',callback:function(){
				setTimeout(function(){
					loadTreeData();
				},300);
				return true;
			}}]		
	});
}

/**
 * 
 * 删除省份
 */
function deleteNode(){
	if(parentId==null ||parentId==""){
		art.dialog.tips("请选择节点");
		return;
	}
	art.dialog.confirm('确定删除该省份?',function(){
		$.post(getPath()+"/basedata/cityList/delete",{id:parentId},function(res){ 
			if(res!=null){
				if(res.STATE=='SUCCESS'){
					art.dialog.tips(res.MSG,null,"succeed");
					loadTreeData();
				}else{
					art.dialog.tips(res.MSG);
				}
			}
		},'json');
	});
}

//新增城市
function addCity(){
	if(parentId==null ||parentId==""){
		art.dialog.tips("请选择节点");
		return;
	}else{
		var dlg = art.dialog.open(getPath()+'/basedata/cityList/add?parentId='+parentId, {
			title:"新增",
			id : 'opernCityAddWindow',
			width :500,
			height :120,
			ok:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveCity){
					dlg.iframe.contentWindow.saveCity(dlg);
				}
				return false;
			},
			close:function(){
				$.post(getPath()+'/basedata/cityList/getNode',{}, function(data) { 
					cityManage.init(eval(data.treeData));
				},"json");
				setTimeout(function(){
					searchData();	
				},300);	
			},
			okVal:'保存',
			cancelVal: '关闭',
			cancel: true 
		})
	}
}

//修改省份
function updateCity(id){
	if(parentId==null ||parentId==""){
		art.dialog.tips("请选择节点");
		return;
	}
	var dlg = art.dialog.open(getPath()+'/basedata/cityList/add?id='+id+"", {
		title:"编辑",
		id : 'opernCityAddWindow',
		width :500,
		height :100,
		 button:[{name:'保存',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveCity){
					dlg.iframe.contentWindow.saveCity(dlg);
				}
				setTimeout(function(){
					searchData();	
				},300);
				return false;
			}},{name:'关闭',callback:function(){
				setTimeout(function(){
					searchData();	
				},300);
				return true;
			}}]		
	});
}

/**
 * 
 * 删除城市
 */
function deleteCity(id){
	art.dialog.confirm('确定删除该城市?',function(){
		$.post(getPath()+"/basedata/cityList/delete",{id:id},function(res){ 
			if(res!=null){
				if(res.STATE=='SUCCESS'){
					art.dialog.tips(res.MSG,null,"succeed");
					searchData();
				}else{
					art.dialog.tips(res.MSG);
				}
			}
		},'json');
	});
}

cityManage ={
		init:function(data){
			var setting = { 
					view: {
						selectedMulti: false
					},
					
					async: {
						enable: false,  
						dataFilter: cityManage.cityFilter
					},
					callback: { 
						onClick: cityManage.getCityList
					}
			};
			//加载树
			var treeObj = $.fn.zTree.init($("#cityTree"), setting,data);
			$('.ztree').css('height', ($('#container').height())+'px');
		}, 
		addCity:function(){
			
		},
		getCityList:function(event, treeId, treeNode, clickFlag){
					type = treeNode.level;
					parentId =treeNode.id;
					var paramNode = {childType:treeNode.type,parentId:parentId};
					searchData();
		},
		deleteCity:function(id){
			$.get(ctx+"/cityList/delete",{id:id},function(data){
				if(data.ret==1){
					art.dialog.tips("保存成功",null,"succeed");
					//刷新
					var treeId = art.dialog.data("getCityList_ID");
					var treeNode = art.dialog.data("etCityList_treeNode");
					var clickFlag = art.dialog.data("etCityList_clickFlag");
					var events= art.dialog.data("getCityList_event");
					art.dialog.data("getCityList")(events,treeId,treeNode,clickFlag);
				}else{
					art.dialog.alert("删除失败！");
				}
			});
			
		},
		cityFilter:function(treeId, parentNode, childNodes){ 
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
//			if(cellValue == '3'){
//				return "地理片区";
//			} else if(cellValue == '4'){
//				return "商业片区";
//			}else if(cellValue == '5'){
//				return "关键字段"
//			}
		},
		formatHtml:function(cellValue){
			return "<a onclick=cityManage.showEditPanel('"+encodeURIComponent(cellValue)+"') href='javascript:void(0)'>编辑</a>";
		},
		showEditPanel:function(cityId){
			art.dialog.open(ctx+'/cityList/add?id='+cityId, {
				title:"编辑",
				id : 'opernEditCity',
				width : 385,
				height :195,
				ok:function(){
					art.dialog.data("saveCity")();
					return false;
				},
				okVal:'保存',
				cancelVal: '关闭',
	   		    cancel: true 
			})
		}
}


function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	searchData();
}
function searchData(){
	var tree = $.fn.zTree.getZTreeObj("cityTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
//		if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){
//			delete $list_dataParam['id'];
//			if(selectNodes[0].longNumber==undefined){
//				$list_dataParam['longNumber'] = selectNodes[0].number;
//			}else{
		$list_dataParam['longNumber'] = selectNodes[0].longNumber;
//			}
//			
//		}else{
//			$list_dataParam['id'] = selectNodes[0].id;
//			delete $list_dataParam['longNumber'];
//		}
	}else{
		delete $list_dataParam['id'];
		delete $list_dataParam['longNumber'];
	}
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
	$list_dataParam['parentId'] = parentId;
	
	$.post(getPath()+'/basedata/cityList/listData',$list_dataParam,function(res){ 
		$list_dataGrid.loadData(res); 
	},'json');
}

/**
 * 禁用 / 启用
 * @param config
 * @param t
 */
function enableRow(config){
	$.post(getPath() + '/basedata/org/enable',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}


