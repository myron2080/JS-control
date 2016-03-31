$(document).ready(function(){
	if($(".scrollContent>tr").length==0){
		addItem();
	}
	$(".addProLink").click(function(){
		addItem();
	});
	$("input[id*='barCode']").focus(function(){
		if(!checkStorage()){
			$("#provideExtName").select();
		}
	});
	//鼠标点击 可编辑状态
	$(".scrollContent").delegate("td[key='edit_td']","click",function(){
		$(this).find("span").hide();
		$(this).find("input[key='edit_input']").show().focus();
	}); 
	$("td[key='edit_td']").each(function(){
		$(this).attr("title","点击编辑");
	});
	$(".scrollContent").delegate("td[key='edit_td']","focusout",function(){
		var input=$(this).find("input[key='edit_input']");
		$(this).find("span").text(input.val()).show();
		input.hide();
	}); 
	
	//鼠标点击 可编辑状态
	$(".scrollContent").delegate("td[key='edit_auto']","click",function(){
		
		$(this).find("span").hide();
		$(this).find("input[key='auto_input']").show().focus();
	}); 
	$("td[key='edit_auto']").each(function(){
		$(this).attr("title","点击编辑");
	});
	//导入商品
	$(".importProLink").click(function(){
		getInstorageExcelData();
	});
	//加载所有商品
	$(".loadAllGoods").click(function(){
		afterSelectSupplier();
	});
	//加载所有商品
	$(".clearAll").click(function(){
		removeAllItem();
	});
	$(".clearUnContent").click(function(){
		removeUnContent();
	});
});

/**
 * 移除  未输入 信息 的tr
 * @returns
 */
function removeUnContent(){
	$(".scrollContent tr").each(function(){
		var flag=false;
		if(!isNotNull($(this).find("#goodsId").val())){
			flag=true;
		}
		if(!isNotNull($(this).find("#goodsNumber").val())){
			flag=true;
		}
		if(!isNotNull($(this).find("#barCode").val())){
			flag=true;
		}
		if(!isNotNull($(this).find("#arriveCount").val())){
			flag=true;
		}
		if(!isNotNull($(this).find("#inStoragePrice").val())){
			flag=true;
		}
		if(flag){
			$(this).fadeOut(function(){
				$(this).remove();
			});
		}
	});
}

//导入完 数据 执行 回调函数
function importBackFun(res){
	if(res.length>0){
		res.forEach(function(obj,index){
			addItem(obj);
		});
		caclTotal(null);//总金额 全部重新计算
	}
}

/**
 * 将导入的 excel信息 附加到 页面
 * @param res
 */


function getInstorageExcelBack(res){
	var count=0;
	if(res.length>0){
		res.forEach(function(obj,index){
			if (addItemParam(obj)) {
				count++;
			}
		});
		caclTotal(null);//总金额 全部重新计算
	}
	art.dialog.tips("导入成功"+count+"条,"+"失败"+parseInt(res.length-count)+"条");
}

//删除所有
function removeAllItem(){
	$(".scrollContent").html("");//清空所有
}

function addItemParam(data){
	var flag=false;
	var barCode;
	$(".scrollContent tr").each(function(){
		barCode=$(this).find("#barCode").val();
		if(data.barCode == barCode){
			flag=true;
			$(this).find("#arriveCount").parents("td").find("span").text(data.shouldCount);
			$(this).find("#arriveCount").val(data.shouldCount);//应收数量
			
			$(this).find("#price").parents("td").find("span").text(data.price);
			$(this).find("#price").val(data.price);//单价
			
			$(this).find("#actArriveCount").parents("td").find("span").text(data.actCount);
			$(this).find("#actArriveCount").val(data.actCount);//实收数量
			
			$(this).find("#inStoragePrice").parents("td").find("span").text(data.instoragePrice);
			$(this).find("#inStoragePrice").val(data.instoragePrice);//入库单价
		}
	});
	return flag;
}

