$list_editUrl = getPath() + "/ebbase/goods/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebbase/goods/add";// 新增url
$list_deleteUrl = getPath() + "/ebbase/goods/delete";// 删除url
$list_editWidth = (window.screen.width  * 58 /100) +"px" ;
$list_editHeight =(window.screen.height * 53 /100)+"px";
$list_dataType = "商品列表";// 数据名称
$(document).ready(
		function() {
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [
                        {
                        	
	                     display: '操作', 
	                     name: 'operate', 
	                     align: 'center',
	                     width: 160,
	                     render:operateRender
	                     }, {  
								display : '名称',
								name : 'name', 
								align : 'center',
								width : 60
	                     }, {  
								display : '供应商',
								name : 'provideExt.name', 
								align : 'center',
								width : 60
	                     },{
							display : '商品编号',
							name : 'number',
							align : 'center',
							width : 130
						},{
							display : '状态',
							name : 'status.name',
							align : 'center',
							width : 60
						},{
							display : '条形码',
							name : 'barCode',
							align : 'center',
							width : 130
						},{
							display : '原条形码',
							name : 'barcodesource',
							align : 'center',
							width : 130
						},{
							display : '零售价',
							name : 'salePrice',
							align : 'center',
							width : 100
						},{
							display : '优惠价',
							name : 'favorablePrice',
							align : 'center',
							width : 100
						},{
							display : '简拼',
							name : 'simplePinyin',
							align : 'center',
							width : 100
						},{
							display : '标题1',
							name : 'promoteDesc1',
							align : 'center',
							width : 100
						},{
							display : '标题2',
							name : 'promoteDesc2',
							align : 'center',
							width : 100
						}, {
							display : '商品类目',
							name : 'goodsCategory.name',
							align : 'center',
							width : 100
						}, {
							display : '送货类型',
							name : 'sendTypeStr',
							align : 'center',
							width : 100,
							render:function(data){
								if(data.sendTypeStr){
								return sendTypeStrList[data.sendTypeStr];}else{
									return "";
								}
							}
						}, {
							display : '计量单位',
							name : 'unit',
							align : 'center',
							width : 150
						}, {
							display : '规格',
							name : 'specifications',
							align : 'center',
							width : 100
						},{
							display : '有效期/天',
							name : 'shelfLife',
							align : 'center',
							width : 100
						},/*{
							display : '库存',
							name : 'occupyCount',
							align : 'center',
							width : 100
						},
						,{
							display : '入库价',
							name : 'factoryPrice',
							align : 'center',
							width : 150
						}
						{
							display : '库存上限',
							name : 'topLimit',
							align : 'center',
							width : 100
						},{
							display : '库存下限',
							name : 'lowerLimit',
							align : 'center',
							width : 150
						},*/
						{
							display : '库存',
							name : 'shelfLife',
							align : 'center',
							width : 100,
							render:function(data){
                            return 	parseInt(data.ableCount);
							}
						},
						{
							display : '导入号',
							name : 'importRecord.number',
							align : 'center',
							width : 150
						},{
							display : '录入人',
							name : 'creator.name',
							align : 'center',
							width : 100
						},{
							display : '录入时间',
							name : 'createTime',
							align : 'center',
							width : 150
						},{
							display : '上架人',
							name : 'shelvesPerson.name',
							align : 'center',
							width : 100
						},{
							display : '上架时间',
							name : 'shelvesTime',
							align : 'center',
							width : 150
						},{
							display : '下架人',
							name : 'offShelvesPerson.name',
							align : 'center',
							width : 100
						},{
							display : '下架时间',
							name : 'offShelvesTime',
							align : 'center',
							width : 150
						},{
							display : '售卖类型',
							name : 'saleType.name',
							align : 'center',
							width : 100
						}
						],
						delayLoad : true,
				         checkbox:true,
						url : getPath() + '/ebbase/goods/listData'
					}));
			var params ={};
			params.width = 260;
			params.inputTitle = "录入时间";	
			MenuManager.common.create("DateRangeMenu","createdate",params);
			
			var param ={};
			param.width = 260;
			param.inputTitle = "上架时间";	
			MenuManager.common.create("DateRangeMenu","shelvesdate",param);
			
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
			console.log(1-1==0?1:0);
		});



/**
 * 清空按钮
 */
