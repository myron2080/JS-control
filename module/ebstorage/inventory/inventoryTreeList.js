$list_dataType = "库存";//数据名称
$tree_container = "leftTree";
$tree_async_url = getPath()+"/ebstorage/inventory/simpleTreeData";
$list_editUrl= getPath()+"/ebstorage/inventory/edit";
$list_editWidth="1050px";
$list_editHeight="550px";
var isClick = false;//是否点击查询
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftTree").height($("#main").height()-45);
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val().trim();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	AutoComp.init();
	eventFun("#goodsKey");
	eventFun("#storageKey");
	eventFun("#storageSpaceKey");
	eventFun("#goodsBarCode");
//	$(".orangebtn").click(function(){
//		toBackGoods();
//	});
	$(".graybtn").click(function(){
		resetCommonFun("goodsKey,storageKey,storageSpaceKey");
	});
	$("#containChild").on("click",function(){
		searchData();
	});
	$("#unequalCount").on("click",function(){
		searchData();
	});
	
	$("#refreshLimit").click(function(){
		calcAllLimitCount();
	});
	$("#importInventory a").click(function(){//库存导入
		importInventory();
	});
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		columns:[
		         {display: '商品编码', name: 'goods.number', align: 'left', width: 140, isSort:false},
		         {display: '商品名称', name: 'goods.name', align: 'left', width: 200, isSort:false},
		         {display: '商品条形码', name: 'goods.barCode', align: 'left', width: 200, isSort:false},
		         {display: '警戒值', name: 'limitCount', align: 'center',  width: 120, isSort:false,editor:{type: 'int'}, render:limitCountRender},
		         {
		        	 display: '可用数量', 
		        	 name: 'ableCount',
		        	 align: 'left',
		        	 width: 130, 
		        	 isSort:false,
		        	 totalSummary:
                     {
                        render: function (suminf, column, cell)
                        {
                            return '<div>可用总计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                        },
                        align: 'left'
                     }},
		         {
					display: '占用数量',
					name: 'occupyCount', 
					align: 'left', 
					width: 130, 
					isSort:false,
					totalSummary:
                    {
                       render: function (suminf, column, cell)
                       {
                           return '<div>占用总计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                       },
                      align: 'left'
                    }},
		         {
	 				display: '总库存',
	 				name: 'allCount', 
	 				align: 'left', 
	 				width: 130, 
	 				isSort:false,
	 				totalSummary:
                    {
                       render: function (suminf, column, cell)
                       {
                           return '<div>库存总计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
                       },
                      align: 'left'
                    }},
		         {display: '供应商', name: 'supplierName', align: 'left', width: 200, isSort:false},
		         {display: '仓库编码', name: 'storageNumber', align: 'left',  width: 140, isSort:false},
		         {display: '仓库名称', name: 'storageName', align: 'center',  width: 120, isSort:false},
		         {display: '仓库负责人', name: 'personName', align: 'center',  width: 120, isSort:false}
				],
        height:'95%',
        enabledEdit: true,
        onBeforeEdit:limitCount_onBeforeEdit,
        checkbox:true,
        fixedCellHeight:false,
        url:getPath()+'/ebstorage/inventory/listData',
        onAfterEdit:function(rowData,rowIndex,rowDomElement){
        	limitCount_onAfterEdit(rowData);
        },
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
         	showdataDetail(rowData.id);
        },
        delayLoad:true
    }));
	$("#searchKeyWord").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});

	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
			isClick = true;
	    }});
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
		if(searchData){
			searchData();
		}
	},'json');
}

//选择供应商
function autoFun(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
	//清空 商品选择器
	$("#goodsNumber").val("");
	$("#goodsId").val("");
}

function autoGoods(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
	searchData();
}

//function autoGoods(data,sourceObj){
//	$(sourceObj).val($(data).attr("number"));
//	searchData();
//}

/**
 * 库存导入
 */
function importInventory(){
	var flag = false;
	var url= base+"/ebstorage/inventory/importInventory"
	var dlg = art.dialog.open(url,
			{title:"库存导入",
			 lock:true,
			 width:'635px',
			 height:'130px',
			 id:"importInventoryDialog",
			 button:[{name:"导入",callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveImportData){
						dlg.iframe.contentWindow.saveImportData(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 refresh();
				 }
			 }
	 });
}


function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}

