/**
 * 交易信息
 */
$list_editWidth="1050px";
$list_editHeight="550px";
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$("#main").ligerLayout({});
	//加金额的查看的权限
	if (lookFactoryPrice_permission == 'Y') {
		$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
	        columns: [ 
	            {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender},
				{display: '入库单号', name: 'number', align: 'center', width:150,render:viewRender},
				{display: '批次号', name: 'outBatch.number', align: 'center', width:150},
				{display: '供应商', name: 'provideExt.name', align: 'center', width:120},
				{display: '入库仓库', name: 'storage.name', align: 'center', width:120},
				{display: '经办人/联系方式', name: 'data', align: 'center', width:180, render:phoneRender},
				{display: '入库类型', name: 'inStorageTypeName', align: 'center', width:80},
				{display: '类目数', name: 'categoryCount', align: 'right', width:60},
				{display: '质检员', name: 'quality.name', align: 'center', width:100},
				{display: '入库总价', name: 'total', align: 'right', width:60},
				{display: '应到日期', name: 'arrivDateeStr', align: 'center', width:140},
				{display: '创建时间', name: 'createTimeStr', align: 'center', width:140},
				{display: '实到日期', name: 'actArriveDateStr', align: 'center', width:140},
				{display: '入库时间', name: 'formatApprDate2', align: 'center', width:140},
				{display: '状态', name: 'inStorageStatusName', align: 'center', width:100},
				{display: '退货状态', name: 'backStatus', align: 'center', width:100, render:backStatusRender},
				{display: '初审信息', name: 'apprInfo', align: 'left', width:300,render:apprInfoRender},
				{display: '入库信息', name: 'apprInfo2', align: 'left', width:300,render:apprInfoRender2}
	        ],
	        url:getPath()+"/ebstorage/instorageList/inStorageList",
	        onDblClickRow:function(rowData,rowIndex,rowDomElement){
	        	viewInstorageDetail(rowData);
	        }
	    })); 
	}else{
		$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
	        columns: [ 
	            {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender},
				{display: '入库单号', name: 'number', align: 'center', width:150,render:viewRender},
				{display: '批次号', name: 'outBatch.number', align: 'center', width:150},
				{display: '供应商', name: 'provideExt.name', align: 'center', width:120},
				{display: '入库仓库', name: 'storage.name', align: 'center', width:120},
				{display: '经办人/联系方式', name: 'data', align: 'center', width:180, render:phoneRender},
				{display: '入库类型', name: 'inStorageTypeName', align: 'center', width:80},
				{display: '类目数', name: 'categoryCount', align: 'right', width:60},
				{display: '质检员', name: 'quality.name', align: 'center', width:100},
				{display: '应到日期', name: 'arrivDateeStr', align: 'center', width:140},
				{display: '创建时间', name: 'createTimeStr', align: 'center', width:140},
				{display: '实到日期', name: 'actArriveDateStr', align: 'center', width:140},
				{display: '入库时间', name: 'formatApprDate2', align: 'center', width:140},
				{display: '状态', name: 'inStorageStatusName', align: 'center', width:100},
				{display: '退货状态', name: 'backStatus', align: 'center', width:100, render:backStatusRender},
				{display: '初审信息', name: 'apprInfo', align: 'left', width:300,render:apprInfoRender},
				{display: '入库信息', name: 'apprInfo2', align: 'left', width:300,render:apprInfoRender2}
	        ],
	        url:getPath()+"/ebstorage/instorageList/inStorageList",
	        onDblClickRow:function(rowData,rowIndex,rowDomElement){
	        	viewInstorageDetail(rowData);
	        }
	    }));
	}
	var params ={};
	params.width = 210;
	params.inputTitle = "入库时间";	
	MenuManager.common.create("DateRangeMenu","actArriveDate",params);

	$("#serchBtn").click(function(){
		selectList();
	});
	//清除
	$("#clearData").click(function(){
		MenuManager.menus["actArriveDate"].resetAll();
		delete $list_dataParam['keyWord'];	
		delete $list_dataParam['inStorageStatus'];
		$("#storageId").val("");
		$("#storageName").val("");
		$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
		$("#inStorageStatus").val("");
		$("#inStorageTypeList").val("");
		selectList();
	});
	
	//回车操作
	inputEnterSearch("keyWord",selectList);
});

