/**
 * 调拨单运算方案
 */
$list_editWidth="1050px";
$list_editHeight="550px";
var manager = '';
var enumData={BUY:'购买',PREBUY:'预购',ROBBUY:'抢购',FILLSEND:'补寄',VIPGOODS:'特卖'};
var enumStatus={ALREADYORDER:'已下单',ALREADYPAY:'已付款',ALREADDISTRIBUTION:'已配送',ALREADRECEIPT:'已收货',CHARGEBACKAPPLY:'退单申请',
	ALREADCHARGEBACK:"已退单",ALREADCANCEL:"已取消"};

var removeGridRows=[];//踢单 list
var insertGridRows=[];//插单list
var storage_ligerComboBox;
var partner_ligerComboBox;
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	
	$("#reverseSearch").on("click",function(){
		var checked=$("#reverseSearch").attr("checked");
		if (checked=='checked') {
			$("#calcType").val("NO");
		}else {
			$("#calcType").val("YES");
		}
		searchData();
	});
	
	$("#import").on("click", function(){
		var checkde = $("#import").is(":checked");
		if(checkde) {
			$("#importData").val("YES");
		} else {
			$("#importData").val("NO");
		}
		searchData();
	});
	
	/**
	 * 选择 显示 合伙人
	 */
	$("#selectPartnerBox").on("click", function(){
		if($("#selectPartnerBox").is(":checked")) {
			$("#selectPartner").val("YES");
			$("#partnerTagLi").fadeIn();
		} else {
			$("#partnerTagLi").fadeOut();
			$("#selectPartner").val("NO");
		}
	});
	
	/**
	 * 查询 踢单列表
	 */
	$("#showRemoveBtn").click(function(){
		showSpecialOrder('remove');
	});
	/**
	 * 查询 插单列表
	 */
	$("#showInsertBtn").click(function(){
		showSpecialOrder('insert');
	});
	 /**
	  * 镇仓 选择插件
	  */
	 storage_ligerComboBox=$('#storageLongNumber').ligerComboBox({ isShowCheckBox: true, isMultiSelect: true,
	        data: [], valueFieldID: 'storagelnValue',selectBoxWidth:160,selectBoxHeight:260,onSelected:function(){
	        	loadHCData();
	        }
	 });
	 /**
	  * 合仓选择插件
	  */
	 partner_ligerComboBox=$('#partnerTag').ligerComboBox({ isShowCheckBox: true, isMultiSelect: true,
	        data: [], valueFieldID: 'partnerValue',selectBoxWidth:240,selectBoxHeight:260
	 });
		//加载地址数据的方法
	loadLigerComboBoxData();
	/**
	 * 订单号，定单类型，支付时间，定单状态，商品条码，商品名称，规格型号，单位，数量，收货地址，配送分店，负责人
	 */
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '踢/插单', name: 'delivery', align: 'center',  width: 100, isSort:false, render:tidanChadan},        
         {display: '订单号', name: 'orderNo', align: 'center',  width: 120, isSort:false, render:renderOrder},
         {display: '订单类型', name: 'buyTypeEnum', align: 'center',  width: 80, isSort:false, render:enumRender},
         {display: '支付时间', name: 'payTimeStr', align: 'center',  width: 160, isSort:false},
         {display: '订单状态', name: '', align: 'center',  width: 80, isSort:false,render:renderStatus},
         {display: '商品条码', name: 'detail.goods.barCode', align: 'left',  width: 150, isSort:false},
         {display: '商品名称', name: 'detail.goods.name', align: 'left',  width: 120, isSort:false},
         {display: '规格型号', name: 'detail.goods.specifications', align: 'center',  width: 120, isSort:false},
         {display: '单位', name: 'detail.goods.unit', align: 'center',  width: 80, isSort:false},
         {display: '数量', name: 'detail.num', align: 'center',  width: 80, isSort:false},
         {display: '收货地址', name: 'addressInfo', align: 'left',  width: 260, isSort:false},
         {display: '配送分店', name: 'storage.name', align: 'left',  width: 140, isSort:false},
         {display: '负责人', name: 'storage.person.name', align: 'center',  width: 80, isSort:false}
		],
        width:"99%",
        url:getPath() + '/ebsite/outorderfollow/batchOrderfilterData'
    }));

	var params2 ={};
	params2.width = 300;
	params2.fmtEndDate = true;
	params2.dateFmt = 'yyyy/MM/dd HH:mm:ss';
	params2.inputTitle = "支付时间";	
	MenuManager.common.create("DateRangeMenu","payDate",params2);
});

