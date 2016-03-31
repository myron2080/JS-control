var passFlag = true;	//通过标识
var tipMessage = "";	//提示信息
$(function(){
	bindEvent();
	calcBalanceMoney();
});

function calcBalanceMoney(){
	$("div[key='transfer']").find("input[name='money']").bind("blur",function(){
		var payPrice = parseFloat($("#payPrice").text());
		var total_money = parseFloat($("#total_money").val());
		$("#balanceMoney").val(payPrice - total_money);
	});
}

//绑定事件
function bindEvent(){
	
	setStopProgation();
	
	//初始化金额的输入框
	initMoneyText();
	
	//初始化浮选框的单击事件
	initCheckBoxClick();
	
	initMoneyTextBlurEvent();
	
	//加载银行信息
	loadingBank($("#bankOption"));
	setTimeout(function(){
		//加载银行信息
		setBankDataToComp($('select[name="bankName"]'));	
	},300);
	
	
	
	//单击事件
	$("span[checkboxSpan]").bind("click",function(){
		var checkboxComp = $(this).find(":checkbox");
		if(checkboxComp.is(":checked")){
			checkboxComp.removeAttr("checked");
			$("#settleAccountDiv").show();
		} else {
			checkboxComp.attr("checked","checked");
			$("#settleAccountDiv").hide();
		}
	});
	
	$(":checkbox[toBanlance]").bind("click",function(event){
		if($(this).is(":checked")){
			$("#settleAccountDiv").hide();
		} else {
			$("#settleAccountDiv").show();
		}
		event.stopPropagation();
	});
	
	//新增刷卡资料信息
	$("#addBtn").bind("click",function(){
		var rowno = $("table[transfer] tbody").find("tr").length;	//得到序号
		var trHtml = '<tr rowno="'+rowno+'">'+
                            '<td height="30">'+
                            	'<input class="quan-input" type="text" style="width:120px;"  name="account"/>'+
                            	'<input type="hidden" name="accountId"/>'+
                            '</td>'+
                            '<td height="30" align="center">'+
                            	'<select style="width:120px;" name="bankName"></select>'+
                            '</td>'+
                           '<td height="30">'+
                            	'<input class="quan-input" type="text" style="width:120px;" name="branchName" />'+
                            '</td>'+
                            '<td height="30" align="center">'+
                            	'<input class="quan-input" type="text" value="' + $("td[key='buyerName']").html() + '" style="width:120px;" name="chargePerson" />'+
                            '</td>'+
                            '<td height="30" align="center">'+
                            	'<input class="quan-input" total="tranferTotal" style="width:40px;" dataType="money" name="money" type="text" />'+
                           	'</td>'+
                            '<td height="30">'+
                            	'<a class="blue" href="#" name="delBtn">删除</a>'+
                           	'</td>'+
                          '</tr>';
		$("table[transfer]").find("tbody").append(trHtml);
		var $trcomp = $("table[transfer] tbody").find("tr[rowno='"+rowno+"']");
		initCapaccountAutoComplete($trcomp.find(':text[name="account"]'));	//设置事件
		swindCardMoneyChangeEvent($trcomp.find(':text[name="money"]'));	//设置事件
		setBankDataToComp($trcomp.find('select[name="bankName"]'));		//设置银行数据
		calcBalanceMoney();
		initDelBtnEvent();
	});
}

//加载银行卡信息
function loadingCapaccount(key){
	if('cash' != key){
		initAccountAutoComplete();
		//设置银行数据到组件
		setBankDataToComp($("table[transfer] tbody").find("tr").find("select[name='bankName']"));
	}
}

