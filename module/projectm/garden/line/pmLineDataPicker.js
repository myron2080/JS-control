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
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
			{display: '配套设施', name: 'name', align: 'left', width:100},
			{display: '配套设施类型', name: 'line.name', align: 'left', width: 120 },
			{display: '全拼', name: 'fullPinyin', align: 'left', width:100 },
			{display: '简拼', name: 'simplePinyin', align: 'left', width:80 },
			{display: '备注', name: 'desc', align: 'left', width: 150},
			{display: '操作', name: 'clienteleagent', align: 'left', width: 160}
        ],
        checkbox: true
	}));
});

function loadTreeData(){
	$.post(getPath()+'/projectm/pmLine/getNode',{type:'SCHOOL'}, function(data) { 
		lineManage.init(eval(data.treeData));
	},"json");
}

function okSelect(){
	
		var selectData = $list_dataGrid.getSelecteds();
		if(selectData==null || selectData.length==0){
			artDialog.tips('请选择数据');
		}else{
			artDialog.open.origin[art.dialog.data("returnFunName")].call(null, selectData);
			art.dialog.close();
		}
	
}

function selectList(){
	var json = {
			lineId:lineId
	};
	if(nodeLevel!=0){
		$.post(getPath()+'/projectm/pmStation/getListData',json,function(res){ 
			$list_dataGrid.loadData(res); 
		},'json');
	}
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

		lineFilter:function(treeId, parentNode, childNodes){ 
			if (!childNodes) return null;
			for (var i=0, l=childNodes.length; i<l; i++){
				childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
				if(childNodes[i].level == 1){
					alert(childNodes[i].name);
				}
			}
			return childNodes; 
		}
}