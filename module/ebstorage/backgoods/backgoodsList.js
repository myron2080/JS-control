$list_editUrl = getPath()+"/ebstorage/backgoods/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebstorage/backgoods/add";//新增url
$list_deleteUrl = getPath()+"/ebstorage/backgoods/delete";//删除url
$list_editWidth="1050px";
$list_editHeight="350px";
$list_dataType = "退货单" ;
var approveEnum={NOAPPROVAL:'未审批',APPROVALED:'已审批',REJECTED:'已驳回',RETURNGOODS:'确认退货',RECEIVABLES:'已收款',GENERAL_STORE:'退货到总仓',PART_STORE:'退货到供应商'};
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	//导出按钮
	$("#exportGoodsBtn").bind("click",function(){
		exportBackGoodsData();
	});
	
	//
	eventFun("#numberNo");
	eventFun("#suppliers");
	$(".graybtn").click(function(){
		clearDataPicker('provide_f7');//f7清除
		resetCommonFun("numberNo,suppliers,backGoodsType");
		MenuManager.menus["createTime"].resetAll();
		searchData();
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '操作', name: '', align: 'center', width: 120, isSort:false,render: operateRender},
         {display: '退货单', name: 'number', align: 'center', width: 140, isSort:false, render: backNumberLink},
         {display: '关联单号', name: 'inStorageNo', align: 'center', width: 140, isSort:false, render: instorageLink},
         {display: '供应商', name: 'provideExtName', align: 'center',  width: 100, isSort:false},
         {display: '退货仓库', name: 'storageName', align: 'center',  width: 100, isSort:false},
         {display: '退货类型', name: 'backGoodsType', align: 'center',  width: 80, isSort:false, render:renderEnum},
         {display: '类目数', name: 'categoryCount', align: 'center',  width: 80, isSort:false},
         {display: '总价', name: 'backTotal', align: 'center',  width: 80, isSort:false},
         {display: '状态', name: 'backGoodsStatus', align: 'center',  width: 80, isSort:false, render:renderEnum},
         {display: '审批信息', name: 'apprInfo', align: 'center',  width: 120, isSort:false},
         {display: '退货申请时间', name: 'createTime', align: 'center',  width: 160, isSort:false},
         {display: '退货确认时间', name: 'confirmDateStr', align: 'center',  width: 160, isSort:false}
		],
        width:"99%",
        enabledSort:true,
        url:getPath() + '/ebstorage/backgoods/listData',
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	showViewDataDetail(rowData.id);
        }
    }));
	var params ={};
	params.width = 260;
	params.inputTitle = "退货确认日期";	
	MenuManager.common.create("DateRangeMenu","createTime",params);
});
/**
 * 查询
 */
function searchData(){
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['startTime'] = queryStartDate;
	} else {
		delete $list_dataParam['startTime'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['endTime'] = queryEndDate;
	} else {
		delete $list_dataParam['endTime'];
	}
	
	
	var numberNo=$("#numberNo").val();
	if(numberNo == '退货单/关联单号'){
		numberNo="";
	}
	$list_dataParam['provideId'] = $("#provideId").val();
	$list_dataParam['numberNo'] = numberNo;
	$list_dataParam['backGoodsType'] = $("#backGoodsType").val();
	resetList();
}

//调拨单详情页
function outOrderNumberLink(id){
		var dlg=art.dialog.open(getPath()+'/ebstorage/out/edit?VIEWSTATE=VIEW&id='+id,
				{
				title:'调拨单查看',
				lock:true,
				width:$list_editWidth,
				height:$list_editHeight,
				id:$list_dataType+'-VIEW',
				button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
						dlg.iframe.contentWindow.printer(dlg);
					}
					return false;
				}},{name:'关闭'}]}
		);
}


function backNumberLink(data){
	return '<a href="javascript:void(0);" onclick="showViewDataDetail(\''+data.id+'\');">'+data.number+'</a>';
}

//退货单详情查看
function viewDataDetail(id){
	var data={id:id};
	viewRow(data);
}

function showViewDataDetail(id){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+id;
		}
		var dlg=art.dialog.open($list_editUrl+paramStr,
				{

			 	title:"退货单查看",
				lock:true,
				width:$list_editWidth,
				height:$list_editHeight,
				id:$list_dataType+'-VIEW',
				button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
						dlg.iframe.contentWindow.printer(dlg);
					}
					return false;
				}},{name:'关闭'}]}
		);
	}
}
function instorageLink(data){
	if(data.backGoodsType == 'PART_STORE'){//退货到供应商
		return '<a href="javascript:void(0);" onclick="viewInstorageDetail(\''+data.inStorage.id+'\');">'+data.inStorage.number+'</a>';
	}else if(data.backGoodsType == 'GENERAL_STORE'){//退货到总仓
		return '<a href="javascript:void(0);" onclick="outOrderNumberLink(\''+data.outOrder.id+'\');">'+data.outOrder.number+'</a>';
	}
}

