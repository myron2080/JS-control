$(document).ready(function(){
	if($(".scrollContent>tr").length==0){
		//addItem();
	}
	$(".addProLink").click(function(){
		addItem();
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
		importExcelData();
	});
	
	$("td").each(function(){
		if(typeof($(this).attr("key")) == 'undefined'){
			$(this).css({
				"background-color":"#f1f1f1"
			});
		}
	});
});


//导入商品 回调函数
function importBackFun(res){
	if(res.length>0){
		res.forEach(function(obj,index){
			addItem(obj);
		});
//		caclTotal(null);//总金额 全部重新计算
	}

}

/**
 * 调拨仓库 选择 回调函数
 * @param data
 * @param sourceObj
 */
function autoOutStorage(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
	//将明细中所有 清除
	removeAllItem();
}

//清除
function removeAllItem(){
	$(".scrollContent").html("");
	addItem(null);
}
/**
 * 商品自动补全 验证 是否已选中 调拨仓库
 */
function checkOutStorage(){
	if(!isNotNull($("#outStorageId").val())){
		art.dialog.tips("请先选择调拨仓库!",1.7);
		return false;
	}
	return true;
}


//导入商品
function importExcelData(){
	if(!checkOutStorage()){
		return;
	}
	/*if (!isNotNull($("#storageId").val())) {
		art.dialog.tips("请选择收货仓!");
		return
	}*/
	var flag = false;
	art.dialog.data("importBackFun",importBackFun);
	art.dialog.data("loadClose",Loading.close);
	var url= base+"/ebstorage/instorageList/importExcelData?type=OUTSTORAGE&storageId="+$("#outStorageId").val();
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

//自动补全 插件 点击 关闭 回调方法
function goodsAutoClose(sourceObj){
	goodsFoucsOut(sourceObj);
}

//商品自动补全  失去焦点fun
function goodsFoucsOut(obj){
	var input=$(obj).parents("td").find("input[key='auto_input']");
	input.hide();
	$(obj).parents("td").find("span").text(input.val()).show();
}

//添加调拨单明细
function addItem(data){
	var item=$("#cloneTr").clone();
	item.find("#goodsNumber").attr("autocomp","{id:'autoInventoryGoods',type:1,tagId:'autoId[id]',backFun:'autoGoods',closeFun:'goodsAutoClose',afterFilter:'checkOutStorage',paramKey:'outStorageId'}");
	item.removeAttr("id");
	if(null != data){//赋值
		var len = $("input[value='" + data.goodsId + "']").length;
		if(len>0){//该商品已经 存在 
			return false;
		}
		item.find("#goodsId").val(data.goodsId);
		item.find("#goodsId").parents("td").find("span").text(data.goodsNumber);
		item.find("#goodsNumber").val(data.goodsNumber);

		
		item.find("#goodsName").text(data.goodsName);
		item.find("#barCode").text(data.barCode);
		item.find("#specifications").text(data.specifications);
		item.find("#unit").text(data.unit);
		
//		item.find("#price").parents("td").find("span").text(data.outprice);//调拨单价
//		item.find("#price").val(data.outprice);
		
		item.find("#outCount").parents("td").find("span").text(data.outcount);//调拨数量
		item.find("#outCount").val(data.outcount);
		
//		item.find("#getCount").parents("td").find("span").text(data.actcount);//实收数量
//		item.find("#getCount").val(data.actcount);//实收数量
		
		item.find("#faultDesc").parents("td").find("span").text(data.description);//描述
		item.find("#faultDesc").val(data.description);//
//		inventoryAvailableOne(item);
//		caclOneTr(item);
	}
	$(".scrollContent").append(item);
	item.fadeIn();
	AutoComp.init();
}

//删除明细
function deleteItem(obj){
	if($(".scrollContent>tr").length>=1){
		$(obj).parents("tr").remove();
	}/*else{
		art.dialog.tips("请至少保留一条商品信息",1.5);
	}*/
}

/**
 * 选择分店
 * @param data
 * @param sourceObj
 */
function autoStorage(data,sourceObj){
	$("#storageName").val($(data).attr("name"));
	$("#storageLongNumber").val($(data).attr("longnumber"));
}

function autoPerson(data,sourceObj){
	$("#personName").val($(data).attr("name"));
}



/**
 * 加载单个Or全部 库存可用数量方法
 * @param obj
 */
function commonInventoryAvail(obj){
	if(null != obj){//加载单个子项
		inventoryAvailableOne($(obj).parents("tr"));
	}else{
		$(".scrollContent tr").each(function(){
			inventoryAvailableOne(this);
		});
	}
}

/**
 * 加载库存可用数量
 * @param obj
 */
function inventoryAvailableOne(obj){
	var goodsId=$(obj).find("#goodsId").val();//商品id
	var storageId=$("#zcStorageId").val();//仓库id
	if(isNotNull(goodsId) && isNotNull(storageId)){
		$.post(base+'/ebstorage/inventory/queryInventoryOne',{goodsId:goodsId,storageId:storageId},function(res){
			if(null != res){
				$(obj).find("#inventoryAvailable").val(res.ableCount);
				$(obj).find("#inventoryAvailable_span").text(res.ableCount);
			}
		},'json');
	}
}


/**
 * 选择商品 回调函数
 * @param data
 */
function autoGoods(data,sourceObj){
	var parent=$(sourceObj).parents("tr");
	parent.find("input[name='goodsId']").val(data.id);
    var len=$(".scrollContent").find("input[value='"+data.id+"']").length;
    if(len > 1){//已选择 该 商品
    	art.dialog.tips("该商品已选择!",2);
    	$(sourceObj).val("");
    	parent.find("input[name='goodsId']").val("");
        parent.find("#goodsName").text("");
        parent.find("#specifications").text("");
        parent.find("#unit").text("");
    	return;
    }
    parent.find("input[name='goodsNumber']").val($(data).attr("number"));
    parent.find("#goodsName").text($(data).attr("name"));
    parent.find("#barCode").text($(data).attr("barCode"));
    parent.find("#specifications").text($(data).attr("specifications"));
    parent.find("#unit").text($(data).attr("unit"));
    goodsFoucsOut(sourceObj);
    commonInventoryAvail(sourceObj);

}

/**
 * 保存
 */
function saveEdit(dlg){
	if($(".scrollContent>tr").length==0){
		art.dialog.tips("请至少选择一条商品信息!",1.7);
		return;
	}
	currentDialog = dlg;
	dialogButtor(currentDialog,true);
	var jsonStr = "[";
	var flag = true;
	
	if(!isNotNull($("#outStorageId").val())){
		art.dialog.tips('请选择调拨仓库！');
		flag = false;
		dialogButtor(currentDialog,false);
		return false;
	}
	
	
	if(!isNotNull($("#storageId").val())){
		art.dialog.tips('请选择收货仓库！');
		flag = false;
		dialogButtor(currentDialog,false);
		return false;
	}
	
	if($("#outStorageId").val() == $("#storageId").val()){
		art.dialog.tips("调出仓库和调入仓库一样!",1.5);
		flag = false;
		dialogButtor(currentDialog,false);
		return false;
	}
	
	$(".scrollContent tr").each(function(index,doc){
		var goodsId = $(doc).find('input[name="goodsId"]').val();
		var goodsNumber= $(doc).find('input[name="goodsNumber"]').val();
		var goodsName=$(doc).find('#goodsName').text();//商品名称
		var unit=$(doc).find('#unit').text();
		var barCode=$(doc).find('#barCode').text();
		var outCount = parseInt($(doc).find('input[name="outCount"]').val());
		var faultDesc =$(doc).find('input[name="faultDesc"]').val();
		
		if(!isNotNull(goodsId)){
			art.dialog.tips('请选择商品！',1.5);
			flag = false;
			return false;
		}
		
		if(!isNotNull(goodsNumber)){
			art.dialog.tips('请选择商品！',1.5);
			flag = false;
			return false;
		}
		
		if(!outCount || outCount <= 0){
			art.dialog.tips('请填写调拨数量！',1.5);
			flag = false;
			return false;
		}
		
		jsonStr+="{";
		jsonStr+="\"goods\":{\"id\":\""+goodsId+"\",";
		jsonStr+="\"name\":\""+goodsName+"\",";
		jsonStr+="\"unit\":\""+unit+"\"},";
		jsonStr+="\"outCount\":\""+outCount+"\",";
		jsonStr+="\"faultDesc\":\""+faultDesc+"\",";
		jsonStr+="\"barCode\":\""+barCode+"\",";
		jsonStr +="},";
	});
	if(jsonStr.indexOf(",")!=-1){
		jsonStr=jsonStr.substring(0,jsonStr.length-1);
	}
	jsonStr+="]";
	jsonStr.replace("undefined","");
	if(flag){
		$('#goodsDetailStr').val(jsonStr);
		$.post(base + "/ebstorage/out/save",$('form').serialize(),function(res){
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
	}else{
		dialogButtor(currentDialog,false);
		return false;
	}
	return false;
}

/**
 * 按钮禁用
 * @param dlg dialog对象
 * @param flag 禁用or启用
 */
function dialogButtor(dlg,flag){
	if(dlg){
		dlg.button({name:"取消",disabled:flag});
		dlg.button({name:"保存",disabled:flag});
	}
}


/**
 * 选择收货人之前  判断是否已选择  收货仓库
 * @returns {Boolean}
 */
function checkStorage(){
	if(!isNotNull($("#storageId").val())){
		art.dialog.tips('请先选择收货分店！');
		return false;
	}
	return true;
}

/**
 * 计算单个tr数据
 * @param parent
 */
function caclOneTr(parent){
	var outCount=parseFloat(parent.find("input[name='outCount']").val());//调拨数量
	var getCount = parseFloat(parent.find("input[name='getCount']").val());//实收数量
	var price = parseFloat(parent.find("input[name='price']").val());//单价

	if(outCount && getCount){
		if(getCount>outCount){//实际数量大于调拨数量
			getCount=outCount;
			parent.find("input[name='getCount']").val(outCount);
			parent.find("input[name='getCount']").parents("td").find("span").text(outCount);
			parent.find("#faultRate").parents("td").find("span").text("0%");
			parent.find("#faultRate").val("0%");
		}else{//计算损坏率
			var _res=(((outCount-getCount)/outCount)*100).toFixed(2)+"%";
			parent.find("#faultRate").val(_res);
			parent.find("#faultRate").parents("td").find("span").text(_res);
		}
	}
	
	if(outCount == 0){
		parent.find("#faultRate").val("0%");
		parent.find("#faultRate").parents("td").find("span").text("0%");
	}
	
	if(outCount != 0 && getCount ==0){
		parent.find("#faultRate").val("100%");
		parent.find("#faultRate").parents("td").find("span").text("100%");
	}
	
	
	if(getCount && getCount>0 && price && price >0){
		var _total=getCount * price.toFixed(2);
		parent.find("#totalPrice").val(_total);
		parent.find("#totalPrice").parents("td").find("span").text(_total);
	}else{
		parent.find("#totalPrice").val(0);
		parent.find("#totalPrice").parents("td").find("span").text(0);
	}
}

function caclTotal(obj){
	var parent=$(obj).parents("tr");
	
	caclOneTr(parent);
}

