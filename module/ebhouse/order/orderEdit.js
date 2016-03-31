var oldBuyerId;
var tipMessage = "";	//提示信息
$(document).ready(function(){
	bindEvent();
	setAtivityTypeSelectValue($("#houseProjectName option:selected").val());
	
	$.post(base +"/ebhouse/member/getUserInfo",{id:$("#buyerId").val()},function(data){
		var user = data.user;
		$("#startGold").text(user.startGold);
	},'json');
});



function userStartGold(obj){
	var chk = $("#startGoldStatus").attr("checked");
	var chk_dis = $("#startGoldStatus").attr("disabled");
	if(!chk_dis){
		var startGold = parseFloat($("#startGold").text());
		if(chk){
			$("#startGoldStatus").removeAttr("checked");
		}else{
			$("#startGoldStatus").attr("checked","checked")
		}
	}
}

//姓名自动补全的回调函数
function selectValue(resultData){
	$("#buyerId").val(resultData.value);
	$.post(base +"/ebhouse/member/getUserInfo",{id:resultData.value},function(data){
		var user = data.user;
		$("#startGold").text(user.startGold);
		$("#startGoldStatus").hide();
		if(user.startGold > 0){
			$("#payMoney").parent().show();
		}else{
			$("#payMoney").parent().hide();
		}
	},'json');
	$("#startGoldStatus").removeAttr("disabled");
	$("#buyerName").val(resultData.name);
	$("#orginName").val(resultData.name);
	$("#mobileNo").val(resultData.phone);
	$("#cardType").val(resultData.cardType);
	$("#cardNo").val(resultData.cardNumber);
	$("input[name='chargePerson']").val(resultData.name);
}


function bindEvent(){
	//姓名自动补全
	$('#mobileNo').autocomplete({
		serviceUrl:base+"/ebhouse/member/autoComplete",
		type:'POST',
		dataType:'json',
		width:'180px',
		minChars:0,
		maxHeight:'160px',
		paramName:'key',
		clsIncomplete:true,
		onSelect:selectValue
	});
	
	//select change方法
	$('#houseProjectName').bind('change',function(){
		var houseProjectId = $(this).val();
		$("#remark").val($("#houseProjectName option:selected").text());
		setAtivityTypeSelectValue(houseProjectId);
	});
	
	//活动类型
	$("#activityType").bind("change",function(){
		setTdValue($(this).find("option:selected"));
	});
	
}

/**
 * 设置活动类型下拉框的值
 * @returns
 */
function setAtivityTypeSelectValue(houseProjectId){
	$("#activityType").empty();
	$.post(base+"/ebhouse/activity/ajaxGet",{houseProjectId:houseProjectId},function(data){
		var activityList = data.activityList;
		var $activityTypeComp = $("#activityType");
		if(null != activityList && activityList.length >0){
			removeOption($activityTypeComp);
			var activityName = $("#activityName").val();
			for(var i=0; i<activityList.length; i++){
				var tmp = activityList[i];
				if(activityName == tmp.name){
					$activityTypeComp.append("<option price='"+tmp.price+"' oprice='"+tmp.oprice+"' selected='selected' leftAmount='"+tmp.leftAmount+"' value='"+tmp.id+"'>"+tmp.name+"</option>");
//				}else{
//					$activityTypeComp.append("<option price='"+tmp.price+"' oprice='"+tmp.oprice+"' leftAmount='"+tmp.leftAmount+"' value='"+tmp.id+"'>"+tmp.name+"</option>");
				}
			}
			setTdValue($activityTypeComp.find("option").eq(0));
		}
	},'json');
}

/**
 * 设置单价，数量那些值
 * @returns
 */
function setTdValue($comp){
	$("td[key='price']").html($comp.attr("price"));
	$("td[key='oprice']").html($comp.attr("oprice"));
	$("td[key='leftAmount']").html($comp.attr("leftAmount"));
	$("span[key='totalPrice']").html(parseFloat($("td[key='price']").html()*parseInt($("#amount").val())));
}

/**
 * 移除select里面的option标签
 * @param selectComp
 * @returns
 */
function removeOption(selectComp){
	selectComp.children("option").each(function(){
		$(this).remove();
	});
}

//表单提交
function saveEdit(currentDialog){
	
	if(null == $("#buyerId").val() || "" == $.trim($("#buyerId").val())){
		art.dialog.tips("请选择购买人手机号码！！");
		return;
	}
	
	if(null == $("#buyerName").val() || "" == $.trim($("#buyerName").val())){
		art.dialog.tips("购买人姓名不能为空！！");
		return;
	}
	if(parseFloat($("#amount").val()) !=1){
		art.dialog.tips("一次只允许购买一张券！");
		return;
	}
	
	
	$.post(base+"/ebhouse/order/editOrder",{orderCouponsId:$("#orderCouponsId").val(),couponsId:$("#couponsId").val(),followRemark:$("#followRemark").val(),remark:$("#remark").val(),orderJson:getOrderDataJson()},function(data){
		if(data.STATE == 'SUCCESS'){
			art.dialog.tips(data.MSG,null,"succeed");
			setTimeout(function(){art.dialog.close();},1000);
		} else {
			art.dialog.alert(data.MSG);
		}
	},"json");
	
	if(currentDialog){
		currentDialog.button({name:"取消",disabled:true});
		currentDialog.button({name:"确定",disabled:true});
	}
	
	var orginName = $("#orginName").val();
	var buyerName = $("#buyerName").val();
	$.post(base+"/ebhouse/member/updateInfo",{id:$("#buyerId").val(),name:$("#buyerName").val(),cardType:$("#cardType").val(),cardNo:$("#cardNo").val()},function(data){
	},"json");
}

/**
 * 得到买劵信息的Json数据
 * added by taking.wang
 */
function getOrderDataJson(){
	var totalMoney = parseFloat($("span[key='totalPrice']").html());
	var addMoney = parseFloat($("#payPrice").val());
	var startGold = parseFloat($("#startGold").text());
	var status = $("#status").val();
	var jsonData = "{";
	jsonData += "'id':'"+$("#id").val()+"',";
	jsonData += "'buyer.id':'"+$("#buyerId").val()+"',";
	jsonData += "'buyer.name':'"+$("#buyerName").val()+"',";
	jsonData += "'deposit':'" + $("#deposit").val() + "',";
	jsonData += "'houseProject.id':'"+$("#houseProjectName").val()+"',";
	jsonData += "'houseProject.registerName':'"+$("#houseProjectName option:selected").html()+"',";
	jsonData += "'activity.id':'"+$("#activityType").val()+"',";
	jsonData += "'activity.name':'"+$("#activityType option:selected").html()+"',";
	if($("#startGoldStatus").attr("checked")){
		jsonData += "'startGold':'" + startGold + "',";
		totalMoney = totalMoney - startGold;
		if(totalMoney != addMoney){
			status = "PARTPAYED";
		}else{
			status = "PAYED";
		}
	}
	jsonData += "'status':'"+status+"',";
	if (jsonData.indexOf(",") != -1) {
		jsonData = jsonData.substring(0, jsonData.length - 1);
	}
	jsonData +="}"
	return jsonData;
}