/**
 * 更新 所有仓库 库存预警值
 * @returns
 */
function calcAllLimitCount(){
	$("#refreshLimit").text("刷新中...").off();
	$.post(getPath()+'/ebstorage/outBatch/calcAllLimitCount',{},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips("刷新成功");
			searchData();
		}else{
			art.dialog.tips(res.MSG);
		}
		$("#refreshLimit").text("刷新警戒值").click(function(){
			calcAllLimitCount();
		});
	},'json');
}

function showdataDetail(id){
		//可个性化实现
		if($list_editUrl && $list_editUrl!=''){
			var paramStr;
			if($list_editUrl.indexOf('?')>0){
				paramStr = '&VIEWSTATE=VIEW&id='+id;
			}else{
				paramStr = '?VIEWSTATE=VIEW&id='+id;
			}
			var dlg=art.dialog.open($list_editUrl+paramStr,
					{title:getTitle('库存查看'),
					lock:true,
					width:$list_editWidth,
					height:$list_editHeight,
					id:$list_dataType+'-VIEW',
					button:[{name:'打印',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
							dlg.iframe.contentWindow.printer(dlg);
						}
						return false;
					},
					focus: true
					},{name:'关闭'}]}
			);
		}
}
function searchData(){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		$list_dataParam['orgId'] = selectNodes[0].id;
		$list_dataParam['longNumber'] = selectNodes[0].longNumber;
	}else{
		delete $list_dataParam['orgId'];
		delete $list_dataParam['longNumber'];
	}
//	var goodsKey=$("#goodsKey").val();
//	if(goodsKey == '商品编码/名称'){
//		goodsKey='';
//	}
	var storageKey=$.trim($("#storageKey").val());
	
	if(storageKey == '仓库编码/名称'){
		storageKey='';
	}
	var storageSpaceKey=$.trim($("#storageSpaceKey").val());
	if(storageSpaceKey == '仓位编码/名称'){
		storageSpaceKey='';
	}
	//商品条形码
	var goodsBarCodeKey=$.trim($("#goodsBarCode").val());
	if (goodsBarCodeKey=='商品条形码') {
		goodsBarCodeKey='';
	}
	putparam('provideExtId',$.trim($("#provideExtId").val()));
	putparam('goodsId',$.trim($("#goodsId").val()));
	putparam('storageKey',storageKey);
	putparam('goodsBarCode',goodsBarCodeKey);
	putparam('storageSpaceKey',storageSpaceKey);
	
	if($("#containChild").attr("checked")){
		$list_dataParam['containChild'] = '1';
	}else{
		delete $list_dataParam['containChild'];
	}
	if($("#unequalCount").attr("checked")){
		$list_dataParam['unequalCount'] = '1';
	}else{
		delete $list_dataParam['unequalCount'];
	}
	resetList();
}

//清空
function onEmpty(){
	delete $list_dataParam['provideExtId'];
	delete $list_dataParam['orgId'];
	delete $list_dataParam['longNumber'];
	delete $list_dataParam['storageKey'];
	delete $list_dataParam['storageSpaceKey'];
	delete $list_dataParam['goodsBarCode'];
	$("#containChild").attr("checked",false);
	$("#goodsNumber").val("");
	$("#goodsId").val("");
	$("#provideExtName").val("");
	$("#provideExtId").val("");
	$("#goodsBarCode").val("商品条形码");
	searchData();
} 
function putparam(key,value){
	if(value.trim() != ''){
		$list_dataParam[key] = value;
	}else{
		delete $list_dataParam[key];
	}
}

/**
 * 导出
 */
