$(document).ready(function(){
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
	
	$("td").each(function(){
		if(typeof($(this).attr("key")) == 'undefined'){
			$(this).css({
				"background-color":"#f1f1f1"
			});
		}
	});
	$(".scrollContent tr").each(function(){
		calcOneTr($(this));
	});
});

/**
 * 计算总数
 * @param obj
 */
function calcTotal(obj){
	var parent=$(obj).parents("tr");
	calcOneTr(parent);
}

function calcOneTr(parent){
	var actArriveCount = parseFloat(parent.find("input[name='actArriveCount']").val());
	var inStoragePrice = parseFloat(parent.find("input[name='inStoragePrice']").val());
	if(actArriveCount && actArriveCount>0 && inStoragePrice && inStoragePrice >0){
		parent.find("#totalPrice").text((actArriveCount * inStoragePrice).toFixed(2));
	}else{
		parent.find("#totalPrice").text(0);
	}
}
function approval(inStorageStatus,currentDialog){
	$("#status").val(inStorageStatus);
	$.post( base + "/ebstorage/instorage/approval",$('form').serialize(),function(res){
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

	if(currentDialog){
		currentDialog.button({name:"同意",disabled:true});
		currentDialog.button({name:"不同意",disabled:true});
	}
}
//选择质检员
function autoFun(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
}

//统一审批
function agree(dlg){
	var inStorageStatus = $("#inStorageStatus").val();
	currentDialog = dlg;
	var flag = true;
	var lookFactoryPrice=$("#lookFactoryPrice").val();
	if($("#qualityId").length > 0){
		if(!isNotNull($("#qualityId").val())){
			art.dialog.tips('请选择质检员！');
			flag = false;
			return false;
		}
		if(!isNotNull($("#inStorageType").val())){
			art.dialog.tips('请选择入库类型！');
			flag = false;
			return false;
		}
		
		if(!isNotNull($("#actArriveDate").val())){
			art.dialog.tips('请选择实到日期！');
			flag = false;
			return false;
		}
		
		var detailJson = "[";
		$(".scrollContent tr[key='data_tr']").each(function(){
			var detailId=$(this).find("#detailId").val();//入库明细 ID
			var actArriveCount=$(this).find("#actArriveCount").val();//实收数量
			var inStoragePrice=parseFloat($(this).find("#inStoragePrice").val());//入库单价
			var totalPrice=$(this).find("#totalPrice").text();//总价
			
			if(!isNotNull(actArriveCount)){
				art.dialog.tips('请输入实收数量！');
				flag = false;
				return false;
			}
			if (lookFactoryPrice=='Y') {
				if(!inStoragePrice || inStoragePrice <= 0){
					art.dialog.tips('请输入入库单价！');
					flag = false;
					return false;
				}
			}
			detailJson+="{";
			detailJson+="\"id\":\""+detailId+"\",";
			detailJson+="\"actArriveCount\":\""+actArriveCount+"\",";
			detailJson+="\"total\":\""+totalPrice+"\",";
			detailJson+="\"inStoragePrice\":\""+inStoragePrice+"\"";
			detailJson +="},";
		});
		
		if(detailJson.indexOf(",")!=-1){
			detailJson=detailJson.substring(0,detailJson.length-1);
		}
		detailJson+="]";
		detailJson.replace("undefined","");
		$("#detailJson").val(detailJson);
	}
	if(flag){
		approval(inStorageStatus,currentDialog);
	}
	return false;
}

function disagree(dlg){
	currentDialog = dlg;
	approval("REJECTED",currentDialog);
	return false;
}





