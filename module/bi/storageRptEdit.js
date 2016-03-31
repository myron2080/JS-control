$list_editUrltui = getPath()+"/ebstorage/backgoods/edit";//编辑及查看url
var approveEnum={NOAPPROVAL:'未审批',APPROVALED:'已审批',REJECTED:'已驳回',RETURNGOODS:'确认退货',RECEIVABLES:'已收款',GENERAL_STORE:'退货到总仓',PART_STORE:'退货到供应商'};
$(document).ready(
	function (){

		$("#tableContainerin").show();
		$("#tableContainerout").hide();
		$("#tableContainerbo").hide();
		$("#tableContainertui").hide();
		$list_dataGrid = $("#tableContainerin").ligerGrid($.extend($list_defaultGridParam,{
	        columns: [ 
				{display: '商品名称', name: 'goods.name', align: 'center', width:100},
				{display: '规格型号', name: 'goods.specifications', align: 'center', width:100},
				{display: '计量单位', name: 'goods.unit', align: 'right', width:100},
				{display: '应收数量', name: 'arriveCount', align: 'center', width:100},
				{display: '实收数量', name: 'actArriveCount', align: 'right', width:100},
				{display: '入库时间', name: 'inStorage.arrivDateeStr', align: 'center', width:140,dateFormat:"yyyy-MM-dd HH:mm:ss",formatters:"date"}
	        ],
	        url:getPath()+"/ebstorage/instorageDetailedList/inStorageList?keyNumber="+storageName+"&actArriveTime_begin="+queryStartDate+"&actArriveTime_end="+queryEndDate,
	        onDblClickRow:function(rowData,rowIndex,rowDomElement){
	        	viewInstorageDetail(rowData.inStorage);
	        }
	    }));

		searchData();
	}
);


