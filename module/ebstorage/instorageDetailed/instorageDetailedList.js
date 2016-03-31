/**
 * 交易信息
 */

$list_editWidth="1050px";
$list_editHeight="550px";
var keyValue = "商品名称/商品编码/条形码";
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
			{display: '入库单号', name: 'number', align: 'center', width:150,render:viewRender},
			{display: '入库仓库', name: 'inStorage.storage.name', align: 'center', width:120},
			{display: '入库类型', name: 'inStorage.inStorageTypeName', align: 'center', width:80},
			{display: '状态', name: 'inStorage.inStorageStatusName', align: 'center', width:100},
			{display: '入库时间', name: 'inStorage.formatApprDate2', align: 'center', width:140,dateFormat:"yyyy-MM-dd HH:mm:ss",formatters:"date"},
			{display: '供应商', name: 'inStorage.provideExt.name', align: 'center', width:120},
			{display: '质检员', name: 'inStorage.quality.name', align: 'center', width:100},
			{display: '商品名称', name: 'goods.name', align: 'center', width:150},
			{display: '商品编号', name: 'goods.number', align: 'center', width:150},
			{display: '条形码', name: 'goods.barCode', align: 'center', width:150},
			{display: '规格型号', name: 'goods.specifications', align: 'center', width:100},
			{display: '入库价', name: 'inStoragePrice', align: 'center', width:100},
			{display: '入库数量', name: 'actArriveCount', align: 'right', width:60},
			{display: '计量单位', name: 'goods.unit', align: 'right', width:60},
			{display: '总价', name: 'total', align: 'right', width:60}
        ],
        url:getPath()+"/ebstorage/instorageDetailedList/inStorageList",
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	viewInstorageDetail(rowData.inStorage);
        }
    }));
	var params ={};
	params.width = 210;
	params.inputTitle = "入库日期";	
	MenuManager.common.create("DateRangeMenu","actArriveDate",params);

	$("#serchBtn").click(function(){
		selectList();
	});
	//清除
	$("#clearData").click(function(){
//		MenuManager.menus["registerDate"].resetAll();
		delete $list_dataParam['keyWord'];	
		delete $list_dataParam['inStorageStatus'];	
		MenuManager.menus["actArriveDate"].resetAll();
		$("#keyWord").attr("value", keyValue);
		$("#inStorageStatus").val("");
		MenuManager.common.resetAll();
		selectList();
	});
	
	//回车操作
	inputEnterSearch("keyWord",selectList);
});

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
	
	var keyWord= $("#keyWord").val();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	
	var inStorageStatus= $("#inStorageStatus").val();
	if(inStorageStatus ){
		$list_dataParam['inStorageStatus'] = inStorageStatus;
	} else{
		delete $list_dataParam['inStorageStatus'];
	}
	resetList();
}

//导出的方法
function importList(){
	var param = "";

	var keyWord= $("#keyWord").val();
	var inStorageStatus= $("#inStorageStatus").val();
	//创建时间
	var actArriveTime_begin = "";
	var actArriveTime_end = "";
	if(MenuManager.menus["actArriveDate"]){
		actArriveTime_begin = MenuManager.menus["actArriveDate"].getValue().timeStartValue;
		actArriveTime_end = MenuManager.menus["actArriveDate"].getValue().timeEndValue;
	}

	if(keyWord != '' && keyWord != '商品名称/商品编码/条形码'){
		param+="keyWord="+keyWord;
	}
	param+="&inStorageStatus="+inStorageStatus;
	param+="&actArriveTime_begin="+actArriveTime_begin;
	param+="&actArriveTime_end="+actArriveTime_end;
	
	window.location.href=base+"/ebstorage/instorageDetailedList/exportExcel?"+param;
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function viewRender(data,filterData){
	var str='';
	str+='<a href="javascript:viewInstorageDetail({id:\''+data.inStorage.id+'\'});">' + data.number + '</a>';
	return str;	
}

function phoneRender(data,filterData){
	var str='';
	str+=data.provideExt.crashContract + "/" + data.provideExt.contractPhone;
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
			}},{name:'关闭',callback:function(){
				return true;
		}
			}]
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
		 width:'1020px',
		 height:'560px',
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
		 width:'1020px',
		 height:'600px',
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
		 width:'1002px',
		 height:'600px',
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
