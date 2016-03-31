/**
 * 库存 盘点 编辑
 */

$(document).ready(function(){
	$(".bor1").css({
		height:'400px'
	});
	if($("#goodsList").find(".wareHouseDiv").length == 0){
		addItem();
	}
	$(".btnDiv a").click(function(){
		addItem();
	});

});

//新增一个item
function addItem(){
	var itemDiv=$("#divClone").clone();
	itemDiv.find("input[id='goodsNumber']").attr("autocomp","{id:'autoInventoryGoods',type:1,tagId:'autoId[id]',backFun:'autoGoods',afterFilter:'chooseStorageFirst'}");
	itemDiv.removeAttr("id");
	$("#goodsList").append(itemDiv);
	itemDiv.fadeIn();
	AutoComp.init();
}

//商品 自动补全 判断
function chooseStorageFirst(){
	if(!isNotNull($("#storageId").val())){
		art.dialog.tips("请先选择仓库!",1.5);
		return false;
	}
	if(!isNotNull($("#storageName").val())){
		art.dialog.tips("请先选择仓库!",1.5);
		return false;
	}
	return true;
}

function deleteItem(obj){
	var len=$("#goodsList").find(".wareHouseDiv").length;
	if(len == 1){
		art.dialog.tips("请至少保留一条商品记录",1.5);
		return;
	}
	var parent=$(obj).parents(".wareHouseDiv");
	parent.fadeOut(function(){
		parent.remove();
	});
}

/**
 * 清空所有商品信息
 */
function resetAllGoods(){
	$("#goodsList .wareHouseDiv").each(function(){
		$(this).find("#goodsId").val("");
		$(this).find("#goodsNumber").val("");
		$(this).find("#goodsName").val("");
		$(this).find("#specifications").val("");
		$(this).find("#goodsUnit").val("");
	});
}

/**
 * 选择商品 回调函数
 * @param data
 */
function autoGoods(data,sourceObj){
	var parent=$(sourceObj).parents(".wareHouseDiv");
	parent.find("input[name='goodsId']").val(data.id);
    var len=$("#goodsList").find("input[value='"+data.id+"']").length;
    if(len > 1){//已选择 该 商品
    	art.dialog.tips("该商品已选择!",2);
    	$(sourceObj).val("");
    	parent.find("input[name='goodsId']").val("");
    	parent.find("input[name='goodsName']").val("");
    	parent.find("input[name='specifications']").val("");
    	parent.find("input[name='unit']").val("");
    	return;
    }
    parent.find("input[name='goodsNumber']").val($(data).attr("number"));
    parent.find("input[name='goodsName']").val($(data).attr("name"));
    parent.find("input[name='specifications']").val($(data).attr("specifications"));
    parent.find("input[name='unit']").val($(data).attr("unit"));
    
	getStorageInfo(data.id).then(function(){
		calcFun(null);//计算所有盈亏
	});
}
//根据 商品ID和仓库ID获取对应信息
function getStorageInfo(goodsIds){
	var defer = $.Deferred();//延迟加载对象
	if(!isNotNull($("#storageId").val())){//没有选择仓库  不查询
		defer.resolve();
		return defer;
	}
	if(!isNotNull(goodsIds)){
		defer.resolve();
		return defer;
	}
	$.post(base + '/ebstorage/inventorycheck/getStorageInfo', {
		goodsIds : goodsIds,
		storageId : $("#storageId").val()
	}, function(res) {
		if(res){
			for(var i=0;i<res.length;i++){
				var item=res[i];
				if(null != item){
					var _goodsId=item.goodsId;
					$("#goodsList .wareHouseDiv").each(function(){
						if(_goodsId == $(this).find("input[name='goodsId']").val()){
							$(this).find("input[name='bookAmount']").val(item.bookCount);
							$(this).find("input[name='bookPrice']").val(item.bookPrice);
						}
					});
				}
			}
		}
		defer.resolve();
	},'json');
	return defer;
}

//清空仓储信息
function resetStorageInfo(obj){
	if(null != obj){//清除单个item
		$(obj).parents(".wareHouseDiv").find("input[name='bookAmount']").val("");
		$(obj).parents(".wareHouseDiv").find("input[name='bookPrice']").val("");
	}else{//清除所有
		$("#goodsList .wareHouseDiv").each(function(){
			$(this).find("input[name='bookAmount']").val("");
			$(this).find("input[name='bookPrice']").val("");
		});
	}
}

function autoPerson(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
}

/**
 * 选择仓库  自动补全 回调函数
 * @param data
 * @param sourceObj
 */
function autoStorage(data,sourceObj){
	var old_storage_id=$("#storageId").val();
	$("#storageId").val($(data).attr("id"));
    $(sourceObj).val($(data).attr("name"));
    if(old_storage_id == $("#storageId").val()){
    	return;
    }
    resetAllGoods();//清空所有商品信息
    //----------------------注释一下操作 //重新 选择 对应仓库的商品
//	resetStorageInfo(null);//清空所有  仓储信息
//	var goodsIds="";
//	$("#goodsList .wareHouseDiv").each(function(){
//		var goodsId=$(this).find("input[name='goodsId']").val();
//		if(isNotNull(goodsId)){
//			goodsIds+=goodsId+",";
//		}
//	});
//	getStorageInfo(goodsIds).then(function(){
//		calcFun(null);
//	});
}
function saveAdd(dlg){
	return saveEdit(dlg);
}

/**
 * 计算 盈 亏 盘点总余额
 * @param obj
 */
