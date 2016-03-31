$list_editUrl = getPath() + "/ebbase/modiPrice4goods/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebbase/modiPrice4goods/add";// 新增url
$list_deleteUrl = getPath() + "/ebbase/modiPrice4goods/delete";// 删除url
$list_editWidth = "800px";
$list_editHeight = "300px";
$list_dataType = "调价列表";// 数据名称

$(document).ready(
		function() {
			params={};
			params.width = 260;
			params.inputTitle = "发起时间";	
			MenuManager.common.create("DateRangeMenu","createTime",params);
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						checkbox:true,
						columns : [
                        {
	                     display: '操作', 
	                     name: 'operate', 
	                     align: 'center',
	                     width: 120,
	                     render:operateRender},           
						{
							display : '申请编号',
							name : 'number',
							align : 'center',
							width : 120
						},{         
							display : '商品名',
							name : 'goods.name',
							align : 'center',
							width : 60
						},{         
							display : '商品编号',
							name : 'goods.number',
							align : 'center',
							width : 100
						},{         
							display : '条形码',
							name : 'goods.barCode',
							align : 'center',
							width : 100
						},{         
							display : '供应商',
							name : 'goods.provideExt.name',
							align : 'center',
							width : 60
						},{         
							display : '状态',
							name : 'modifyStatus.name',
							align : 'center',
							width : 60
						},{
							display : '发起人',
							name : 'creator.name',
							align : 'center',
							width : 150
						}, {
							display : '发起时间',
							name : 'createTime',
							align : 'center',
							width : 150
						}, {
							display : '审批人',
							name : 'approvePerson.name',
							align : 'center',
							width : 100
						},{
							display : '审批时间',
							name : 'approveTime',
							align : 'center',
							width : 150
						},{
							display : '原零售价',
							name : 'foreSalePrice',
							align : 'center',
							width : 100
						},{
							display : '现零售价',
							name : 'salePrice',
							align : 'center',
							width : 100
						},{
							display : '原优惠价',
							name : 'foreFavorablePrice',
							align : 'center',
							width : 100
						},{
							display : '现优惠价',
							name : 'favorablePrice',
							align : 'center',
							width : 100
						},{
							display : '审批意见',
							name : 'approveDesc',
							align : 'center',
							width : 250
						},{
							display : '描述',
							name : 'description',
							align : 'center',
							width : 400
						}
						],
						delayLoad : true,
						url : getPath() + '/ebbase/modiPrice4goods/listData',
						 onDblClickRow:function(rowData,rowIndex,rowDomElement){
							 _viewRow(rowData);
						    }
					}));
			//initDate();
			searchData();
		
			$("#searchBtn").click(function() {
				searchData();
			});
			
			$("#tab").find("li").click(function(){
				$(this).addClass("hover");
				$(this).siblings("li").removeClass("hover");
				searchData();
			});
			initClearBtn();
			
			/**
			 * 回车
			 */
			$("#searchKeyWord").on("keyup",function(event){
				if(event.keyCode == 13){
					searchData();
				}
			});

		});

/**
 * 清空按钮
 */
function initClearBtn(){
	$("#resetBtn").bind("click",function(){
		MenuManager.common.resetAll();
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		$("#provideName").val($("#provideName").attr("defaultValue"));
		$("#provideId").val("");
		$("#goodsName").val($("#goodsName").attr("defaultValue"));
		$("#goodsId").val("");
		searchData();
	});
}


//查看行
function _viewRow(rowData){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+rowData.id;
		}
		art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:$list_dataType+'-VIEW',
				button:[{name:'关闭'}]}
		);
	}
}

function innitCount(){
	$("#tab em").html('(0)');
	$.post(base+'/ebbase/modiPrice4goods/getCountByStatus',$list_dataParam,function(res){
	var obj =  res[0];
	var total = 0;
	for(var i in obj){
		$("#"+i).html("("+obj[i]+")");
		total+=parseInt(obj[i]);
	}
	$("#ALL").html("("+total+")");
	},'json');
}

function operateRender(data, filterData) {
		var str ="";
		if(data.modifyStatus.value=='SAVE'){//已提交
			if(canModify=="YES"){
			str +='<a href="javascript:approvalView(\''+ data.id + '\');">审批</a>';
			}
			//str +='<a href="javascript:approvalView(\''+ data.id + '\');">审批</a>';
		}
    return str;
}
function  approvalView(id){
	var $list_approval4modifyPriceUrl = base+"/ebbase/modiPrice4goods/edit";
	paramStr = '?id='+id+'&optionType=approval';
	var flag = false;
	var dlg = art.dialog.open($list_approval4modifyPriceUrl+paramStr,
	{
		id : "ask4modifyPrice",
		title : '申请调价',
		background : '#333',
		width : 800,
		height : 320,
		lock : true,
		button:[{name:'驳回',callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.approvalEdit){
				dlg.iframe.contentWindow.approvalEdit(dlg,"REJECTED");
			}
			flag = true;
			return false;
		}},{name:'审批',callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.approvalEdit){
				dlg.iframe.contentWindow.approvalEdit(dlg,"APPROVALED");
			}
			flag = true;
			return false;
		}},{name:'取消',callback:function(){
			flag = false;
			return true;
		}}],
		close:function(){
			if(flag){
				resetList();
			}
		}
	});

}


function searchData() {
	//console.log("start");
	//订单状态
	if($("#tab").find("li.hover").attr("key") !=""){
		console.log($("#tab").find("li.hover").attr("key"));
		$list_dataParam['modifyStatus']= $("#tab").find("li.hover").attr("key");
	}else{
		delete $list_dataParam['modifyStatus'];
	}	
	// 申请日期
	var queryStartDate = "";
	var queryEndDate = "";
	if (MenuManager.menus["createTime"]) {
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
    var queryTimeType ="createTime";
    delete $list_dataParam[queryTimeType+'_begin'];
    delete $list_dataParam[queryTimeType+'_end'];
	if (queryStartDate) {
		$list_dataParam[queryTimeType+'_begin'] = queryStartDate.replace(/\//g,"-")+" 00:00:00";
	} 
	if (queryEndDate) {
		$list_dataParam[queryTimeType+'_end'] = queryEndDate.replace(/\//g,"-")+" 23:59:59";
	}
	
	// 供应商
	var provideId = $("#provideId").val();
	if (provideId != "") {
		$list_dataParam['provideId'] = provideId;
	} else {
		delete $list_dataParam['provideId'];
	}
	
	// 商品
	var goodsId = $("#goodsId").val();
	if (goodsId != "") {
		$list_dataParam['goodsId'] = goodsId;
	} else {
		delete $list_dataParam['goodsId'];
	}
	// 关键字
	var keyWord = $("#searchKeyWord").val();
	keyWord = trim(keyWord);
	if (keyWord != ""&& keyWord != $("#searchKeyWord").attr("defaultValue")) {
		$("#searchKeyWord").val(keyWord);
	$list_dataParam['key'] = keyWord;
	} else {
	delete $list_dataParam['key'];
	}
	resetList();
	innitCount();
}
function trim(str){ //删除左右两端的空格 
	return str.replace(/(^\s*)|(\s*$)/g, ""); 
	} 
function enterSearch(e) {

	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}
function initDate(){
	var curdate = new Date();
	$("#createTime").html("日期:"+formatDate(curdate,"yyyy/MM/dd")+"-"+formatDate(curdate,"yyyy/MM/dd"));
	 MenuManager.menus["createTime"].setValue(formatDate(curdate,"yyyy/MM/dd"),formatDate(curdate,"yyyy/MM/dd"));
}