function initClearBtn(){
	
	$("#addBtn").bind("click",function(){
		addRow({});
	});
	
	$("#importMannager").bind("click",function(){
		importMannager();
	});
	$("#printBarCode").bind("click",function(){
		printBarCode();
	});
	$("#resetBtn").bind("click",function(){
		$("#goodsCategoryId").val("");
		$("#goodsCategoryName").val("商品类目");
		$("#provideId").val("");
		$("#provideName").val("供应商");
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		$("#importNumber").val($("#importNumber").attr("defaultValue"));
		$("#sendTypeEnum").val("");
		$("#saleTypeStr option:first").prop("selected", 'selected');
		$("#sendTypeStr option:first").prop("selected", 'selected');
		MenuManager.menus["createdate"].resetAll();
		MenuManager.menus["shelvesdate"].resetAll();
		$("#saleType").val('');
		$("#startPrice").val('');
		$("#endPrice").val('');
		searchData();
	});
	/*inputEnterSearch("searchKeyWord",searchData);
	inputEnterSearch("importNumber",searchData);*/
	document.onkeydown =function(event){ enterSearch(event)};
}


function innitCount(param){
	$.post(base+'/ebbase/goods/getCountByStatus',param,function(res){
		var obj = res[0];
		if(obj==null){
			$("#tab em").each(function(){	
				$("#ALL").html("(0)(不包含已删除)");				
			    $(this).html("(0)");			  
			})	
		}else{
			var total = 0;
			for(var i in obj){
				$("#"+i).html("("+obj[i]+")");
				total+=parseInt(obj[i]);
			}			
			$("#ALL").html("("+total+")(不包含已删除)");				
		}
	},'json');
  
	$.ajax({
	   type: "POST",
	   url: base+"/ebbase/goods/getCountByStatusIsDelete",
	   dataType: "json",
	   data:param,
	   success: function(obj){
		   $("#ISDELETE1").html("("+obj+")");
	   }
	});
    
}


function operateRender(data, filterData) {
		var str ="";
		//打印条形码 add by lhh
		// str +='<a href="javascript:printBarCode({id:\''+ data.id + '\'});">打印条码</a>|';
		 if(data.status.value=='INPUT'){//已录入
			if(upDown == "Y"){
				str +='<a href="javascript:updateStatus(\''+ data.id + '\',\'SHELVES\');">上架</a>';
			}
			if(edit == "Y"){
				str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>';
			}
			if(del == "Y"){
				str +='|<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>';
			}
		}else if(data.status.value=='SHELVES'){//已上架
			if (data.saleType!=null) {//判断为空,否则取不到值
				if(data.saleType.value=="SALE")
					if(upDown == "Y"){
						str +='<a href="javascript:updateStatus(\''+ data.id + '\',\'OFFSHELVES\');">下架</a>';
					}
			}
		}else if ($.trim(data.status.value)=='ISDELETE') {//删除的商品的操作
			/*if(edit == "Y"){
				str +='<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>';
			}
			if(upDown == "Y"){
				str +='<a href="javascript:updateStatus(\''+ data.id + '\',\'SHELVES\');">|重新上架</a>';
			}*/
			//str +='<a href="javascript:void();">此商品已删除,不能操作</a>';
			str +='此商品已删除,不能操作';
		}
		else {//已下架
			str +='<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>|';
			if(upDown == "Y"){
				str +='<a href="javascript:updateStatus(\''+ data.id + '\',\'SHELVES\');">重新上架</a>';
			}
			str +='|<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>';
		}
	  if($.trim(data.status.value)!='ISDELETE'){
		 str +='|<a href="javascript:ask4modifyPrice({id:\''+ data.id + '\'});">调价申请</a>';
	  }
    return str;
}

/**打印条形码
 *  add by lhh
 */
