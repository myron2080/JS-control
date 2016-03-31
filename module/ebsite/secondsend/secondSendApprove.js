$(document).ready(function(){
	calcTotalPrice();
});
//审批操作
function approval(status,dlg){
	$("#status").val(status);
	dialogButtor(currentDialog,true);//禁用按钮
	var jsonStr = "[";
	var flag = true;
	$('.orderGoodsInfoDiv').each(function(index,doc){
		var orderDetailId = $(doc).find('input[name="orderDetailId"]').val();//订单明细ID
		var bujiCount=$(doc).find('input[name="bujiCount"]').val();//补寄数量
		
		if(!isNotNull(bujiCount)){
			art.dialog.tips('请输入补寄数量！',1.5);
			$(doc).find('input[name="bujiCount"]').focus();
			flag = false;
			return false;
		}
		
		jsonStr+="{";
		jsonStr+="\"num\":\""+bujiCount+"\",";
		jsonStr+="\"orderDetailId\":\""+orderDetailId+"\"";
		jsonStr +="},";
	});
	if(jsonStr.indexOf(",")!=-1){
		jsonStr=jsonStr.substring(0,jsonStr.length-1);
	}
	jsonStr+="]";
	jsonStr.replace("undefined","");
	$("#detailJson").val(jsonStr);
	if(flag){
		$.post( base + "/ebsite/secondSend/approval",$('form').serialize(),function(res){
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
		dialogButtor(currentDialog,false);//启用按钮
	}
}
//计算补寄总金额
function calcTotalPrice(obj){
	if(null != obj){
		var cur=$(obj).val();
		if(cur != ''){
			var num=$(obj).parent().find("#num").val();//购买数量
			if(parseInt(cur)>parseInt(num)){
				$(obj).val(num);
			}
		}
		calcTotalPrice();
	}else{
		var total=0;
		$(".orderGoodsInfoDiv").each(function(){
			var price = parseFloat($(this).find("#price").val());//单价
			var bujiCount = $(this).find("#bujiCount").val();//补寄数量
			if(bujiCount != ''){
				total+=price*parseInt(bujiCount);
			}
		});
		$("#totalPrice").text(total.toFixed(2));
	}
}

/**
 * 按钮禁用
 * @param dlg dialog对象
 * @param flag 禁用or启用
 */
function dialogButtor(dlg,flag){
	if(dlg){
		dlg.button({name:"同意",disabled:flag});
		dlg.button({name:"不同意",disabled:flag});
		dlg.button({name:"取消",disabled:flag});
	}
}

//同意
function agree(dlg){
	currentDialog = dlg;
	approval("APPROVALED",currentDialog);
	return false;
}

//拒绝
function disagree(dlg){
	currentDialog = dlg;
	approval("REJECTED",currentDialog);
	return false;
}