//入库单详情查看
function viewInstorageDetail(id){
	var url = getPath() + "/ebstorage/instorageList/viewInstorage?id=" + id;
	var dlg = art.dialog.open(url,{
		 title:"入库单-查看",
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"viewInstorageDetail",
		 button:[{name:'打印',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printerInstorage){
					dlg.iframe.contentWindow.printerInstorage(dlg);
				}
				return false;
			}},{name:'关闭',callback:function(){
				return true;
		}}]
	});
}




/**
 * 导出退货Excel
 */ 
function exportBackGoodsData(){
	var startTime = "";
	var endTime = "";
	if(MenuManager.menus["createTime"]){
		startTime = MenuManager.menus["createTime"].getValue().timeStartValue;
		endTime = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	startTime=startTime.replace(/\//g,"-");
	endTime=endTime.replace(/\//g,"-");
	var numberNo=$("#numberNo").val();
	if(numberNo == $("#numberNo").attr("defaultValue")){
		numberNo="";
	}
	var provideId = $("#provideId").val();
	var backGoodsType = $("#backGoodsType").val();
	var url = getPath()+"/ebstorage/backgoods/exportBackGoodsByCond?numberNo="+numberNo+"&provideId="+provideId+"&backGoodsType="+backGoodsType+"&startTime="+startTime+"&endTime="+endTime;
	var frame = $('#downLoadFile');
	frame.attr('src',url);
}


function renderEnum(record, rowindex, value, column){
	return approveEnum[value];
}

//操作
function operateRender(data){
	var status=data.backGoodsStatus;
	var resLink='';
	if(status == 'NOAPPROVAL'){//未审批
		if(thsp_permission == 'Y'){
			resLink+='<a href="javascript:void(0);" onclick="approvalMethod(\''+data.id+'\',\'APPROVALED\',\'退货单-审批\');">审批</a>';
		}
		
		if(edit_permission == 'Y'){
			resLink+='|<a href="javascript:void();" onclick="editBackGoods(\''+data.id+'\');">编辑</a>';
		}
		return resLink;
	}else if(status == 'APPROVALED'){//已审批
		if(qrth_permission == 'Y'){
			return '<a href="javascript:void(0);" onclick="approvalMethod(\''+data.id+'\',\'RETURNGOODS\',\'退货单-确认退货\');">确认退货</a>';
		}
		
	}else if(status == 'RETURNGOODS'){//确认退货
		return '';
	}else if(status == 'PAYED'){//已打款
		return '';
	}else if(status == 'RECEIVABLES'){//已收款
		return '';
	}else if(status == 'REJECTED'){//已驳回
		return '<a href="javascript:void();" onclick="editBackGoods(\''+data.id+'\');">重新提交</a>';
	}
	return '';
}
//审批页面
function approvalMethod(id,type,title){
		var url = base + "/ebstorage/backgoods/approval?id="+id+"&approvalType="+type;
		var flag = true;
		var dlg = art.dialog.open(url,{
			 title:title,
			 lock:true,
			 width:$list_editWidth,
			 height:$list_editHeight,
			 id:"editOutOrder",
			 button:[{name:'同意',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(dlg);
					}
					return false;
				}},{name:'驳回',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.rejectApproval(dlg);
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

//编辑退货单
function editBackGoods(id){
	var url = base + "/ebstorage/backgoods/edit?id="+id;
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title:'编辑退货单',
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"editOutOrder",
		 button:[{name:'保存',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(dlg);
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

//回车查询事件
document.onkeydown=function(e){
	var keyCode= ($.browser.msie) ? e.keyCode : e.which ;  
	if(keyCode == 13){ 
		if(isAllfocus("numberNo,suppliers")){
			searchData();
		}
    }
}

//function toAddBackGoods(){
//	var url = base + "/ebbase/backgoods/addBackGoods?instorageNo=RK20150826122316";
//	var flag = true;
//	var dlg = art.dialog.open(url,{
//		 title:'退货单录入',
//		 lock:true,
//		 width:'1002px',
//		 height:'750px',
//		 id:"editOutOrder",
//		 button:[{name:'保存',callback:function(){
//				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
//					dlg.iframe.contentWindow.saveEdit(dlg);
//				}
//				return false;
//			}},{name:'取消',callback:function(){
//				flag = false;
//				return true;
//			}}],
//		 close:function(){
//			 if(flag){
//				 refresh();
//			 }
//		 }
//	});
//}
