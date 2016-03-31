$list_editUrl = getPath()+"/ebstorage/out/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebstorage/out/add";//新增url
$list_deleteUrl = getPath()+"/ebstorage/out/delete";//删除url
$list_editWidth="1050px";
$list_editHeight="550px";
$list_dataType = "调拨单" ;
var approveEnum={UNAPPROVE:'未审批',APPROVED:'已审批',REJECT:'已驳回',UNSEND:'未发货',SENT:'已发货',GOT:'已收货',SUBMITED:'已提交'};
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$(".graybtn").click(function(){//清空按钮
		MenuManager.menus["outdate"].resetAll();
		resetCommonFun("number,org,status");
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '调拨单号', name: 'out.number', align: 'center',  width: 140, isSort:false,render:nubmerLink},
         {display: '调出仓库', name: 'out.outStorage.name', align: 'center', width: 120, isSort:false},
         {display: '调入仓库', name: 'out.storage.name', align: 'center', width: 120, isSort:false},
         {display: '调拨时间', name: 'out.outTimeStr', align: 'center',  width: 160, isSort:false},
         {display: '负责人/联系方式', name: 'out.storage.person.name', align: 'center', width: 140, isSort:false},
         {display: '状态', name: 'out.stauts', align: 'center',  width: 60, isSort:false, render: rederStatus},
         {display: '商品名称', name: 'goods.name', align: 'center', width: 140, isSort:false},
         {display: '商品编码', name: 'goods.number', align: 'center', width: 140, isSort:false},
         {display: '规格型号', name: 'goods.specifications', align: 'center', width: 140, isSort:false},
         {display: '计量单位', name: 'goods.unit', align: 'center', width: 140, isSort:false},
         {display: '单价', name: 'price', align: 'center', width: 140, isSort:false},
         {display: '调拨数量', name: 'outCount', align: 'center', width: 140, isSort:false},
         {display: '实收数量', name: 'getCount', align: 'center', width: 140, isSort:false},
         {display: '总价', name: 'totalPrice', align: 'center', width: 140, isSort:false},
         {display: '损坏率', name: 'faultRate', align: 'center', width: 140, isSort:false},
         {display: '描述', name: 'faultDesc', align: 'center', width: 140, isSort:false},
         {display: '条形码', name: 'goods.barCode', align: 'center', width: 140, isSort:false}
		],
        width:"99%",
        enabledSort:true,
        url:getPath() + '/ebstorage/outDetailed/listData',
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	showdataDetail(rowData.out.id);
        }
    }));
	var params ={};
	params.width = 260;
	params.inputTitle = "调拨时间";	
	MenuManager.common.create("DateRangeMenu","outdate",params);
});
/**
 * 查询
 */
function searchData(){
	/*
	var key = $("#key").val();
	if(key == '号码/分配号码/mac地址'){
		key='';
	}
	$list_dataParam['key'] = key;
	$list_dataParam['state'] = $("#state").val();
	$list_dataParam['orgId'] = $("#orgId").val();
	*/
	//调拨时间
	var outTime_begin = "";
	var outTime_end = "";
	if(MenuManager.menus["outdate"]){
		outTime_begin = MenuManager.menus["outdate"].getValue().timeStartValue;
		outTime_end = MenuManager.menus["outdate"].getValue().timeEndValue;
	}
	
	if(outTime_begin != ""){
		$list_dataParam['outTime_begin'] = outTime_begin;
	} else {
		delete $list_dataParam['outTime_begin'];
	}
	if(outTime_end != ""){
		$list_dataParam['outTime_end'] = outTime_end;
	} else {
		delete $list_dataParam['outTime_end'];
	}
	
	var status=$("#status").val();
	if(status != ''){
		$list_dataParam['status'] = status;
	}else{
		delete $list_dataParam['status'];
	}
	var number=$("#number").val();
	if(number != '' && number != '商品名称/商品编码/条形码'){
		$list_dataParam['number'] = number;
	}else{
		delete $list_dataParam['number'];
	}
	resetList();
}

//导出的方法
function importList(){
	var param = "";

	var status=$("#status").val();
	var number=$("#number").val();
	var org=$("#outStorageId").val();
	
	//调拨时间
	var outTime_begin = "";
	var outTime_end = "";
	if(MenuManager.menus["outdate"]){
		outTime_begin = MenuManager.menus["outdate"].getValue().timeStartValue;
		outTime_end = MenuManager.menus["outdate"].getValue().timeEndValue;
	}
	
	param+="status="+status;
	if(number != '' && number != '商品名称/商品编码/条形码'){
		param+="&number="+number;
	}
	param+="&org="+org;
	param+="&outTime_begin="+outTime_begin;
	param+="&outTime_end="+outTime_end;
	
	window.location.href=base+"/ebstorage/outDetailed/exportExcel?"+param;
}


function nubmerLink(data){
	return '<a href="javascript:void()" onclick="showdataDetail(\''+data.out.id+'\')">'+data.out.number+'</a>';
}

function viewDataDetail(id){
	var data={id:id};
	
	viewRow(data);
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
					{title:getTitle('VIEW'),
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
/**
 * 返回 审批状态
 * @param data
 * @returns
 */
function renderEnum(data){
	return approveEnum[data.approveStatus];
}

/**
 * 返回 调拨单状态
 * @param data
 * @returns
 */
function rederStatus(data){
	return approveEnum[data.out.stauts];
}

function approveOutOrder(id){
	var flag = true;
	var dlg = art.dialog.open(base + "/ebstorage/out/approve?id=" + id,{
		 title:'审批调拨单',
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"approveOutOrder",
		 button:[{name:'同意',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(dlg);
				}
				return false;
			}},{name:'驳回',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.rejectOutOrder(dlg);
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
 * 新增/修改弹出页面
 */
function editOutOrder(id,title){
	var url = base + "/ebstorage/out/add";
	if(id){
		url = base + "/ebstorage/out/edit?id=" + id;
	}
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title:title,
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
		if(isAllfocus("number,org,status")){
			searchData();
		}
    }
}