//选择仓库 回调函数
function autoStorage(data,sourceObj){
	selectList();
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	//创建时间
	var actArriveTime_begin = "";
	var actArriveTime_end = "";
	if(MenuManager.menus["actArriveDate"]){
		actArriveTime_begin = MenuManager.menus["actArriveDate"].getValue().timeStartValue;
		actArriveTime_end = MenuManager.menus["actArriveDate"].getValue().timeEndValue;
	}
	if(actArriveTime_begin != ""){
		$list_dataParam['actArriveTime_begin'] = actArriveTime_begin;
	} else {
		delete $list_dataParam['actArriveTime_begin'];
	}
	if(actArriveTime_end != ""){
		$list_dataParam['actArriveTime_end'] = actArriveTime_end;
	} else {
		delete $list_dataParam['actArriveTime_end'];
	}
	$list_dataParam['storageId']=$("#storageId").val();
	var keyWord= $.trim($("#keyWord").val());
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	
	var inStorageStatus=$.trim($("#inStorageStatus").val());
	if(inStorageStatus ){
		$list_dataParam['inStorageStatus'] = inStorageStatus;
	} else{
		delete $list_dataParam['inStorageStatus'];
	}
	
	var inStorageTypeList = $("#inStorageTypeList").val();
	if(inStorageTypeList){
		$list_dataParam['inStorageTypeList'] = inStorageTypeList;
	} else{
		delete $list_dataParam['inStorageTypeList'];
	}
	resetList();
}
//导入的方法
/*function importListExcel(){
	var dlg = art.dialog.open(base+"/ebstorage/instorageList/getInstorageExcelData",{
		title : "入库单导入",
		lock : true,
		width:'635px',
		height:'130px',
		id:"importInstorageExcel",
		button:[{name:"导入",callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveImportData){
				dlg.iframe.contentWindow.saveImportData(this);
			}
			return false;
		}},{name:'取消',callback:function(){
			return true;
		}}]
	});
}*/
//导出的方法
function importList(){
	var param = "";

	var keyWord= $.trim($("#keyWord").val());
	if(keyWord == $("#keyWord").attr("defaultValue")){
		keyWord="";
	}
	var storageId=$("#storageId").val();//仓库
	var inStorageStatus= $("#inStorageStatus").val();
	var inStorageTypeList =$("#inStorageTypeList").val();
	//创建时间
	var actArriveTime_begin = "";
	var actArriveTime_end = "";
	if(MenuManager.menus["actArriveDate"]){
		actArriveTime_begin = MenuManager.menus["actArriveDate"].getValue().timeStartValue;
		actArriveTime_end = MenuManager.menus["actArriveDate"].getValue().timeEndValue;
	}
	
	param+="keyWord="+keyWord;
	param+="&storageId="+storageId;
	param+="&inStorageStatus="+inStorageStatus;
	param+="&inStorageTypeList="+inStorageTypeList;
	param+="&actArriveTime_begin="+actArriveTime_begin;
	param+="&actArriveTime_end="+actArriveTime_end;
	window.location.href=base+"/ebstorage/instorageList/exportExcel?"+param;
}

/**
 * 渲染 退货状态
 * @param rowData
 */
function backStatusRender(rowData){
	var _backStatus=rowData.backStatus;
	if(_backStatus == 0){
		return '无退货';
	}else if(_backStatus == 1){
		return '部分退货';
	}else if(_backStatus == 2){
		return '已退货';
	}
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	var status = data.inStorageStatus;
	var str='';
	if(status == "NOAPPROVAL"){
		if(bianji_permission == 'Y'){
			str+='<a href="javascript:editInStorage(\'' + data.id + '\');">编辑 </a>';
		}
		if(bianji_permission == 'Y' && shenpi_permission == 'Y'){
			str+="| ";
		}
		if(shenpi_permission == 'Y'){
			str+='<a href="javascript:approve({id:\''+data.id+'\',inStorageStatus:\'APPROVALED\'});">审批 </a>';
		}
	}
	if(status == "APPROVALED"){
		if(ruku_permission == 'Y'){
			str+='<a href="javascript:approve({id:\''+data.id+'\',inStorageStatus:\'INSTORAGED\'});">入库 </a>';
		}
		/*if(turnshenpi_permission == "Y"){
			str+='<a href="javascript:turnApprove({id:\''+data.id+'\',inStorageStatus:\'APPROVALED\'});">反审核 </a>';
		}*/
	}
	
	if(status == "INSTORAGED" || status == 'GOOGSBACKING' || status == 'GOOGSBACKED'){
		if(tuihuo_permission == 'Y'){
			if(data.backStatus == 0 || data.backStatus == 1){//无退货 或者部分退货
				str+='<a href="javascript:toAddBackGoods(\''+data.id+'\');">退货 </a>';
			}
		}
		if(tuihuo_permission == 'Y' && special_permission == 'Y'){
			if(data.backStatus == 0 || data.backStatus == 1){//无退货 或者部分退货
				str+="| ";
			}
		}
		if(special_permission == 'Y'){
			str+='<a href="javascript:specialUpdate(\''+data.id+'\');">特改 </a>';
		}
		/*if(turnshenpi_permission == "Y"){
			str+='<a href="javascript:turnApprove({id:\''+data.id+'\',inStorageStatus:\'INSTORAGED\'});">反审核 </a>';
		}*/
	}
	
	if(status == "REJECTED"){
		if(bianji_permission == 'Y'){
			str+='<a href="javascript:editInStorage(\'' + data.id + '\');">重新提交</a>';
		}
	}
	return str;	
}

