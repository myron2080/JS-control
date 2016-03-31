/**
 * 退货单 编辑
 */
$(document).ready(function(){
	$(".bor1").css({
		height:'400px'
	});
	if($("#goodsList").find(".wareHouseDiv").length <=0){
		addItem();
	}
	$(".btnDiv a").click(function(){
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
	
	$("td").each(function(){
		if(typeof($(this).attr("key")) == 'undefined'){
			$(this).css({
				"background-color":"#f1f1f1"
			});
		}
	});
});

function showPersonStr(data,source){
	$(source).val($(data).attr("name"));
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

//增加子项
function addItem(){
	var itemDiv=$("#divClone").clone();
	itemDiv.find("input[id='goodsNumber']").attr("autocomp","{id:'autoInventoryGoods',type:1,tagId:'autoId[id]',backFun:'autoGoods'}");
	itemDiv.removeAttr("id");
	$("#goodsList").append(itemDiv);
	itemDiv.fadeIn();
	AutoComp.init();
}
//保存退货单
function saveEdit(dlg){
	currentDialog = dlg;
	var jsonStr = "[";
	var flag = true;
	
	if(!isNotNull($("#backGoodsType").val())){
		art.dialog.tips('请选择退货类型！',1.5);
		flag = false;
		return false;
	}
	
	if(!isNotNull($("#personId").val())){
		art.dialog.tips('请选择申请人！',1.5);
		flag = false;
		return false;
	}
	
	if(!isNotNull($("#personName").val())){
		art.dialog.tips('请选择申请人！',1.5);
		flag = false;
		return false;
	}
   //遍历详情数据
	$(".scrollContent tr").each(function(){
		var price=$(this).find("input[id='backPrice']").val();//退货单价
		var backCount=$(this).find("input[id='backCount']").val();//退货数量
		if(!isNotNull(price) || parseFloat(price) <=0){
			art.dialog.tips('请输入退货单价,且不能为0！',1.5);
			$(this).find("input[id='backPrice']").focus();
			flag = false;
			return false;
		}
		if(!isNotNull(backCount) || parseInt(backCount) == 0){
			art.dialog.tips('请输入退货数量,且不能为0！',1.5);
			$(this).find("input[id='backCount']").focus();
			flag = false;
			return false;
		}
		var goodsId=$(this).find("#goodsId").val();//商品ID
		var actArriveCount=$(this).find("#actArriveCount").text();//实收数量
		var inStoragePrice=$(this).find("#inStoragePrice").text();//入库单价
		var backCount=$(this).find("#backCount").val();//退货数量
		var backPrice=$(this).find("#backPrice").val();//退货单价
		var backTotal=$(this).find("#backTotal").text();//退货总价
		
		jsonStr+="{";
		jsonStr+="\"goods\":{\"id\":\""+goodsId+"\"},";
		jsonStr+="\"actArriveCount\":\""+actArriveCount+"\",";
		jsonStr+="\"inStoragePrice\":\""+inStoragePrice+"\",";
		jsonStr+="\"backCount\":\""+backCount+"\",";
		jsonStr+="\"backPrice\":\""+backPrice+"\",";
		jsonStr+="\"backTotal\":\""+backTotal+"\"";
		jsonStr +="},";
	});
	if(jsonStr.indexOf(",")!=-1){
		jsonStr=jsonStr.substring(0,jsonStr.length-1);
	}
	jsonStr+="]";
	jsonStr.replace("undefined","");
	$("#detailJson").val(jsonStr);
	if(!flag){
		return;
	}
	$.post(base+'/ebstorage/backgoods/saveEdit',$('form').serialize(),function(res){
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


/**
 * 选择商品 回调函数
 * @param data
 */
function autoGoods(data,sourceObj){
	var parent=$(sourceObj).parents("tr");
	parent.find("input[name='goodsId']").val(data.id);
    var len=$("#goodsList").find("input[value='"+data.id+"']").length;
    if(len > 1){//已选择 该 商品
    	art.dialog.tips("该商品已选择!",2);
    	$(sourceObj).val("");
    	parent.find("input[id='goodsId']").val("");
    	parent.find("span[id='goodsName']").val("");
    	parent.find("span[id='specifications']").val("");
    	parent.find("span[id='goodsUnit']").val("");
    	parent.find("span[id='actArriveCount']").val("");
    	parent.find("span[id='inStoragePrice']").val("");
    	return;
    }
    parent.find("input[id='goodsNumber']").val($(data).attr("number"));
    parent.find("span[id='goodsName']").val($(data).attr("name"));
    parent.find("span[id='specifications']").val($(data).attr("specifications"));
    parent.find("span[id='goodsUnit']").val($(data).attr("unit"));
    parent.find("span[id='actArriveCount']").val($(data).attr("topLimit"));//库存数量
	parent.find("span[id='inStoragePrice']").val($(data).attr("factoryPrice"));//商品出厂价
	goodsFoucsOut(sourceObj);
}

/**
 * 删除标签方法
 * @param obj
 */
function deleteItem(obj){
	var len=$(".scrollContent tr").length;
	if(len == 1){
		art.dialog.tips("请至少保留一条商品记录",1.5);
		return;
	}
	var parent=$(obj).parents("tr");
	parent.fadeOut(function(){
		parent.remove();
	});
}


/**
 * 计算总价
 */
function caclTotalAmount(obj){
	var parent=$(obj).parents("tr");
	var price=parseFloat(parent.find("input[id='backPrice']").val());//单价
	var backCount=parseInt(parent.find("input[id='backCount']").val());//退货数量
	var actCount=parseInt(parent.find("span[id='actArriveCount']").text());//实收数量
	if(backCount>actCount){//退货数量大于实收数量
		backCount=actCount;
		parent.find("input[id='backCount']").val(backCount);
	}
	
    if(isNaN((price * backCount).toFixed(2))){
    	parent.find("span[id='backTotal']").text(0);
    	return;
    }
    parent.find("span[id='backTotal']").text((price * backCount).toFixed(2));
}