$("a").click(function(){
	var val = $(this).html();
	if(val=='入库明细'){
		$("#tableContainerin").show();
		$("#tableContainerout").hide();
		$("#tableContainerbo").hide();
		$("#tableContainertui").hide();
		$list_dataGrid="";
		$("#tab").find("li").click(function(){
			$(this).addClass("hover");
			$(this).siblings("li").removeClass("hover");
		});

		$list_dataGrid = $("#tableContainerin").ligerGrid($.extend($list_defaultGridParam,{
	        columns: [ 
				{display: '商品名称', name: 'goods.name', align: 'center', width:100},
				{display: '规格型号', name: 'goods.specifications', align: 'center', width:100},
				{display: '计量单位', name: 'goods.unit', align: 'right', width:100},
				{display: '应收数量', name: 'arriveCount', align: 'center', width:100},
				{display: '实收数量', name: 'actArriveCount', align: 'right', width:100},
				{display: '入库时间', name: 'inStorage.arrivDateeStr', align: 'center', width:140,dateFormat:"yyyy-MM-dd HH:mm:ss",formatters:"date"}
	        ],
	        url:getPath()+"/ebstorage/instorageDetailedList/inStorageList?keyNumber="+storageName+"&actArriveTime_begin="+queryStartDate+"&actArriveTime_end="+queryEndDate,
	        onDblClickRow:function(rowData,rowIndex,rowDomElement){
	        	viewInstorageDetail(rowData.inStorage);
	        }
	    }));
			searchData();
		
	}else  if(val=='出库明细'){
		$("#tableContainerout").show();
		$("#tableContainerin").hide();
		$("#tableContainerbo").hide();
		$("#tableContainertui").hide();
		$("#tab").find("li").click(function(){
			$(this).addClass("hover");
			$(this).siblings("li").removeClass("hover");

		});
			$list_dataGrid = $("#tableContainerout").ligerGrid($.extend($list_defaultGridParam,{
		        columns:[
		 		 {display: '商品名称', name: 'goods.name', align: 'center', width:100},
		         {display: '规格型号', name: 'goods.specifications', align: 'center', width: 100, isSort:false},
		         {display: '计量单位', name: 'goods.unit', align: 'center', width: 100, isSort:false},
		         {display: '实收数量', name: 'getCount', align: 'center', width: 100, isSort:false},
		         {display: '出库数量', name: 'outCount', align: 'center', width: 100, isSort:false},
		         {display: '出库时间', name: 'out.outTimeStr', align: 'center',  width: 160,dateFormat:"yyyy-MM-dd HH:mm:ss",formatters:"date"}
				],
		        width:"99%",
		        enabledSort:true,
		        url:getPath() + "/ebstorage/outDetailed/listData?keyNumber="+storageName+"&outTime_begin="+queryStartDate+"&outTime_end="+queryEndDate,
		        onDblClickRow:function(rowData,rowIndex,rowDomElement){
		        	showdataDetail(rowData.out.id);
		        }
		    }));
			
			searchData();
	}else if(val=='调拨明细'){

		$("#tableContainerin").hide();
		$("#tableContainerout").hide();
		$("#tableContainerbo").show();
		$("#tableContainertui").hide();
		$("#tab").find("li").click(function(){
			$(this).addClass("hover");
			$(this).siblings("li").removeClass("hover");

		});
		$list_dataGrid = $("#tableContainerbo").ligerGrid($.extend($list_defaultGridParam, {
			columns : [{
				display : '调拨编码',
				name : 'billNo',
				align : 'center',
				width : 130
			}, {
				display : '发货分店',
				name : '',
				align : 'center',
				width : 120,
				render:function(data){return data.fromStorage.name}
			}, {
				display : '申请人',
				name : 'provide.name',
				align : 'center',
				width : 100
			}, {
				display : '发货分店负责人/联系方式',
				name : '',
				align : 'center',
				width : 200,
				render:function(data){if(data.fromStorage != null && data.fromStorage.person != null){
					return data.fromStorage.person.name+'/'+data.fromStorage.person.phone;
					}else{
						return '';
					}
				}
			}, {
				display : '收货分店',
				name : '',
				align : 'center',
				width : 100,
				render:function(data){if(data.toStorage != null){return data.toStorage.name}else{return ''}}
			}, {
				display : '收货分店负责人/联系方式',
				name : '',
				align : 'center',
				width : 200,
				render:function(data){if(data.toStorage != null && data.toStorage.person != null){
						return data.toStorage.person.name+'/'+data.toStorage.person.phone;
					}else{
						return '';
					}
				}
			}, {
				display : '调拨备注',
				name : 'description',
				align : 'center',
				width : 150
			}, {
				display : '创建时间',
				name : 'createTime',
				align : 'center',
				width : 150
			}, {
				display : '审核信息',
				name : '',
				align : 'center',
				width : 180,
				render:function(data){if(data.approver != null ){
						return data.approver.privadeName+'于'+data.approveTime+'审核通过,备注:'+data.approveInfo;
					}else{
						return '';
					}
				}
			},
			{
				display : '确认收货信息',
				name : '',
				align : 'center',
				width : 180,
				render:function(data){
					if (data.confirmInfo!=null && data.confirmTime!=null && data.confirmorName!=null ) {
						return data.confirmorName+'于'+data.confirmTime+'确认收货,备注'+data.confirmInfo;
					} else{
						return '';
					}
				}
			}],
			url : getPath() + "/transferBill/listData?keyId="+storageId+"&createTime_begin="+queryStartDate+"&createTime_end="+queryEndDate,
			 onDblClickRow:function(rowData,rowIndex,rowDomElement){
		        	showdataDetailbo(rowData);
		        }
		}));
		searchData();
	}else if(val=='退货单明细'){
		//查询开始时间
		var queryStartDatetui="";
		var queryEndDatetui="";
		if(queryStartDate != ""){
			queryStartDatetui=queryStartDate;
			queryStartDatetui = queryStartDatetui.replace(/\//g,"-");
		}

		//查询结束时间
		if(queryEndDate != ""){
			queryEndDatetui=queryEndDate;
			queryEndDatetui = queryEndDatetui.replace(/\//g,"-");
		}
		$("#tab").find("li").click(function(){
			$(this).addClass("hover");
			$(this).siblings("li").removeClass("hover");

		});
		$("#tableContainerin").hide();
		$("#tableContainerout").hide();
		$("#tableContainerbo").hide();
		$("#tableContainertui").show();
		$list_dataGrid = $("#tableContainertui").ligerGrid($.extend($list_defaultGridParam,{
	        columns:[
	         
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
	        url:getPath() + "/ebstorage/backgoods/listData?keyId="+storageId+"&startTime="+queryStartDatetui+"&endTime="+queryEndDatetui,
	        onDblClickRow:function(rowData,rowIndex,rowDomElement){
	        	showViewDataDetail(rowData.id);
	        }
	    }));
		
	}
}
);


function backNumberLink(data){
	return '<a href="javascript:void(0);" onclick="showViewDataDetail(\''+data.id+'\');">'+data.number+'</a>';
}

function renderEnum(record, rowindex, value, column){
	return approveEnum[value];
}
function instorageLink(data){
	if(data.backGoodsType == 'PART_STORE'){//退货到供应商
		return '<a href="javascript:void(0);" onclick="viewInstorageDetailtui(\''+data.inStorage.id+'\');">'+data.inStorage.number+'</a>';
	}else if(data.backGoodsType == 'GENERAL_STORE'){//退货到总仓
		return '<a href="javascript:void(0);" onclick="outOrderNumberLink(\''+data.outOrder.id+'\');">'+data.outOrder.number+'</a>';
	}
}


//出库单详情页
function outOrderNumberLink(id){
		var dlg=art.dialog.open(getPath()+'/ebstorage/out/edit?VIEWSTATE=VIEW&id='+id,
				{title:'退货单-查看',
				lock:true,
				 width:(window.screen.width  * 57 /100)+'px',
				 height:(window.screen.height  * 40 /100)+'px',
				id:'退货单-VIEW',
				button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
						dlg.iframe.contentWindow.printer(dlg);
					}
					return false;
				}},{name:'关闭'}]}
		);
}
function showViewDataDetail(id){
	//可个性化实现
	if($list_editUrltui && $list_editUrltui!=''){
		var paramStr;
		if($list_editUrltui.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+id;
		}
		var dlg=art.dialog.open($list_editUrltui+paramStr,
				{

			 	title:"出库单查看",
				lock:true,
				 width:(window.screen.width  * 57 /100)+'px',
				 height:(window.screen.height  * 40 /100)+'px',
				id:'出库单-VIEW',
				button:[{name:'打印',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.printer){
						dlg.iframe.contentWindow.printer(dlg);
					}
					return false;
				}},{name:'关闭'}]}
		);
	}
}
function showdataDetailbo(data){
	var $list_editUrlbo= getPath() + '/transferBill/edit';
	if($list_editUrlbo && $list_editUrlbo!=''){
		var paramStr;
		if($list_editUrlbo.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+data.id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+data.id;
		}
		art.dialog.open($list_editUrlbo+paramStr,
				{title:"调拨-查看",
				lock:true,
				 width:(window.screen.width  * 57 /100)+'px',
				 height:(window.screen.height  * 40 /100)+'px',
				id:'调拨-VIEW',
				button:[{name:'关闭'}]}
		);
	}
}

function viewInstorageDetailtui(id){
	var url = getPath() + "/ebstorage/instorageList/viewInstorage?id=" + id;
	var dlg = art.dialog.open(url,{
		 title:"入库单查看",
		 lock:true,
		 width:(window.screen.width  * 57 /100)+'px',
		 height:(window.screen.height  * 40 /100)+'px',
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
function viewInstorageDetail(data){
	var url = getPath() + "/ebstorage/instorageList/viewInstorage?id=" + data.id;
	var dlg = art.dialog.open(url,{
		 title:"入库单查看",
		 lock:true,
		 width:(window.screen.width  * 57 /100)+'px',
		 height:(window.screen.height  * 40 /100)+'px',
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

function showdataDetail(id){
		//可个性化实现
	var paramStr;
	paramStr = '?VIEWSTATE=VIEW&id='+id;
			var dlg=art.dialog.open(getPath()+"/ebstorage/out/edit"+paramStr,
					{title:'出库单查看',
					lock:true,
					width:(window.screen.width  * 57 /100)+'px',
					height:(window.screen.height  * 40 /100)+'px',
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