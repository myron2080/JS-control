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
function approval(currentDialog){
	$.post( base + "/ebstorage/instorage/specialUpdate",$('form').serialize(),function(res){
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
			currentDialog.button({name:"保存",disabled:false});
			currentDialog.button({name:"取消",disabled:false});
		}
    },'json');

	if(currentDialog){
		currentDialog.button({name:"保存",disabled:true});
		currentDialog.button({name:"取消",disabled:true});
	}
}
//选择质检员
function autoFun(data,sourceObj){
	$(sourceObj).val($(data).attr("name"));
}

//特改 保存
function saveEdit(dlg){
	var opreateFlag=false;
	art.dialog.confirm("是否确定保存?",function(){
		saveOperate(dlg);
	});
	return false;
}

function saveOperate(dlg){
	var inStorageStatus = $("#inStorageStatus").val();
	currentDialog = dlg;
	var flag = true;
	
	var detailJson = "[";
	$(".scrollContent tr[key='data_tr']").each(function(){
		var detailId=$(this).find("#detailId").val();//入库明细 ID
		var arriveCount=parseInt($(this).find("#arriveCount").val());//应收数量
		var actArriveCount=parseInt($(this).find("#actArriveCount").val());//实收数量
		var inStoragePrice=parseFloat($(this).find("#inStoragePrice").val());//入库单价
		var totalPrice=$(this).find("#totalPrice").text();//总价
		
		if(!arriveCount || arriveCount <= 0){
			art.dialog.tips('请输入应收数量！');
			flag = false;
			return false;
		}
		
		if(!actArriveCount || actArriveCount <= 0){
			art.dialog.tips('请输入实收数量！');
			flag = false;
			return false;
		}
		
		if(!inStoragePrice || inStoragePrice <= 0){
			art.dialog.tips('请输入入库单价！');
			flag = false;
			return false;
		}
		
		detailJson+="{";
		detailJson+="\"id\":\""+detailId+"\",";
		detailJson+="\"arriveCount\":\""+arriveCount+"\",";
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
	if(flag){
		approval(currentDialog);
	}
}
