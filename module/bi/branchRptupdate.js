$list_dataType = "仓库管理";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/ebstorage/storage/simpleTreeData";
$list_addUrl = getPath() + '/ebstorage/storage/add';
$list_editUrl = getPath() + '/ebstorage/storage/edit';
$list_deleteUrl = getPath() + '/ebstorage/storage/delete';
$list_batchSetUrl = getPath() + '/ebstorage/storage/batchSet';
$list_editWidth="1050px";
$list_editHeight="550px";
$(function() {
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	// 数据列表
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($("#main").height()-45);
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val().trim();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	
	initSimpleDataTree();
	
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam, {
        columns: [ 
       		   {display: '分店名称', name: 'branchName', align: 'center', width: 170},
       		   {display: '分店负责人', name: 'personName', align: 'center', width: 170},
				{display: '销售总额(元)', name: 'soldAmount2', align: 'right', width: 170,
       			render:function(data){
                    return 	parseFloat(data.soldAmount).toFixed(2);
				}/*,
				totalSummary: {
                	render: function (suminf, column, cell){
                  		 return '<div>销售总额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                  	},
                  	align: 'left'
                  }*/},
				{display: '退货总额(元)', name: 'backAmount', align: 'right', width: 170,
             			render:function(data){
                            return 	parseFloat(data.backAmount).toFixed(2);
        				}/*, totalSummary: {
                	render: function (suminf, column, cell){
                  		 return '<div>退货总额：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                  	},
                  	align: 'left'
                  }*/},
      		   {display: '退货订单数量(笔)', name: 'backCount', align: 'center', width: 170/*, totalSummary: {
               	render: function (suminf, column, cell){
                 		 return '<div>退货订单数量：' + parseInt(suminf.sum) + '</div>';
                 	},
                 	align: 'left'
                 }*/}
               ],
               delayLoad : true,
               url: getPath()+"/bi/storageRpt/queryBranchRptupdate",
               onDblClickRow:function(rowData,rowIndex,rowDomElement){
               	showdataDetail(rowData.storageId,rowData.goodsId,queryStartDate,queryEndDate);
               }
           }));
	
	
	var params2 ={};
	params2.width = 300;
	params2.fmtEndDate = true;
	params2.dateFmt = 'yyyy/MM/dd HH:mm:ss';
	params2.inputTitle = "支付时间";	
	MenuManager.common.create("DateRangeMenu","payTime",params2);
	MenuManager.menus["payTime"].setValue(startTime,endTime);
	MenuManager.menus["payTime"].confirm();
	
	$('#includeContainer').bind('change',searchData);
	// 回车事件
	$('#keyWord').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});
	$(".addProLink").click(function(){
		addItem();
	});
	searchData();
});



function initSimpleDataTree(){
	$.post($tree_async_url,{},function(treeData){
		var tree = $.fn.zTree.init($("#"+$tree_container), {
			async: {
				enable: false
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					if(typeof(onTreeNodeClick) == "function"){
						onTreeNodeClick(event, treeId, treeNode);
					}
				},
				onAsyncSuccess:function(event, treeId, node, msg){
					if(typeof(onTreeAsyncSuccess) == "function"){
						onTreeAsyncSuccess(event, treeId, node, msg);
					}
				}
			},
			data:{
				simpleData:{
					enable: true,
					idKey: "id",
					pIdKey: "pid",
					rootPId: null
				}
			}
		},treeData);
		var nodes = tree.getNodes();
		if(nodes && nodes.length > 0){
			tree.expandNode(nodes[0], true, false, true);
			tree.selectNode(nodes[0]);
		}
		/*if(searchData){
			searchData();
		}*/
	},'json');
}
/**
 * 显示名称
 * 
 * @param data
 */