function printBarCode(){
	/**
	 * 拼接选中商品数据ID
	 */
	var goodsIds='';
	if($list_dataGrid.getSelectedRows().length>0){
		for(var i=0;i<$list_dataGrid.getSelectedRows().length;i++){
			var obj=$list_dataGrid.getSelectedRows()[i];
			goodsIds+=obj.id+',';
		}
	}
	if (goodsIds=='') {
		art.dialog.tips("请选择商品!");
		 return false;
	}
	var url = base + "/ebbase/goods/printBarCode?goodsIds="+goodsIds;
	var flag = true;
	
	var dlg = art.dialog.open(url,{
		 title:'打印商品条形码',
		 lock:true,
		 width:'375px',
		 height:'auto',
		 id:"printBarCode",
		 button:[{name:'取消',callback:function(){
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
function importMannager(){
	var flag = false;
	var url= base+"/ebbase/importgoods/list"
	var dlg = art.dialog.open(url,
			{title:"导入管理",
			 lock:true,
			 width:'760px',
			 height:'500px',
			 id:"importMannager",
			 button:[{name:'关闭',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
			});
}
//上架，下架
function updateStatus(id,status){
	var param ={};
	param.id = id;
	param.status = status;
	var desc = "确定上架?";
	if(status=="SHELVES"){
		desc = "确定上架?";
	}else if(status=="OFFSHELVES"){
		desc = "确定下架?";
	}
		art.dialog.confirm(desc, function() {
			$.post(getPath()+"/ebbase/goods/upStatus",param,function(data){
				if(data.STATE=='SUCCESS'){
					art.dialog.tips(data.MSG);
					resetList();
					innitCount();
				}
			},'json');
			return true;
		}, function() {
			return true;
		});	
}
function searchData() {
	//创建时间
	var createTime_begin = "";
	var createTime_end = "";
	if(MenuManager.menus["createdate"]){
		createTime_begin = MenuManager.menus["createdate"].getValue().timeStartValue;
		createTime_end = MenuManager.menus["createdate"].getValue().timeEndValue;
	}
	if(createTime_begin != ""){
		$list_dataParam['createTime_begin'] = createTime_begin;
	} else {
		delete $list_dataParam['createTime_begin'];
	}
	if(createTime_end != ""){
		$list_dataParam['createTime_end'] = createTime_end;
	} else {
		delete $list_dataParam['createTime_end'];
	}
	
	//上架时间
	var shelvesTime_begin = "";
	var shelvesTime_end = "";
	if(MenuManager.menus["shelvesdate"]){
		shelvesTime_begin = MenuManager.menus["shelvesdate"].getValue().timeStartValue;
		shelvesTime_end = MenuManager.menus["shelvesdate"].getValue().timeEndValue;
	}
	if(shelvesTime_begin != ""){
		$list_dataParam['shelvesTime_begin'] = shelvesTime_begin;
	} else {
		delete $list_dataParam['shelvesTime_begin'];
	}
	if(shelvesTime_end != ""){
		$list_dataParam['shelvesTime_end'] = shelvesTime_end;
	} else {
		delete $list_dataParam['shelvesTime_end'];
	}
	//送达类型
/*	var sendTypeEnum = $("#sendTypeEnum").val();
	if (sendTypeEnum != "") {
		$list_dataParam['sendTypeEnum'] = sendTypeEnum;
	} else {
		delete $list_dataParam['sendTypeEnum'];
	}*/
	//送达类型
	var sendTypeStr = $("#sendTypeStr").val();
	if (sendTypeStr != "") {
		$list_dataParam['sendTypeStr'] = sendTypeStr;
	} else {
		delete $list_dataParam['sendTypeStr'];
	}
	//订单状态
	//if($("#tab").find("li.hover").attr("key") !=""){//点击全部还是记录了状态
		$list_dataParam['status']= $("#tab").find("li.hover").attr("key");
	//}	
	// 商品类目
	var goodsCategoryId = $("#goodsCategoryId").val();
	if (goodsCategoryId != "") {
		$list_dataParam['goodsCategoryId'] = goodsCategoryId;
	} else {
		delete $list_dataParam['goodsCategoryId'];
	}
	//供应商
	var provideId = $("#provideId").val();
	if (provideId != "") {
		$list_dataParam['provideExtId'] = provideId;
	} else {
		delete $list_dataParam['provideExtId'];
	}
	// 关键字
	var keyWord = $.trim($("#searchKeyWord").val());
	if (keyWord != ""&& keyWord != $("#searchKeyWord").attr("defaultValue")) {
	$list_dataParam['key'] = keyWord;
	} else {
	delete $list_dataParam['key'];
	}
	var importNumber = $.trim($("#importNumber").val());
	if (importNumber != ""&& importNumber != $("#importNumber").attr("defaultValue")) {
	$list_dataParam['importNumber'] = importNumber;
	} else {
	delete $list_dataParam['importNumber'];
	}
	// 价格区间
	var startPrice = $.trim($("#startPrice").val());
	var endPrice = $.trim($("#endPrice").val());
	var price = "";
	if(startPrice == endPrice && endPrice != ""){
		$list_dataParam['price'] = startPrice;
	}else{
		// 查询开始价格
		if(startPrice != ""){
			$list_dataParam['startPrice'] = startPrice;
		} else {
			delete $list_dataParam['startPrice'];
		}
		// 查询结束价格
		if(endPrice != ""){
			$list_dataParam['endPrice'] = endPrice;
		} else {
			delete $list_dataParam['endPrice'];
		}
		delete $list_dataParam['price'];
	}
	//售卖类型
	var saleType = $("#saleTypeStr").val();
	if(saleType != ''){
		$list_dataParam['saleType'] = saleType;
	} else {
		delete $list_dataParam['saleType'];
	}
	resetList();
	innitCount($list_dataParam);
}

function enterSearch(e) {
	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}
/**
 * 导出
 */
function importList(){
	var param = "";
	//创建时间
	var createTime_begin = "";
	var createTime_end = "";
	var createTime = ""
	if(MenuManager.menus["createdate"]){
		createTime_begin = MenuManager.menus["createdate"].getValue().timeStartValue;
		createTime_end = MenuManager.menus["createdate"].getValue().timeEndValue;
	}
	if(createTime_begin == createTime_end){
		createTime = createTime_begin;
		createTime_begin = "";
		createTime_end = "";
	}
	//上架时间
	var shelvesTime_begin = "";
	var shelvesTime_end = "";
	var shelvesTime = "";
	if(MenuManager.menus["shelvesdate"]){
		shelvesTime_begin = MenuManager.menus["shelvesdate"].getValue().timeStartValue;
		shelvesTime_end = MenuManager.menus["shelvesdate"].getValue().timeEndValue;
	}
	if(shelvesTime_begin == shelvesTime_end){
		shelvesTime = shelvesTime_begin;
		shelvesTime_begin = "";
		shelvesTime_end = "";
	}
	//送达类型
	var sendTypeEnum = $("#sendTypeEnum").val();
	//订单状态
	var status = "";
	if($("#tab").find("li.hover").attr("key") !=""){
		status= $("#tab").find("li.hover").attr("key");
	}	
	// 商品类目
	var goodsCategoryId = $("#goodsCategoryId").val();
	// 关键字
	var keyWord = $("#searchKeyWord").val();
	if(keyWord == "编号/名称/标题/条形码"){
		keyWord = "";
	}
	var importNumber = $("#importNumber").val();
	if(importNumber == "导入号"){
		importNumber = "";
	}
	var saleType = $("#saleType").val();
	// 价格区间
	var startPrice = $("#startPrice").val();
	var endPrice = $("#endPrice").val();
	
	param += "createTime_begin=" + createTime_begin;
	param += "&createTime_end=" + createTime_end;
	param += "&createTime=" + createTime;
	param += "&shelvesTime_begin=" + shelvesTime_begin;
	param += "&shelvesTime_end=" + shelvesTime_end;
	param += "&shelvesTime=" + shelvesTime;
	param += "&sendTypeEnum=" + sendTypeEnum;
	param += "&status=" + status;
	param += "&goodsCategoryId=" + goodsCategoryId;
	param += "&keyWord=" + keyWord;
	param += "&importNumber=" + importNumber;
	param += "&saleType=" + saleType;
	param += "&startPrice=" + startPrice;
	param += "&endPrice=" + endPrice;
	var  queryJson= JSON.stringify($list_dataParam);//add by hyl
	window.location.href=base+"/ebbase/goods/exportExcel?queryJson="+queryJson;
}

//调价申请

function ask4modifyPrice(data){
	var param = {};
	param.goodsId = data.id
	$.post(base+'/ebbase/modiPrice4goods/getCountByStatus',param,function(res){
		var obj =  res[0];
		if(obj&&obj["SAVE"]>0){
			art.dialog.tips("该商品正在调价中,不能再次提交");
		}else{
			after_ask4modifyPrice(data)
		}
		},'json');
	
}

function after_ask4modifyPrice(data){
	var $list_ask4modifyPriceUrl = base+"/ebbase/modiPrice4goods/add"
	paramStr = '?goodsId='+data.id;
	var flag = false;
	var dlg = art.dialog.open($list_ask4modifyPriceUrl+paramStr,
	{
		id : "ask4modifyPrice",
		title : '申请调价',
		background : '#333',
		width : 800,
		height : 250,
		lock : true,
		button:[{name:'确定',callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
				dlg.iframe.contentWindow.saveEdit(dlg);
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