function calcFun(obj){
	if(null != obj){//计算单个item
		var parent=$(obj).parents(".wareHouseDiv");//找到 父节点
		caclOneFun(parent);
	}else{//刷新所有item
		$("#goodsList .wareHouseDiv").each(function(){
			caclOneFun($(this));
		});
	}
}

//计算单个item 盈 亏 盘点总余额
function caclOneFun(parent){
	var bookAmount=parent.find("input[name='bookAmount']").val();//仓库账面数
	var actAmount=parent.find("input[name='actAmount']").val();//仓库实有数
	var checkPrice=parent.find("input[name='checkPrice']").val();//盘点单价
	//计算盈亏
	if(isNotNull(bookAmount) && isNotNull(actAmount)){
		if(parseInt(bookAmount) > parseInt(actAmount)){//账面数量 大于实际数量
			parent.find("input[name='loss']").val(parseInt(bookAmount) - parseInt(actAmount));
			parent.find("input[name='profit']").val("0");
		}else{
			parent.find("input[name='loss']").val("0");
			parent.find("input[name='profit']").val(parseInt(actAmount) - parseInt(bookAmount));
		}
	}else{
		parent.find("input[name='loss']").val("0");
		parent.find("input[name='profit']").val("0");
	}
	
	//计算盘后总余额
	if(isNotNull(checkPrice) && isNotNull(actAmount)){
		var checkAfterAmount=((parseFloat(checkPrice))*(parseInt(actAmount))).toFixed(2);
		parent.find("input[name='checkAfterAmount']").val(checkAfterAmount);
	}else{
		parent.find("input[name='checkAfterAmount']").val(0);
	}
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

function saveEdit(dlg){
	currentDialog = dlg;
	dialogButtor(currentDialog,true);
	if(!isNotNull($("#storageId").val())){
		art.dialog.tips("请选择仓库",1.5);
		dialogButtor(currentDialog,false);
		return;
	}
	
	if(!isNotNull($("#storageName").val())){
		art.dialog.tips("请选择仓库",1.5);
		dialogButtor(currentDialog,false);
		return;
	}
	
	if(!isNotNull($("#checkDateStr").val())){
		art.dialog.tips("请选择盘点日期",1.5);
		dialogButtor(currentDialog,false);
		return;
	}
	
	if(!isNotNull($("#personId").val())){
		art.dialog.tips("请选择盘点人",1.5);
		dialogButtor(currentDialog,false);
		return;
	}
	
	if(!isNotNull($("#personName").val())){
		art.dialog.tips("请选择盘点人",1.5);
		dialogButtor(currentDialog,false);
		return;
	}
	var detailJson="[";
	var flag=true;
	$("#goodsList .wareHouseDiv").each(function(){
		var goodsId=$(this).find("input[id='goodsId']").val();//商品
		var goodsName=$(this).find("input[id='goodsName']").val();//商品
		var goodsNumber=$(this).find("input[id='goodsNumber']").val();//商品
		if(!isNotNull(goodsId)){
			art.dialog.tips("请选择商品",1.5);
			flag=false;
			return false;//退出循环
		}
		
		if(!isNotNull(goodsNumber)){
			art.dialog.tips("请选择商品",1.5);
			flag=false;
			return false;//退出循环
		}
		
		var bookAmount=$(this).find("input[name='bookAmount']").val();//仓库账面数
		if(!isNotNull(bookAmount)){
			art.dialog.tips("仓库账面数不能为空",1.5);
			flag=false;
			return false;//退出循环
		}
		var actAmount=$(this).find("input[name='actAmount']").val();//仓库实际数
		if(!isNotNull(actAmount)){
			art.dialog.tips("仓库实有数不能为空",1.5);
			flag=false;
			return false;//退出循环
		}
		var profit=$(this).find("input[name='profit']").val();//盈
		var loss=$(this).find("input[name='loss']").val();//亏
		var checkPrice=$(this).find("input[name='checkPrice']").val();//盘点单价
		if(!isNotNull(checkPrice)){
			art.dialog.tips("盘点单价不能为空",1.5);
			flag=false;
			return false;//退出循环
		}
		var bookPrice=$(this).find("input[name='bookPrice']").val();//账面单价
		if(!isNotNull(bookPrice)){
			art.dialog.tips("账面单价不能为空",1.5);
			flag=false;
			return false;//退出循环
		}
		var checkAfterAmount=$(this).find("input[name='checkAfterAmount']").val();//盘后总金额
		var detailRemark=$(this).find("input[name='detailRemark']").val();//备注
		detailJson+="{";
		detailJson+="\"goods\":{\"id\":\""+goodsId+"\"},";
		detailJson+="\"bookAmount\":\""+bookAmount+"\",";
		detailJson+="\"actAmount\":\""+actAmount+"\",";
		detailJson+="\"profit\":\""+profit+"\",";
		detailJson+="\"loss\":\""+loss+"\",";
		detailJson+="\"checkPrice\":\""+checkPrice+"\",";
		detailJson+="\"bookPrice\":\""+bookPrice+"\",";
		
		detailJson+="\"checkAfterAmount\":\""+checkAfterAmount+"\",";
		detailJson+="\"remark\":\""+detailRemark+"\"";
		detailJson +="},";
	});
	if(detailJson.indexOf(",")!=-1){
		detailJson=detailJson.substring(0,detailJson.length-1);
	}
	detailJson+="]";
	$("#detailJson").val(detailJson);
	if(flag){//验证通过
		$.post(base + "/ebstorage/inventorycheck/saveCheck",$('form').serialize(),function(res){
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