function showName(data) {
	// 判断是否地图标点
	if (data.mapoint == 1) {
		return data.storageName + "&nbsp&nbsp" + ("<img style='height:15px;' src='" + getPath() + "/default/style/images/marker_red.png'/>");
	} else {// 默认也是0
		return data.storageName;
	}
}
function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}
function initStorage(){
	$("#initStorage").text("初始化中...").off();
	$.post(getPath() + '/ebstorage/storage/initsave'
			, function(res) {
		art.dialog.tips(res.MSG);
		if (res.STATE == 'SUCCESS') {
			$("#initStorage").text("初始化仓库").on("click",function(){
				initStorage();
			});
			refresh();
		}
	}, 'json');
}
// 操作
function operateRender(data) {
	// 标记：启用；可以地图标点；禁用可以编辑；这里判断
	if (data.status == 'ENABLE') {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">禁用</a> | <a href="javascript:mapMark({id:\'' + data.storageId + '\'});">地图标记</a>';// | <a href="javascript:addressEdit({id:\'' + data.storageId + '\',id2:\''+data.id+'\'});">管辖地址</a> 
	} else if (data.status == 'DISABLED') {
		return '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">启用</a> | <a href="javascript:editRow({id:\'' + data.storageId + '\',id2:\''+data.id+'\'});">编辑</a>';  // | <a href="javascript:addressEdit({id:\'' + data.storageId + '\',id2:\''+data.id+'\'});">管辖地址</a> 
	} else {
		// 不显示操作
		var obj = {
			fileName : 'storageList.js',
			lineNumber : '61',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
	}
}

/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	var _status = data.status == 1 ? 'DISABLED' : 'ENABLE';
	if(_status == 'DISABLED'){
		var msg = "确定禁用操作吗？"
	}else{
		var msg = "确定启用操作吗？"
	}
	art.dialog.confirm(msg, function() {
		//ebstorage/storage/
		$.post(getPath() + '/ebstorage/storage/onOff', {
			id : data.id,
			status : _status
		}, function(res) {
			art.dialog.tips(res.MSG);
			if (res.STATE == 'SUCCESS') {
				refresh();
			}
		}, 'json');
		return true;
	}, function() {
		return true;
	});
}

/**
 * 地图标记
 * 
 * @param id
 */
function mapMark(data) {
	art.dialog.data("flag", false);
	art.dialog.open(getPath() + '/ebstorage/map/toMapMark?fid=' + encodeURIComponent(data.id), {
		lock : true,
		id : "toMapMark",
		title : "地图标记",
		width : 1082,
		height : 590,
		close : function() {
			if (art.dialog.data("flag")) {
				art.dialog.tips("保存成功", null, "succeed");
				searchData();
			}
		}
	});
}

var queryStartDate = "";
var queryEndDate = "";
// 查询
function searchData() {
	//树形的参数
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	if(tree!=null && tree!=""){
		var selectNodes = tree.getSelectedNodes();
		if(selectNodes.length>0){
			if($('#includeChild:checked').attr('checked') == true || $('#includeChild:checked').attr('checked') == 'checked'){
				delete $list_dataParam['orgId'];
				$list_dataParam['longNumber'] = selectNodes[0].longNumber;
			}else{
				$list_dataParam['orgId'] = selectNodes[0].id;
				$list_dataParam['longNumber'] = selectNodes[0].longNumber;
			}
			/**
			 * add by lhh
			 * @date 2016-1-29
			 */
			$list_dataParam['branchName'] = selectNodes[0].name;//分店的名字
			$list_dataParam['leaf'] = selectNodes[0].leaf;//是否有下级
			$list_dataParam['level'] = selectNodes[0].flevel;//当前的组织级别
			$list_dataParam['personName'] = selectNodes[0].personName;//当前的负责人
		}else{
			delete $list_dataParam['leaf'];
			delete $list_dataParam['branchName'];
			delete $list_dataParam['level'];
			delete $list_dataParam['orgId'];
			delete $list_dataParam['longNumber'];
		}
	}
	
	if(MenuManager.menus["payTime"]){
		queryStartDate = MenuManager.menus["payTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["payTime"].getValue().timeEndValue;
	}
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['payTimeBegin'] = queryStartDate;
	} else {
		delete $list_dataParam['payTimeBegin'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['payTimeEnd'] = queryEndDate;
	} else {
		delete $list_dataParam['payTimeEnd'];
	}
	var buytype=$("#buytype").val();
	if(buytype != ""){
		$list_dataParam['buytype'] = buytype;
	} else {
		delete $list_dataParam['buytype'];
	}
	resetList();
}
// 清空
function onEmpty() {
	MenuManager.menus["payTime"].resetAll();
	$("#buytype option:first").prop("selected", 'selected');
	searchData();
}

//导出
function importList(){
	var param = "";
	var startTime = MenuManager.menus["payTime"].getValue().timeStartValue;
	var endTime = MenuManager.menus["payTime"].getValue().timeEndValue;
	var buytype = $("#buytype").val();
	//查询开始时间
	if(startTime != ""){
		startTime = startTime.replace(/\//g,"-");
	}
	//查询结束时间
	if(endTime != ""){
		endTime = endTime.replace(/\//g,"-");
	}
	
	param += "payTimeBegin=" + startTime;
	param += "&payTimeEnd=" + endTime;
	param += "&buytype=" + buytype;
	if($("#containBackBill").attr("checked")){
		param += "&containBackBill=1";
	}
	var longNumber="";
	var orgId="";
	var branchName="";
	var level="";
	var personName="";
	var tree = $.fn.zTree.getZTreeObj("leftTree");
		if(tree!=null && tree!=""){
			var selectNodes = tree.getSelectedNodes();
			if(selectNodes.length>0){
					longNumber = selectNodes[0].longNumber;
				/**
				 * add by lhh
				 * @date 2016-1-29
				 */
			    orgId=selectNodes[0].id;
				branchName = selectNodes[0].name;//分店的名字
				level = selectNodes[0].flevel;//当前的组织级别
				personName = selectNodes[0].personName;//当前的负责人
			}
		}
	param += "&longNumber=" + longNumber;
	param += "&orgId=" + orgId;
	param += "&branchName=" + branchName;
	param += "&level=" + level;
	param += "&personName=" + personName;
	window.location.href = base+"/bi/storageRpt/exportBranchExcelupdate?"+param;
}