function enumRender(rowData,rowIndex,value){
	return enumData[value];
}

/**
 * 进入踢单选择页面
 */
function excludingOrder() {
	art.dialog.data("removeOrderBackFun",removeOrderBackFun);
	var dlg = art.dialog.open(getPath() + '/ebsite/outorderfollow/showInsertOrder?width='+$("#width").val() + '&height='+$("#height").val(), {
		title : '踢单',
		lock : true,
		width : $("#width").val(),
		height : $("#height").val(),
		id : 'showInsertOrder',
		button : [{name : '确认', callback : function(){
			this.iframe.contentWindow.clickRemoveSureBtn();
			return true;
		}},{name : '关闭', callback : function(){
			return true;
		}}]
	});
}

/**
 * 踢单回调函数
 * @param resList
 */
function removeOrderBackFun(resList){
	$.each(resList,function(index,obj){
		var flag=true;
		$.each(removeGridRows,function(idx,old){
			if(old.id == obj.id){
				flag=false;
				return false;
			}
		});
		if(flag){
			obj.delivery='remove';
			removeGridRows.push(obj);
		}
	});
	art.dialog.tips("添加踢单成功!",1.5);
    $("#showRemoveBtn").click();
}

/**
 * 插单 回调方法  
 * @param resList
 */
function insertOrderBackFun(resList){
	$.each(resList,function(index,obj){
		var flag=true;
		$.each(insertGridRows,function(idx,old){
			if(old.id == obj.id){
				flag=false;
				return false;
			}
		});
		if(flag){
			obj.delivery='insert';
			insertGridRows.push(obj);
		}
	});
	art.dialog.tips("添加插单成功!",1.5);
    $("#showInsertBtn").click();
}


/**
 * 查询踢单 or 插单
 * @param type
 */
function showSpecialOrder(type){
	clearGrid();
	if(type == 'remove'){
		$.each(removeGridRows,function(i,obj){
			var _obj=JSON.parse(JSON.stringify(obj));
			
			delete _obj.__id;
			delete _obj.__index;
			delete _obj.__nextid;
			delete _obj.__previd;
			delete _obj.__status;
			$list_dataGrid.addRow(_obj);
		});
	}
	
	if(type == 'insert'){
		$.each(insertGridRows,function(i,obj){
			var _obj=JSON.parse(JSON.stringify(obj));
			
			delete _obj.__id;
			delete _obj.__index;
			delete _obj.__nextid;
			delete _obj.__previd;
			delete _obj.__status;
			$list_dataGrid.addRow(_obj);
		});
	}
}

/**
 * 清空grid
 */
function clearGrid(){
	$.each($list_dataGrid.rows,function(){
		$list_dataGrid._deleteData(this);
	});
	$list_dataGrid.reRender();
}

function tidanChadan(data,index,value){
	var resStr='';
	if(value.indexOf('remove') != -1){
		resStr+='<font color="red">踢单</font> ';
	}
	
	if(value.indexOf('insert') != -1){
		resStr+='<font color="#24B200">插单</font> ';
	}
	return resStr;
}

/**
 * 进入 插单  页面 
 */
function insertOrder(){
	art.dialog.data("insertOrderBackFun",insertOrderBackFun);
	var dlg = art.dialog.open(getPath() + '/ebsite/outorderfollow/showInsertOrder?width='+$("#width").val() + '&height='+$("#height").val(), {
		title : '插单',
		lock : true,
		width : $("#width").val(),
		height : $("#height").val(),
		id : 'showInsertOrder',
		button : [{name : '确认', callback : function(){
			this.iframe.contentWindow.clickSureBtn();
			return true;
		}},{name : '关闭', callback : function(){
			return true;
		}}]
	});
}
//订单状态
function renderStatus(data){
	return enumStatus[data.status];
}
//显示订单详情
function renderOrder(data){
	return '<a href="javascript:showDetail(\''+data.id+'\');">'+data.orderNo+'</a>';
}