/**
 * 特改
 */
function specialUpdate(id){
	var title = "入库单-特改";
	var url = base + "/ebstorage/instorageList/specialUpdate/"+id;
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title: title,
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"specialUpdate",
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

function viewRender(data,filterData){
	var str='';
	str+='<a href="javascript:viewInstorageDetail({id:\''+data.id+'\'});">' + data.number + '</a>';
	return str;	
}

function phoneRender(data,filterData){
	var str='';
	if(data.provideExt){//不为空
		str+=data.provideExt.crashContract + "/" + data.provideExt.contractPhone;
	}else{
		str+='';
	}
	return str;	
}

function apprInfoRender(data,filterData){
	var str='';
	if(data.apprPerson && data.apprPerson.name){
		str+=data.apprPerson.name + "于" + data.apprDate + "日审核，备注：" + data.apprInfo;
	}
	return str;	
}

function apprInfoRender2(data,filterData){
	var str='';
	if(data.apprPerson2 && data.apprPerson2.name){
		str+=data.apprPerson2.name + "于" + data.apprDate2 + "日审核，备注：" + data.apprInfo2;
	}
	return str;	
}

function viewInstorageDetail(data){
	var url = getPath() + "/ebstorage/instorageList/viewInstorage?id=" + data.id;
	var dlg = art.dialog.open(url,{
		 title:"入库单查看",
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"viewInstorageDetail",
		 button:[{name:'打印',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printerInstorage){
					dlg.iframe.contentWindow.printerInstorage(dlg);
				}
				return false;
			}},{name:'导出',callback:function(){
				window.location.href=base+"/ebstorage/instorageList/viewInstorageExport?id=" + data.id;
				return false;
			}},{name:'关闭',callback:function(){
				return true;
		}}]
	});
}


function editInStorage(id){
	var title = "入库新增";
	var url = base + "/ebstorage/instorageList/add";
	if(id){
		title = "入库编辑";
		url = base + "/ebstorage/instorageList/edit?id=" + id;
	}
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title: title,
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"editInStorage",
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

/**
 * 反审核
 * @param data
 */
function turnApprove(data){
	art.dialog.tips("该功能暂时不可用...");
//	var _inStorageStatus = data.inStorageStatus == 'INSTORAGED' ? 'APPROVALED' : 'NOAPPROVAL'
//		art.dialog.confirm("确定要反审核操作吗?",function(){
//			$.post(getPath() +"/ebstorage/instorageList/turnApprove",{
//				id : data.id,
//				inStorageStatus : _inStorageStatus
//			},function(data){
//				art.dialog.tips(data.MSG);
//				if(data.STATE == "SUCCESS"){
//					refresh();
//				}
//			},"json");
//			return true;
//		} , function(){
//			return true;
//		});
}

function approve(data){
	var title = "审批";
	if(data.inStorageStatus == 'NOAPPROVAL'){
		title = "重新提交";
	}else if(data.inStorageStatus == 'APPROVALED'){
		title = "初级审批";
	}else if(data.inStorageStatus == 'INSTORAGED'){
		title = "入库审批";
	}else if(data.inStorageStatus == 'GOOGSBACKING'){
		title = "退货";
	}
	var url = getPath()+"/ebstorage/instorageList/toApproval?id=" + data.id + "&inStorageStatus=" + data.inStorageStatus;
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title:"入库审批",
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"instorageApproval",
		 button:[{name:'同意',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.agree){
					dlg.iframe.contentWindow.agree(dlg);
				}
				return false;
			}},{name:'不同意',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.disagree){
					dlg.iframe.contentWindow.disagree(dlg);
				}
				return false;
			}}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
}

//总仓退货入口
function toAddBackGoods(instorageId){
	var url = base + "/ebstorage/backgoods/addZCBackGoods?instorageId=" + instorageId;
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title:'退货单录入',
		 lock:true,
		 width: $list_editWidth,
		 height: $list_editHeight,
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
