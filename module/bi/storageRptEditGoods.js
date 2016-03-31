$list_editUrltui = getPath()+"/ebstorage/backgoods/edit";//编辑及查看url
$(document).ready(
	function (){
		$("#tableContainerin").show();
		$("#tableContainerout").hide();
		$list_dataGrid = $("#tableContainerin").ligerGrid($.extend($list_defaultGridParam,{
	        columns: [ 
				{display: '商品名称', name: 'goods.name', align: 'center', width:100},
				{display: '规格型号', name: 'goods.specifications', align: 'center', width:100},
				{display: '计量单位', name: 'goods.unit', align: 'right', width:100},
				{display: '应收数量', name: 'arriveCount', align: 'center', width:100},
				{display: '实收数量', name: 'actArriveCount', align: 'right', width:100},
				{display: '入库时间', name: 'inStorage.arrivDateeStr', align: 'center', width:140,dateFormat:"yyyy-MM-dd HH:mm:ss",formatters:"date"}
	        ],
	        url:getPath()+"/ebstorage/instorageDetailedList/inStorageList?goodId="+goodsId+"&actArriveTime_begin="+queryStartDate+"&actArriveTime_end="+queryEndDate,
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
	        url:getPath()+"/ebstorage/instorageDetailedList/inStorageList?goodId="+goodsId+"&actArriveTime_begin="+queryStartDate+"&actArriveTime_end="+queryEndDate,
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
		        url:getPath() + "/ebstorage/outDetailed/listData?goodId="+goodsId+"&outTime_begin="+queryStartDate+"&outTime_end="+queryEndDate,
		        onDblClickRow:function(rowData,rowIndex,rowDomElement){
		        	showdataDetail(rowData.out.id);
		        }
		    }));
			
			searchData();
	}
}
);


function backNumberLink(data){
	return '<a href="javascript:void(0);" onclick="showViewDataDetail(\''+data.id+'\');">'+data.number+'</a>';
}

function instorageLink(data){
	if(data.backGoodsType == 'PART_STORE'){//退货到供应商
		return '<a href="javascript:void(0);" onclick="viewInstorageDetailtui(\''+data.inStorage.id+'\');">'+data.inStorage.number+'</a>';
	}else if(data.backGoodsType == 'GENERAL_STORE'){//退货到总仓
		return '<a href="javascript:void(0);" onclick="outOrderNumberLink(\''+data.outOrder.id+'\');">'+data.outOrder.number+'</a>';
	}
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
				 width:(window.screen.width  * 47 /100)+'px',
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
				 width:(window.screen.width  * 47 /100)+'px',
				 height:(window.screen.height  * 40 /100)+'px',
				id:'调拨-VIEW',
				button:[{name:'关闭'}]}
		);
	}
	console.log("data");
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