function showDetail(id){
	var dlg = art.dialog.open(getPath() + '/ebsite/order/showDetail/'+id,
			{title:'订单细节',
			 lock:true,
			 width:$("#width").val(),
			 height:$("#height").val(),
			 id:'showDetail',
			 button:[{name:'关闭'}]
			});
}

function searchData() {
	var queryStartDate = MenuManager.menus["payDate"].getValue().timeStartValue;
	var queryEndDate = MenuManager.menus["payDate"].getValue().timeEndValue;

	//是否是反向查询
	
	 var calcType=$("#calcType").val(); 
	 $list_dataParam['calcType'] = calcType;
	 
	 var importData = $("#importData").val();
	 $list_dataParam['importData'] = importData;
	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['payStart'] = queryStartDate;
	} else {
		delete $list_dataParam['payStart'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['payEnd'] = queryEndDate;
	} else {
		delete $list_dataParam['payEnd'];
	}
	//订单购买类型
	$list_dataParam['buyTypeEnum'] = $("#buyTypeEnum").val();
	//收货地址  镇分仓
	$list_dataParam['storagelnValue'] = $("#storagelnValue").val();
	$list_dataParam['selectPartner'] = $("#selectPartner").val();
	$list_dataParam['partnerValue'] = $("#partnerValue").val();
	//商品id
	var goodsId=$("#goodsId").val();
	 if (goodsId!='') {
		 $list_dataParam['goodsId'] = goodsId;
	}else {
		delete $list_dataParam['goodsId'];
	}
	resetList();
}

function reverseSearchBtn(){//反向查询的列表
	$("#calcType").val("NO");
	searchData();
}

/**
 * 运算当前条件的  订单
 */
function calcFilter(dlg){
	currentDialog = dlg;
	setRemoveInsertIds();
	dialogButton(currentDialog,true);
	var queryStartDate = MenuManager.menus["payDate"].getValue().timeStartValue;
	var queryEndDate = MenuManager.menus["payDate"].getValue().timeEndValue;
	$("#payStart").val(queryStartDate);
	$("#payEnd").val(queryEndDate);
	var buyTypeEnum=$("#buyTypeEnum").val();//购买类型
	var storageLongNumber=$("#storageLongNumber").val();//镇分仓 长编码
	var _confirm="";
	if(isNotNull(buyTypeEnum)){
		_confirm+="购买类型:"+enumData[buyTypeEnum]+",";
	}
	if($("#selectPartnerBox").is(":checked")){//选择  合伙人仓库 过滤
		if(isNotNull($("#partnerTag").val())){
			_confirm+="收货地址为 "+$("#partnerTag").val()+",";
		}
	}else{
		if(isNotNull(storageLongNumber)){
			_confirm+="收货地址为 "+storageLongNumber+",";
		}
	}
	if(isNotNull(queryStartDate)){
		_confirm+="支付开始时间:"+queryStartDate+",";
	}
	if(isNotNull(queryEndDate)){
		_confirm+="支付结束时间:"+queryEndDate+",";
	}
	if($("#calcType").val() == 'YES'){//计算当前条件的订单
		_confirm="确定用 当前"+_confirm+"方案运算?"
	}else{//不计算当前条件的订单
		_confirm="确定排除 当前"+_confirm+"方案运算?"
	}
	
	art.dialog.confirm(_confirm,function(){
		$.post(getPath()+'/ebsite/outorderfollow/initFollow',$('form').serialize(),function(res){
			if(res.STATE == 'SUCCESS'){
				art.dialog.tips(res.MSG);
				art.dialog.close();
			}else{
				art.dialog.confirm(res.MSG,function(){
					dialogButton(currentDialog,false);
				},function(){
					dialogButton(currentDialog,false);
				});
			}
		},'json');
	},function(){
		dialogButton(currentDialog,false);
	});
}

/**
 * 设置  踢单 & 插单 ids 至表单提交
 */
function setRemoveInsertIds(){
	var _rids="";
	$.each(removeGridRows,function(){
		_rids+=this.id+",";
	});
	$("#excludingOrderIds").val(_rids);
	var _iids="";
   $.each(insertGridRows,function(){
	   _iids+=this.id+",";
	});
   $("#insertOrderIds").val(_iids);
}