//导入 入库 数据 2015-11-18
function getInstorageExcelData(){
	var flag = false;
	var provideExtName=$("#provideExtName").val();
	if (provideExtName=='') {
		 art.dialog.tips("供应商不能为空");
	}else{
	art.dialog.data("getInstorageExcelBack",getInstorageExcelBack);
	art.dialog.data("loadClose",Loading.close);
	var url= base+"/ebstorage/instorageList/getInstorageExcelData"
	var dlg = art.dialog.open(url,
			{title:"商品批量导入",
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
}


//导入商品
function importExcelData(){
	var flag = false;
	art.dialog.data("importBackFun",importBackFun);
	art.dialog.data("loadClose",Loading.close);
	var url= base+"/ebstorage/instorageList/importExcelData?type=INSTORAGE"
	var dlg = art.dialog.open(url,
			{title:"商品批量导入",
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


//商品自动补全  失去焦点fun
function goodsFoucsOut(obj){
	var input=$(obj).parents("td").find("input[key='auto_input']");
	input.hide();
	$(obj).parents("td").find("span").text(input.val()).show();
}

function autoGoods(data,sourceObj){
	var parent=$(sourceObj).parents("tr");
	parent.find("#goodsId").val(data.id);
	$("#goodsAuto").val("");
	$(sourceObj).val($(data).attr("number"));
	var len = $("input[value='" + data.id + "']").length;
	if(len > 1){
		$(sourceObj).val("");
		parent.find("input[name='goodsId']").val("");
		art.dialog.tips('该商品已经选择!');
		return;
	}else{
		parent.find("#goodsName").text($(data).attr("name"));
		parent.find("#specifications").text($(data).attr("specifications"));
		parent.find("#unit").text($(data).attr("unit"));
		parent.find("#barCode_span").text($(data).attr("barCode"));
		parent.find("#barCode").val($(data).attr("barCode"));
		goodsFoucsOut(sourceObj);
	}
}

//自动补全div关闭回调函数
function goodsAutoClose(sourceObj){
	goodsFoucsOut(sourceObj);
}




function addItem(data){
	var item=$("#cloneTr").clone();
	item.find("#goodsNumber").attr("autocomp","{id:'goodsAuto',type:1,width:'145px',tagId:'goodsAuto[id]',backFun:'autoGoods',afterFilter:'checkStorage',closeFun:'goodsAutoClose'}");
	item.removeAttr("id");
	if(null != data){//赋值
		var len = $("input[value='" + data.goodsId + "']").length;
		if(len>0){//该商品已经 存在 
			return false;
		}
		item.find("#goodsId").val(data.goodsId);
		item.find("#goodsId").parents("td").find("span").text(data.goodsNumber);
		item.find("#goodsNumber").val(data.goodsNumber);

		item.find("#barCode").parents("td").find("span").text(data.barCode);
		item.find("#barCode").val(data.barCode);
		
		
		item.find("#goodsName").text(data.goodsName);
		item.find("#specifications").text(data.specifications);
		
		item.find("#unit").text(data.unit);
		item.find("#arriveCount").parents("td").find("span").text(data.shouldCount);
		item.find("#arriveCount").val(data.shouldCount);//应收数量
		
		item.find("#price").parents("td").find("span").text(data.price);
		item.find("#price").val(data.price);//单价
		
		item.find("#actArriveCount").parents("td").find("span").text(data.actCount);
		item.find("#actArriveCount").val(data.actCount);//实收数量
		
		item.find("#inStoragePrice").parents("td").find("span").text(data.instoragePrice);
		item.find("#inStoragePrice").val(data.instoragePrice);//入库单价
	}
	$(".scrollContent").append(item);
	item.fadeIn();
	AutoComp.init();
}
//删除明细
function deleteItem(obj){
	if($(".scrollContent>tr").length>1){
		$(obj).parents("tr").remove();
	}else{
		art.dialog.tips("请至少保留一条商品信息",1.5);
	}
}

/**
 * 选择收货人之前  判断是否已选择  收货仓库
 * @returns {Boolean}
 */
function checkStorage(){
	if(!isNotNull($("#provideExtId").val())){
		art.dialog.tips('请先选供应商！');
		return false;
	}
	return true;
}


function saveEdit(dlg){
	currentDialog = dlg;
	var jsonStr = "[";
	var flag = true;
	
	if(!isNotNull($("#storageId").val())){
		art.dialog.tips('请选中仓库！');
		flag = false;
		return false;
	}
//	if(!isNotNull($("#inStorageType").val())){
//		art.dialog.tips('请选择入库类型！');
//		flag = false;
//		return false;
//	}
	
	if(!isNotNull($("#provideExtId").val())){
		art.dialog.tips('请选择供应商！');
		flag = false;
		return false;
	}
	
	if(!isNotNull($("#arriveDate").val())){
		art.dialog.tips('请填写应到日期！');
		flag = false;
		return false;
	}
	
	if($("#description").val().length > 2000){
		art.dialog.tips('描述最多可以输入2000个字符！');
		flag = false;
		return false;
	}
	
	var allTotal = 0;
	if($(".scrollContent>tr").length == 0){
		art.dialog.tips("请至少保存一条商品明细!");
		return;
	}
	//遍历数据
	$(".scrollContent tr").each(function(){
		var goodsId = $(this).find('input[name="goodsId"]').val();
		var arriveCount = parseInt($(this).find('input[name="arriveCount"]').val());
		var inStoragePrice = parseFloat($(this).find('input[name="inStoragePrice"]').val());
		var total = parseFloat($(this).find('span[id="totalPrice"]').text());
		
		if(!isNotNull(goodsId)){
			art.dialog.tips('请选择商品！');
			flag = false;
			return false;
		}
		if(!arriveCount || arriveCount < 0){
			art.dialog.tips('请填写商品应收数量！');
			flag = false;
			return false;
		}
		
		
		if(!inStoragePrice || inStoragePrice <= 0){
			art.dialog.tips('请填写商品入库单价！');
			flag = false;
			return false;
		}
		
		allTotal = allTotal + total;

		jsonStr+="{";
		jsonStr+="\"goods\":{\"id\":\""+goodsId+"\"},";
		jsonStr+="\"arriveCount\":\""+arriveCount+"\",";
		jsonStr+="\"inStoragePrice\":\""+inStoragePrice+"\"";
		jsonStr +="},";
	});
	if(jsonStr.indexOf(",")!=-1){
		jsonStr=jsonStr.substring(0,jsonStr.length-1);
	}
	jsonStr+="]";
	jsonStr.replace("undefined","");
	if(flag){
		$('#goodsDetailStr').val(jsonStr);
		$('#total').val(allTotal);
		$.post(base + "/ebstorage/instorage/save",$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						content: res.MSG,
						time:1,
						close:function(){
							art.dialog.close();
						},
						width:200
					});
				}else{
					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');
	}
	if(currentDialog && flag){
		currentDialog.button({name:"取消",disabled:true});
		currentDialog.button({name:"保存",disabled:true});
	}
	return false;
}

function putGoodsInfo(obj){
	var barCode = $(obj).val();
	var provideExtId=$("#provideExtId").val();
	if(!isNotNull(provideExtId)){//没有选择供应商 不执行
		return;
	}
	var parent=$(obj).parents("tr");
	$.ajax({
		url:base+"/ebbase/goods/getGoodsByBarCode?random=" +  Math.round(Math.random()*100),
		dataType: "json",
		data: {barCode:barCode,provideExtId:$("#provideExtId").val()},
		success: function(res) {
			var data = res[0];
			if(null != data){
				var showFlag=true;
				var len = $(".scrollContent").find("input[value='" + data.id + "']").length;
				if(len >= 1){
					showFlag=false;
				}
				if(parent.find("#goodsId").val() == data.id){
					showFlag=true;
				}
				if(!showFlag){
					$(obj).val("");
					parent.find("input[name='goodsId']").val("");
					art.dialog.tips('同一种商品不可以重复！');
					return;
				}else{
					parent.find("#goodsName").text(data.name);
					parent.find("#specifications").text(data.specifications);
					parent.find("#unit").text(data.unit);
					parent.find("#goodsNumber").val(data.number);
					parent.find("#goodsNumber").parents("td").find("span").text(data.number);
					parent.find("input[name='goodsId']").val(data.id);
				}
			}
		}
	});
}

//选择供应商
function autoFun(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
	afterSelectSupplier();
}
//选择质检员 回调函数
function autoFunPerson(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
}


/**
 * 选择供应商
 * 找出该供应商所有商品
 */
function afterSelectSupplier(){
	if(!isNotNull($("#provideExtId").val())){
		art.dialog.tips("请先选择供应商!");
		return;
	}
	removeAllItem();
	$.post(base+'/ebstorage/instorageList/getGoodsByProvideId',{provideExtId:$("#provideExtId").val()},function(res){
		if(res.length>0){
			res.forEach(function(obj,index){
				addItem(obj);
			});
		}
	},'json');
}



/**
 * 计算总金额  
 * 入库页面已经没有 计算 总价 20151122 by qh.xu
 */
function caclTotal(obj){
//	if(null != obj){
//		var parent=$(obj).parents("tr");//找到tr
//		calcTotalOne(parent);
//	}else{
//		$(".scrollContent tr").each(function(){
//			calcTotalOne($(this));
//		});
//	}
}

function calcTotalOne(parent){
//	var actArriveCount = parseFloat(parent.find("input[name='actArriveCount']").val());
//	var inStoragePrice = parseFloat(parent.find("input[name='inStoragePrice']").val());
//	if(actArriveCount && actArriveCount>0 && inStoragePrice && inStoragePrice >0){
//		parent.find("#totalPrice").text((actArriveCount * inStoragePrice).toFixed(2));
//	}else{
//		parent.find("#totalPrice").text(0);
//	}
}


