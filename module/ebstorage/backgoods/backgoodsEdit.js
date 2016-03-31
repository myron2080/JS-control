/**
 * 退货单 编辑
 */
$(document).ready(function() {
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

// 保存退货单
function saveEdit(dlg) {
	currentDialog = dlg;
	dialogButtor(currentDialog,true);
	var notes = $('#description').val();
	var jsonStr = "[";
	var flag = true;

	if (!isNotNull($("#backGoodsType").val())) {
		art.dialog.tips('请选择退货类型！');
		flag = false;
		dialogButtor(currentDialog,false);
		return false;
	}

	if (!isNotNull($("#personId").val())) {
		art.dialog.tips('请选择申请人！');
		flag = false;
		dialogButtor(currentDialog,false);
		return false;
	}

	if (!isNotNull($("#personName").val())) {
		art.dialog.tips('请选择申请人！');
		flag = false;
		dialogButtor(currentDialog,false);
		return false;
	}

	if (notes.length > 200) {
		art.dialog.tips("描述字符数量不能超过200个!");
		flag = false;
		dialogButtor(currentDialog,false);
		return false;
	}
	// 遍历详情数据
	$(".scrollContent tr").each(function() {
		var price = $(this).find("input[id='backPrice']").val();// 退货单价
		var backCount = $(this).find("input[id='backCount']").val();// 退货数量
		if (!isNotNull(price) || parseFloat(price) <= 0) {
			art.dialog.tips('请输入退货单价,且不能为0！',1.5);
			$(this).find("input[id='backPrice']").focus();
			flag = false;
			return false;
		}
		if (!isNotNull(backCount) || parseInt(backCount) == 0) {
			art.dialog.tips('请输入退货数量,且不能为0！',1.5);
			$(this).find("input[id='backCount']").focus();
			flag = false;
			return false;
		}
		var inventoryCount=parseInt($(this).find("#inventoryCount").val());//库存可用数量
		if(parseInt(backCount) > inventoryCount){
			art.dialog.tips("退货数量大于库存可用数!",1.5);
			$(this).find("input[id='backCount']").focus();
			flag = false;
			return false;
		}
		
		var goodsId = $(this).find("#goodsId").val();// 商品ID
		var actArriveCount = $(this).find("#actArriveCount").val();// 实收数量
		var inStoragePrice = $(this).find("#inStoragePrice").val();// 入库单价
		var backCount = $(this).find("#backCount").val();// 退货数量
		var backPrice = $(this).find("#backPrice").val();// 退货单价
		var backTotal = $(this).find("#backTotal").val();// 退货总价

		jsonStr += "{";
		jsonStr += "\"goods\":{\"id\":\"" + goodsId + "\"},";
		jsonStr += "\"actArriveCount\":\"" + actArriveCount + "\",";
		jsonStr += "\"inStoragePrice\":\"" + inStoragePrice + "\",";
		jsonStr += "\"backCount\":\"" + backCount + "\",";
		jsonStr += "\"backPrice\":\"" + backPrice + "\",";
		jsonStr += "\"backTotal\":\"" + backTotal + "\"";
		jsonStr += "},";
	});
	if (jsonStr.indexOf(",") != -1) {
		jsonStr = jsonStr.substring(0, jsonStr.length - 1);
	}
	jsonStr += "]";
	jsonStr.replace("undefined", "");
	$("#detailJson").val(jsonStr);
	if (!flag) {
		dialogButtor(currentDialog,false);
		return;
	}
	$.post(base + '/ebstorage/backgoods/saveEdit', $('form').serialize(),
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
 * 计算总价
 */
function caclTotalAmount(obj) {
	var price = parseFloat($(obj).parents("tr").find("input[id='backPrice']").val());// 单价
	var backCount = parseInt($(obj).parents("tr").find("input[id='backCount']").val());// 退货数量
	var actCount = parseInt($(obj).parents("tr").find("input[id='actArriveCount']").val());// 实收数量
	if (backCount > actCount) {// 退货数量大于实收数量
		backCount = actCount;
		$(obj).parents("tr").find("input[id='backCount']").val(backCount);
	}
    if(isNaN((price * backCount).toFixed(2))){
    	$(obj).parents("tr").find("input[id='backTotal']").val(0);
    	return;
    }
    var _price=(price * backCount).toFixed(2);
	$(obj).parents("tr").find("input[id='backTotal']").val(_price);
	$(obj).parents("tr").find("input[id='backTotal']").parents("td").find("span").text(_price);
}