/**
 * 按钮禁用
 * @param dlg dialog对象
 * @param flag 禁用or启用
 */
function dialogButton(dlg,flag){
	if(dlg){
		dlg.button({name:"开始运算",disabled:flag});
		dlg.button({name:"关闭",disabled:flag});
	}
}
/**
 * 排除当前条件的订单 进行运算
 */
function excludeCalcFilter(dlg){
	$("#calcType").val("NO");
	calcFilter(dlg);
}

/**
 * 加载镇仓数据
 */
function loadLigerComboBoxData(){
	var url=getPath() + '/ebsite/outorderfollow/getTownStorageList?getTown=YES'
	$.post(url,{},function(res){
		if (res.storageList!=null){
			var dataList=[];
              for ( var int = 0; int < res.storageList.length; int++) {
				var one={};
				one.text=res.storageList[int].name;
				one.id=res.storageList[int].orgLongNumber;
				dataList.push(one);
			}
           storage_ligerComboBox.setData(dataList);
		}
	},'json');
}

/**
 * 加载合仓数据
 */
function loadHCData(){
	var url=getPath() + '/ebsite/outorderfollow/getTownStorageList?storagelnValue='+$("#storagelnValue").val();
	$.post(url,{},function(res){
		if (res.storageList!=null){
			var dataList=[];
              for ( var int = 0; int < res.storageList.length; int++) {
				var one={};
				one.text=res.storageList[int].name;
				one.id=res.storageList[int].orgLongNumber;
				dataList.push(one);
			}
           partner_ligerComboBox.setData(dataList);
		}
	},'json');
}

//function 

/**
 * 导出
 */
function exportData(){
	var param="";
	
	var queryStartDate = MenuManager.menus["payDate"].getValue().timeStartValue;
	var queryEndDate = MenuManager.menus["payDate"].getValue().timeEndValue;

	//是否是反向查询
	
	 var calcType=$("#calcType").val();
	 
	 param+="calcType="+calcType;
	//查询开始时间
	 param+="&queryStartDate="
	if(queryStartDate != ""){
		param+=queryStartDate;
	}
	//查询结束时间
	 param+="&queryEndDate="
	if(queryEndDate != ""){
		 param+=queryEndDate;
	}
	//订单购买类型
	 var buyTypeEnum= $("#buyTypeEnum").val()
	  param+="&buyTypeEnum="
	 if (buyTypeEnum!='') {
		  param+=buyTypeEnum;
	}
	//收货地址  镇分仓
	 var storagelnValue=$("#storagelnValue").val();
	 param+="&storagelnValue="
	 if (storagelnValue!='') {
		 param+=storagelnValue;
	}
	//商品id
		var goodsId=$("#goodsId").val();
		 param+="&goodsId=";
		 if (goodsId!='') {
			 param+=goodsId;
		}
	window.location.href=base+"/ebsite/outorderfollow/exportExcelData?"+param;
}
/**
 * 导入
 */
function importBatchOrderFilter(){
	var flag = true;
	var url= base+"/ebsite/outorderfollow/importBatchOrderFilter";
	var dlg = art.dialog.open(url, {
		title : '导入',
		lock : true,
		width:'635px',
		height:'130px',
		id:"importBatchOrderFilter",
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
				if($("#import").is(":checked")){
					searchData();
				}else{
					$("#import").attr("checked",true);
					$("#importData").val("YES");
					searchData();
				}
			}
		}
	});
}
function onEmpty(){
	 delete $list_dataParam['calcType'];
	 delete $list_dataParam['payStart'];
	 delete $list_dataParam['payEnd'];
	 delete $list_dataParam['buyTypeEnum'];
	 delete $list_dataParam['goodsId'];
	//收货地址  镇分仓
	 delete $list_dataParam['storagelnValue'];
	 $("#calcType").val("");
	 $("#buyTypeEnum").val("");
	 $("#storagelnValue").val("");
	 $("#storageLongNumber").val("");
	 $("#goodsId").val("");goodsNumber
	 $("#goodsNumber").val("");
	 MenuManager.menus["payDate"].resetAll();
		searchData();
}
function autoGoods(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
	searchData();
}