function importList(){
	var provideExtId = $.trim($("#provideExtId").val());
	
	var param = "";
	var orgId ="";
	var longNumber = ""; 
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if( selectNodes.length > 0){
		orgId = selectNodes[0].id;
		longNumber = selectNodes[0].longNumber;
	}
	var goodsId=$.trim($("#goodsId").val());
	var storageKey = "";
	var storageSpaceKey = "";
	var containChild = "";
	var goodsBarCode="";
	if($("#containChild").attr("checked")){
		containChild = '1';
	}
	if(isClick){
		storageKey=$.trim($("#storageKey").val());
		if(storageKey == '仓库编码/名称'){
			storageKey='';
		}
		storageSpaceKey=$.trim($("#storageSpaceKey").val());
		if(storageSpaceKey == '仓位编码/名称'){
			storageSpaceKey='';
		}
		goodsBarCode=$.trim($("#goodsBarCode").val());
		if (goodsBarCode=='商品条形码') {
			goodsBarCode='';
		}
	}
	param += "orgId="+ orgId;
	param += "&goodsId="+ goodsId;
	param += "&storageKey="+ storageKey;
	param += "&storageSpaceKey="+ storageSpaceKey;
	param += "&containChild="+ containChild;
	param += "&longNumber="+ longNumber;
	param += "&goodsBarCode="+ goodsBarCode;
	param += "&provideExtId=" + provideExtId;
	
	window.location.href=base+"/ebstorage/inventory/exportExcel?"+param;
}

function limitRender(rowData){
	console.log(rowData);
}
      //编辑限制库存后事件 
function limitCount_onAfterEdit(rowData){
	var limitCount=rowData.value;
	var storageId=rowData.record.storageId;
	var goodsId=rowData.record.goods.id;
	var id=rowData.record.id
	if (parseInt(limitCount)<0 ) {
		 art.dialog.tips("请正确输不小于0的数字");
		 refresh();
		 return false;
	}
	var limitCountUserful=rowData.record.limitCountUserful;//数据库里面的值存在页面上
	if (parseInt(limitCountUserful)!=parseInt(limitCount)&& parseInt(limitCount) >=0) {
		$.post(getPath()+'/ebstorage/inventory/updateLimitCount',{
			storageId:storageId,
			goodsId:goodsId,
			limitCount:limitCount,
			id:id
			},function(res) {
			art.dialog.tips(res.MSG);
			refresh();
		},'json');
	}
}
function limitCount_onBeforeEdit(e) {
	if (DGGXJJZ!='Y') {
		 art.dialog.tips("您无权操作!");
		 return false;
	}
	if(e.record.haveChild == '1'){
		return false;
	}
	return true;
}
//批量导入的页面
function importListExcel(){
	var flag = false;
	var url= base+"/ebstorage/inventory/getInventoryExcelData";
	art.dialog.data("getInventoryExcelBack",getInventoryExcelBack);
	var dlg = art.dialog.open(url,
			{title:"警戒值批量导入",
			 lock:true,
			 width:'635px',
			 height:'130px',
			 id:"importDataDialog",
			 button:[{name:"导入",callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveImportData){
						dlg.iframe.contentWindow.saveImportData(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}]
			});
}
//批量设置警戒值
function updateLimitCountbattch(){
	var inventoryIds='';
	var storageIds='';
	var orgIds='';
	art.dialog.data("getInventoryExcelBack",getInventoryExcelBack);
	if($list_dataGrid.getSelectedRows().length>0){
		for(var i=0;i<$list_dataGrid.getSelectedRows().length;i++){
			var obj=$list_dataGrid.getSelectedRows()[i];
			if (obj.haveChild=='0') {//可以编辑的
				inventoryIds+=obj.id+',';
				storageIds+=obj.storageId+',';
				orgIds+=obj.orgId+','; 
			}
		}
	}
	if (inventoryIds=='') {
		art.dialog.tips("请选择合伙人的数据!");
		 return false;
	}
	var url = base + "/ebstorage/inventory/updateLimitCountbattch?inventoryIds="+inventoryIds+"&storageIds="+storageIds+"&orgIds="+orgIds;
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title:'批量设置警戒值',
		 lock:true,
		 width:'375px',
		 height:'85px',
		 id:"updateLimitCountbattch",
		 button:[{name:'保存',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveLimitCount){
					dlg.iframe.contentWindow.saveLimitCount(dlg);
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
}
function getInventoryExcelBack(){
	 refresh();
}
function limitCountRender(data){
	var str='';
	if (data.haveChild=='0') {
		str+='<div style="color: blue;" title="可以编辑">'+data.limitCount+'</div>'
	}else {
		str+=data.limitCount;
	}
	return str;
}