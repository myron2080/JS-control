$(document).ready(function(){
	if($(".scrollContent>tr").length==0){
		addItem();
	}
	$(".addProLink").click(function(){
		addItem();
	});
	$("input[id*='goodsNumber']").focus(function(){
		if(!checkStr()){
			$("#fromStorageId").select();
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
});


function afterFilterStr(){
	var orgId=$('#fromStorageId').val();
	if(!orgId || orgId == ''){
		return false;
	}else{
		return true;
	}
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
		parent.find("#favorablePrice").text($(data).attr("favorablePrice"));
		//parent.find("#favorablePriceInput").val($(data).attr("favorablePrice"));
		parent.find("#maxInventoryCount").val($(data).attr("ableCount"));
		goodsFoucsOut(sourceObj);
	}
}

//自动补全div关闭回调函数
function goodsAutoClose(sourceObj){
	goodsFoucsOut(sourceObj);
}
/**
 * 选择货物之前必须选申请分店
 * @returns {Boolean}
 */
function checkStr(){
	$("#storageId").val($("#fromStorageId").val());
	if(!isNotNull($("#fromStorageId").val())){
		art.dialog.tips('请先选申请分店！');
		return false;
	}
	return true;
}

//仓库名称显示
function storageBackFun(data,sourceObj){
	$.each(data.attributes,function(i,ele){
		if(ele.name == "name" ){
			$(sourceObj).val(ele.value);
		}
	});
}

function addItem(data){
	var item=$("#cloneTr").clone();
	item.find("#goodsNumber").attr("autocomp","{id:'autoInventoryGoods',type:1,width:'145px',tagId:'goodsAuto[id]',backFun:'autoGoods',afterFilter:'checkStr',closeFun:'goodsAutoClose',paramKey:'storageId'}");
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
		
		item.find("#maxInventoryCount").val(data.ableCount);
		
		item.find("#price").parents("td").find("span").text(data.instoragePrice);
		item.find("#price").val(data.price);//单价
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


function saveAdd(dlg){
	saveEdit(dlg);
}

function saveEdit(dlg){
	currentDialog = dlg;
	var jsonStr = "[";
	var flag = true;
	
	if(!isNotNull($("#fromStorageId").val())){
		art.dialog.tips('请选申请分店！');
		flag = false;
		return false;
	}
	if(!isNotNull($("#provideId").val())){
		art.dialog.tips('请选择申请人！');
		flag = false;
		return false;
	}
	
	if($("#description").val().length > 2000){
		art.dialog.tips('备注最多可以输入2000个字符！');
		flag = false;
		return false;
	}
	//验证完毕
	//获取所有的调拨单细节给页面；
	var allDetail=[];//所有的detail
	var allTotal=0;
	var flag=true;
	//遍历所有的数据；
	$(".scrollContent tr").each(function(){
		
		if(!isNotNull($("#goodsId").val())){
			art.dialog.tips('请选择商品！');
			flag = false;
			return false;
	}
	
	if(!isNotNull($("#transferDetailNum").val())){
		art.dialog.tips('请填写调拨数量！');
		flag = false;
		return false;
	}
		if(!isNotNull($("#transferDetailSpoilage").val())){
			art.dialog.tips('请填写损坏率！');
			flag = false;
			return false;
	}
		var detail={};//每个detail;
		//得到每个div
		//填充数据到detail中
		detail.goodsId = $(this).find("#goodsId").val();
		detail.favorablePrice = parseFloat($(this).children().eq(5).children().eq(0).html());
		detail.transferDetailNum = parseInt($(this).find("#transferDetailNum").val());
		detail.transferDetailTotal=parseFloat($(this).find("#totalPrice").text());
		var transferDetailSpoilage=$(this).find("#transferDetailSpoilage").val();
		if (transferDetailSpoilage=='NAN') { 
			transferDetailSpoilage=0;
		}
		detail.transferDetailSpoilage=parseFloat(transferDetailSpoilage);//损坏率
		
		detail.description=$(this).find("#description").text();//描述

		var maxInventoryCount=parseInt($(this).find("#maxInventoryCount").val());//最大库存数量
		if(maxInventoryCount<parseInt(detail.transferDetailNum)){
			art.dialog.tips("调拨数量不能超过"+parseInt(maxInventoryCount));
			flag=false;
			return false;
		}
		//转成json对象---添加到allDetail中；
		allDetail.push(JSON.stringify(detail));//push到数组中
		//调拨单总价累加
		var tempTotal=parseFloat($(this).find("#totalPrice").text());
		if(tempTotal){//不为NAN就表示可以累加
			allTotal+=tempTotal;
		}else{
			allTotal+=0;
		}
	});
	console.info(allDetail);
	//赋值表单中进行提交操作；
	$('#allDetailData').val('['+allDetail.join(",")+']');//字符串的形式传入后台
	$('#goodsCategorynum').val(allDetail.length);//商品类目数量
	$('#transferTotal').val(allTotal);//总价格
	if(flag){
		$.post(base + '/transferBill/saveEdit', $('form').serialize(),
				function(res) {
					if (res.STATE == "SUCCESS") {
						if (res.MSG) {
							art.dialog({
								content : res.MSG,
								time : 1,
								close : function() {
									art.dialog.close();
								},
								width : 200
							});
						} else {
							art.dialog.close();
						}
					} else {
						art.dialog.tips(res.MSG);
					}
				}, 'json');
	}
	return false;
}

function putGoodsInfo(obj){
	var barCode = $(obj).val();
	var parent=$(obj).parents("tr");
	$.ajax({
		url:base+"/ebbase/goods/getGoodsByBarCode?random=" +  Math.round(Math.random()*100),
		dataType: "json",
		data: {barCode:barCode},
		success: function(res) {
			var data = res[0];
			if(null != data){
				var len = $(".scrollContent").find("input[value='" + data.id + "']").length;
				if(len >= 1){
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
					parent.find("#goodsName").text(data.goodsName);
					parent.find("#specifications").text(data.specifications);
					parent.find("#unit").text(data.unit);
					parent.find("#maxInventoryCount").val(data.ableCount);
					parent.find("#price").parents("td").find("span").text(data.instoragePrice);
					parent.find("#price").val(data.price);//单价
					parent.find("input[name='goodsId']").val(data.id);
				}
			}
		}
	});
}


function autoFun(data,sourceObj){
	$.each(data.attributes,function(i,ele){
		if(ele.name == "name" ){
			$(sourceObj).val(ele.value);
		}
	});
}



//计算总金额
function caclTotal(obj){
	if(null != obj){
		var parent=$(obj).parents("tr");//找到tr
		var favorablePrice = parseFloat(parent.children().eq(5).children().eq(0).html());
		var transferDetailNum = parseFloat(parent.find("input[name='transferDetailNum']").val());
		if(transferDetailNum>0 && favorablePrice>0){
			parent.find("#totalPrice").text((transferDetailNum * favorablePrice).toFixed(2));
		}else{
			parent.find("#totalPrice").text(0);
		}
	}else{
		$(".scrollContent tr").each(function(){
			calcTotalOne($(this));
		});
	}
}
//计算总金额
function checkNum(obj){
	if(null != obj){
		var parent=$(obj).parents("tr");//找到tr
		var transferDetailNum = parseInt(parent.find("input[name='transferDetailNum']").val());
		var maxInventoryCount = parseInt(parent.find("input[name='maxInventoryCount']").val());
		if(transferDetailNum>maxInventoryCount){
			art.dialog.tips('调拨数量不能超过'+maxInventoryCount);
		}
	}else{
		art.dialog.tips('请填写调拨 数量!');
	}
}