//表单提交
function saveEdit(currentDialog){
	tipMessage = "";
	passFlag = true;
	var param = {};
	param.orderId = $("#orderId").val();
	param.remark = $("#remark").val();
	param.backOffJson = getOrderBackOffDataJson();
	if(!$(":checkbox[toBanlance]").is(":checked")){	//如果是退到
		if(compareMoney($("td[key='totalPrice']").html())){
			return;
		}
		param.settleJson = getSettleAccountJson();
		if(!passFlag){
			art.dialog.tips(tipMessage);
			return;
		}
	} 
	$.post(getPath()+"/ebhouse/order/saveBackOff",param,function(data){
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
}

/**
 * 得到退劵的数据json
 * @returns {String}
 */
function getOrderBackOffDataJson(){
	var totalMoney = parseFloat($("td[key='totalPrice']").html());
	var balanceMoney = parseFloat($("#parseFloat").val());
	var addMoney = 0;
	var notThrough = false;		//是否提示
	var balanceMoney = parseFloat($("#balanceMoney").val());
	$("#settleAccountDiv").find(":checkbox:checked").each(function(){
		var money = $(this).closest("tr").find(":text").val();
		addMoney += parseFloat(money);
	});
	if($(":checkbox[toBanlance]").is(":checked")){	//如果是退到账面上，则取已收金额
		addMoney = parseFloat($("#payPrice").text());
	}
	
	if(balanceMoney<0){
		passFlag = false;
		tipMessage = "退款金额大于可退金额！";
	}
	
//	addMoney = addMoney - balanceMoney;
	var jsonData = "{";
	jsonData += "'id':'"+ $("#backOffId").val() +"',";
	jsonData += "'orderCoupons.id':'"+$("#id").val()+"',"
	jsonData += "'orderCoupons.order.id':'"+$("#orderId").val()+"',";
	jsonData += "'orderCoupons.coupons.id':'"+$("#couponsId").val()+"',";
	jsonData += "'orderCoupons.order.buyer.id':'"+$("#buyerId").val()+"',";
	jsonData += "'orderCoupons.order.buyer.name':'"+$("#buyerName").val()+"',";
	jsonData += "'money':'"+ addMoney +"',";
	jsonData += "'balanceMoney':'"+ balanceMoney +"',";
	jsonData += "'amount':'"+$("td[key='amount']").html()+"',";
	jsonData +="'backToBalance':'"+($(":checkbox[toBanlance]").is(":checked") ? "Y":"N")+"'";
	jsonData +="}"
	return jsonData;
}

/**
 * 得到得到结算信息的json数据
 * added by taking.wang
 */
function getSettleAccountJson(){
	var jsonArrData = "[";

	var totalMoney = 0;
	//转账
	$("div[key='transfer']").find("tr[rowno]").each(function(){
		var account = $(this).find("input[name='account']").val();
		var bankNameValue = $(this).find("select[name='bankName'] option:selected").html();
		var branchNameValue = $(this).find("input[name='branchName']").val();
		var chargePerson = $(this).find("input[name='chargePerson']").val();
		var money = $(this).find("input[name='money']").val();
		if(null == account || $.trim(account) == ""){
			tipMessage = "账号不能为空！";
			passFlag = false;
			return false;
		}
//		if(!isNotNull(branchNameValue)){
//			tipMessage = "开户支行不能为空！";
//			passFlag = false;
//			return false;
//		}
		
		if(null ==chargePerson || $.trim(chargePerson) == ""){
			tipMessage = "户名不能为空！";
			passFlag = false;
			return false;
		}
		
		if(null ==money || $.trim(money) == "" ){
			tipMessage = "退款金额不能为空！";
			passFlag = false;
			return false;
		}
		
		if(parseFloat(money) <= 0){
			tipMessage = "【转账】金额必须大于0！";
			passFlag = false;
			return false;
		}
		
		var jsonData = "{";
		jsonData+="'method':'TRANSFER',"
		jsonData+="'oppositeAccountNumber':'"+$("input[name='account']").val()+"',";
		
		jsonData+="'oppositeBankName':'"+bankNameValue+"',";
		jsonData+="'oppositeOpenBankName':'"+branchNameValue+"',";
		jsonData+="'money':'"+money+"',";
		
		jsonData+="'chargePerson':'"+chargePerson+"',";
		jsonData+="'remark':'"+$("input[name='account']").val()+"'";
		jsonData+="}";
		jsonArrData +=jsonData+",";
		
		totalMoney += parseFloat(money);
	});
	
	if (jsonArrData.indexOf(",") != -1) {
		jsonArrData = jsonArrData.substring(0, jsonArrData.length - 1);
	}
	jsonArrData +="]";
	
	return jsonArrData;
}

