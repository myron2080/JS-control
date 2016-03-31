var oldBuyerId;
var passFlag = true;	//通过标识
var tipMessage = "";	//提示信息
$(function(){
	bindEvent();
	setAtivityTypeSelectValue($("#houseProjectName option:selected").val());
	$("#remark").val($("#houseProjectName option:selected").text());
	if(!isNotNull($("#houseProjectName").val())){
		$("#remark").val("");
	}
	$("#startGoldStatus").bind("click", function(){
		var total = parseFloat($("td[key='totalPrice']").text());
		var startGold = parseFloat($("#startGold").text());
		if(total > 0){
			if($(this).attr("checked")){
				$("#payMoney").text("您还需付款" + (total - startGold));
			}else{
				$("#payMoney").text("您还需付款" + total);
			}
		}
	});
	
	//设置刷卡日期为当前日期
	 if(!isNotNull($("#businessDate").val())){
			$("input[name='businessDate']").val(formate_yyyyMMdd(new Date));
	 }
});

//姓名自动补全的回调函数
function selectValue(resultData){
	$("#buyerId").val(resultData.value);
	$.post(base +"/ebhouse/member/getUserInfo",{id:resultData.value},function(data){
		var user = data.user;
		$("#startGold").text(user.startGold);
	},'json');
	var total = parseFloat($("td[key='totalPrice']").text());
	if(total > 0){
		$("#startGoldStatus").removeAttr("disabled");
	}
	$("#buyerName").val(resultData.name);
	$("#orginName").val(resultData.name);
	$("#mobileNo").val(resultData.phone);
//	$("#cardType option[text='"+ resultData.cardType +"']").;
	$("#cardType option").each(function(){
		if($(this).text() == resultData.cardType){
			$("#cardType").val($(this).val());
		}
	});
	$("#cardNo").val(resultData.cardNumber);
	$("input[name='chargePerson']").val(resultData.name);
	setDisplayOrHideSettleAccDiv();
}

//设置隐藏和显示结算信息的Div
function setDisplayOrHideSettleAccDiv(){
	var totalPrice = parseFloat($("td[key='totalPrice']").html());
	var leftAmount = parseFloat($("td[key='leftAmount']").html());
	//只有总价大于0并且填写了买劵人并且剩余数量要大于0  才可以填写结算信息
	if(leftAmount > 0 && totalPrice > 0 && null != $("#buyerId").val() && "" != $("#buyerId").val()){	
		$("#settleAccountDiv").show();
		$("#tips").hide();
	} else {
		$("#tips").show();
		$("#settleAccountDiv").hide();
	}
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
		if(!isNotNull($("#houseProjectName").val())){
			$("#remark").val("");
		}
		setAtivityTypeSelectValue(houseProjectId);
	});
	
	//活动类型
	$("#activityType").bind("change",function(){
		setTdValue($(this).find("option:selected"));
	});
	
	//数量
	$("#amount").bind("keyup",function(event){  
        var partten = /^\d+$/;  
        var numberVal = $(this).val();  
        if(!partten.test(numberVal)){       //如果不是数字的话，则将其删除  
            $(this).val(numberVal.substring(0,numberVal.length-1));       
        } else {
        	if(null != numberVal && "" != $.trim(numberVal)){
        		$("td[key='totalPrice']").html(parseFloat($("td[key='price']").html()*parseInt(numberVal)));
        	} else {
        		$("td[key='totalPrice']").html(0);
        	}
        	setDisplayOrHideSettleAccDiv();
        }  
    });
	
	setStopProgation();
	
	//初始化金额的输入框
	initMoneyText();
	
	//初始化金额鼠标移开事件
	initMoneyTextBlurEvent();
	
	
	initCheckBoxClick();
	
	//新增刷卡资料信息
	$("#addBtn").bind("click",function(){
		var rowno = $("table[swingTable] tbody").find("tr").length;	//得到序号
		var trHtml = '<tr rowno="'+rowno+'">'+
                            '<td height="30">'+
                            	'<input class="quan-input" type="text" style="width:60px;"  name="account"/>'+
                            	'<input type="hidden" name="accountId"/>'+
                            '</td>'+
                            '<td height="30" align="center">'+
                            	'<select style="width:120px;" name="bankName"></select>'+
                            '</td>'+
                            '<td height="30">'+
                        	'<input class="quan-input" type="text" style="width:90px;" name="businessDate" readonly="readonly" '+
                            'onclick="WdatePicker({isShowClear:false,dateFmt:\'yyyy-MM-dd \'})" />'+
                            '</td>'+
                           '<td height="30">'+
                            	'<input class="quan-input" type="text" style="width:50px;" name="chargePerson" />'+
                            '</td>'+
                            '<td height="30" align="center">'+
                            	'<input class="quan-input" type="text" style="width:120px;" name="tradeNumber" />'+
                            '</td>'+
                            '<td height="30" align="center">'+
                            	'<input class="quan-input" style="width:40px;" onkeyup="onlyPutNum(this)" total="swingCardTotal" dataType="money" name="money" type="text" />'+
                           	'</td>'+
                            '<td height="30" align="center">'+
                            	'<input class="quan-input" style="width:40px;" dataType="money" name="poundage" type="text" />元'+
                           	'</td>'+
                           	'<td height="30" align="center">'+
                        	'<input class="quan-input" style="width:100px;" name="desc" type="text" />'+
                           	'</td>'+
                            '<td height="30">'+
                            	'<a class="blue" href="#" name="delBtn">删除</a>'+
                           	'</td>'+
                          '</tr>';
		$("table[swingTable]").find("tbody").append(trHtml);
		var $trcomp = $("table[swingTable] tbody").find("tr[rowno='"+rowno+"']");
		initCapaccountAutoComplete($trcomp.find(':text[name="account"]'));	//设置事件
		$trcomp.find(':text[name="businessDate"]').val(formate_yyyyMMdd(new Date));
		$trcomp.find(':text[name="chargePerson"]').val($("#buyerName").val());
		swindCardMoneyChangeEvent($trcomp.find(':text[name="money"]'));	//设置事件
		setBankDataToComp($trcomp.find('select[name="bankName"]'));		//设置银行数据
		initDelBtnEvent();
	});
	
	//加载银行信息
	loadingBank($("#bankOption"));
	
}

//加载资金账号
function loadingCapaccount(key){
	if('cash' != key){
		if(!selectHaveOption($("#"+key+"Capaccount"))){	//判断银行账户下拉框是否有值，如果没有值的话，则要去加载数据，如果有则不用去加载数据。
			$.post(base+"/ebhouse/order/getGroupCapaccount",{},function(data){
				var accountList = data.accountList;
				if(null != accountList && accountList.length > 0){
					for(var i= 0; i< accountList.length ; i++){
						var tmpAccount = accountList[i];
						$("#"+key+"Capaccount").append("<option value='"+tmpAccount.id+"'>"+tmpAccount.combineName+"</option>");
					}
				}
			},'json');
			if(key == 'swingcard'){
				initAccountAutoComplete();
				//设置银行数据到组件
				setBankDataToComp($("table[swingTable] tbody").find("tr").find("select[name='bankName']"));
			}
		}
	}
}

/**
 * 设置活动类型下拉框的值
 * @returns
 */
function setAtivityTypeSelectValue(houseProjectId){
	$("#activityType").empty();
	if(isNotNull(houseProjectId)){
		$.post(base+"/ebhouse/activity/ajaxGet",{houseProjectId:houseProjectId},function(data){
			var activityList = data.activityList;
			var $activityTypeComp = $("#activityType");
			if(null != activityList && activityList.length >0){
				removeOption($activityTypeComp);
				for(var i=0; i<activityList.length; i++){
					var tmp = activityList[i];
					$activityTypeComp.append("<option price='"+tmp.price+"' oprice='"+tmp.oprice+"' leftAmount='"+tmp.leftAmount+"' value='"+tmp.id+"'>"+tmp.name+"</option>");
				}
				setTdValue($activityTypeComp.find("option").eq(0));
			}
		},'json');
	}else{
		$("td[key='price']").html(0);
		$("td[key='oprice']").html(0);
		$("td[key='leftAmount']").html(0);
		$("td[key='totalPrice']").html(0);
		$("#startGoldStatus").attr("disabled", true);
		$("#payMoney").text("");
	}
}

/**
 * 设置单价，数量那些值
 * @returns
 */
function setTdValue($comp){
	$("td[key='price']").html($comp.attr("price"));
	$("td[key='oprice']").html($comp.attr("oprice"));
	$("td[key='leftAmount']").html($comp.attr("leftAmount"));
	$("td[key='totalPrice']").html(parseFloat($("td[key='price']").html()*parseInt($("#amount").val())));

	var total = parseFloat($("td[key='totalPrice']").text());
	if(total > 0){
		$("#startGoldStatus").removeAttr("disabled");
	}else{
		$("#startGoldStatus").attr("disabled", true);
	}
	
	setDisplayOrHideSettleAccDiv();
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
function saveEdit(dlg){
	
	if(null == $("#buyerId").val() || "" == $.trim($("#buyerId").val())){
		art.dialog.tips("请选择购买人手机号码！！");
		return;
	}
	
	if(null == $("#buyerName").val() || "" == $.trim($("#buyerName").val())){
		art.dialog.tips("购买人姓名不能为空！！");
		return;
	}
	
	if(null == $("#houseProjectName").val() || "" == $.trim($("#houseProjectName").val())){
		art.dialog.tips("请选择项目！！！");
		return;
	}
	
	if(null == $("#amount").val() || "" == $.trim($("#amount").val())){
		art.dialog.tips("购买数量不能为空！！！");
		return;
	}
	
	if(parseFloat($("#amount").val()) > parseFloat($("td[key='leftAmount']").html())){
		art.dialog.tips("购买数量必须要小于等于剩余数量！！！");
		return;
	}
	
	if(parseFloat($("#amount").val()) !=1){
		art.dialog.tips("一次只允许购买一张券！");
		return;
	}
	
	if(!isNotNull($("#recieveNum").val())){
		art.dialog.tips("请填写收据号！");
		return;
	}
	
	
	
	var addMoney = 0;
	var totalMoney = parseFloat($("td[key='totalPrice']").html());
	var startGold = parseFloat($("#startGold").text());
	if($("#startGoldStatus").attr("checked")){
		totalMoney = totalMoney - startGold;
	}
	$("#settleAccountDiv").find(":checkbox:checked").each(function(){
		var money = $(this).closest("tr").find(":text").val();
		addMoney += parseFloat(money);
	});
	
	if($(":checkbox:checked").length<=0){
		art.dialog.tips("请选择付款方式！");
		return;
	}
	
	if(totalMoney < addMoney){
		art.dialog.tips("您付款金额超出了应付金额！");
		return;
	}
	
	if(compareMoney($("td[key='totalPrice']").html())){
		return;
	}
	
	var settleAccountJson = getSettleAccountJson();
	if(!passFlag){
		art.dialog.tips(tipMessage);
		return;
	}
	$.post(base+"/ebhouse/order/saveOnline",{remark:$("#remark").val(),orderJson:getOrderDataJson(),settleAccountJson:settleAccountJson},function(data){
		if(data.STATE == 'SUCCESS'){
			art.dialog.tips(data.MSG,null,"succeed");
			setTimeout(function(){art.dialog.close();},1000);
		} else {
			art.dialog.alert(data.MSG);
		}
	},"json");
	
	var orginName = $("#orginName").val();
	var buyerName = $("#buyerName").val();
	$.post(base+"/ebhouse/member/updateInfo",{id:$("#buyerId").val(),name:$("#buyerName").val(),cardType:$("#cardType").val(),cardNo:$("#cardNo").val()},function(data){
	},"json");
}


function userStartGold(obj){
	var chk = $("#startGoldStatus").attr("checked");
	var chk_dis = $("#startGoldStatus").attr("disabled");
	if(!chk_dis){
		var total = parseFloat($("td[key='totalPrice']").text());
		var startGold = parseFloat($("#startGold").text());
		if(chk){
			$("#startGoldStatus").removeAttr("checked");
			$("#payMoney").text("您还需付款" + total);
		}else{
			$("#payMoney").text("您还需付款" + (total - startGold));
			$("#startGoldStatus").attr("checked","checked")
		}
	}
}

/**
 * 得到买劵信息的Json数据
 * added by taking.wang
 */
function getOrderDataJson(){
	var totalMoney = parseFloat($("td[key='totalPrice']").html());
	var addMoney = 0;
	var status = "PAYED";
	var notThrough = false;		//是否提示
	$("#settleAccountDiv").find(":checkbox:checked").each(function(){
		var money = $(this).closest("tr").find(":text").val();
		addMoney += parseFloat(money);
	});
	var startGold = parseFloat($("#startGold").text());
	var jsonData = "{";
	jsonData += "'id':'"+$("#orderId").val()+"',";
	jsonData += "'buyer.id':'"+$("#buyerId").val()+"',";
	jsonData += "'buyer.name':'"+$("#buyerName").val()+"',";
	jsonData += "'houseProject.id':'"+$("#houseProjectName").val()+"',";
	jsonData += "'houseProject.registerName':'"+$("#houseProjectName option:selected").html()+"',";
	jsonData += "'activity.id':'"+$("#activityType").val()+"',";
	jsonData += "'activity.name':'"+$("#activityType option:selected").html()+"',";
	jsonData += "'total':'"+$("td[key='totalPrice']").html()+"',";
	jsonData += "'amount':'"+$("#amount").val()+"',";
	if($("#startGoldStatus").attr("checked")){
		jsonData += "'startGold':'" + startGold + "',";
	}
	jsonData += "'recieveNum':'"+$("#recieveNum").val()+"',";
	jsonData += "'payPrice':'"+addMoney+"',";
	
	if($("#startGoldStatus").attr("checked")){
		totalMoney = totalMoney - startGold;
	}
	if(totalMoney != addMoney){
		status = "PARTPAYED";
	}
	
	if(addMoney == 0){
		status ='WAITINGPAY';
	}
	jsonData += "'status':'"+status+"'";
	jsonData +="}"
	return jsonData;
}

/**
 * 得到得到结算信息的json数据
 * added by taking.wang
 */
function getSettleAccountJson(){
	var jsonArrData = "[";
	$(":checkbox:checked").each(function(){
		var money = $(this).closest("tr").find(":text").val();
		if($(this).attr("id") == 'cash'){	//现金
			var jsonData = "{";
			jsonData+="'method':'CASH',"
			jsonData+="'money':'"+money+"'";
			jsonData+="}";
			jsonArrData +=jsonData+",";
			return;
		}
		
		if($(this).attr("id") == 'transfer'){	//转账
			var jsonData = "{";
			jsonData+="'method':'TRANSFER',"
			jsonData+="'money':'"+money+"',";
			jsonData+="'myAccountId':'"+$("#transferCapaccount").val()+"',";
			jsonData+="'remark':'"+$("#transferCapaccount option:selected").html()+"'";
			jsonData+="}";
			jsonArrData +=jsonData+",";
			return;
		}
		
		if($(this).attr("id") == 'swingcard'){	//刷卡
			var commonJsonData = "{";
				commonJsonData+="'method':'SWINGCARD',"
				commonJsonData+="'myAccountId':'"+$("#swingcardCapaccount").val()+"',";
				commonJsonData+="'remark':'"+$("#swingcardCapaccount option:selected").html()+"',";
			$("table[swingTable] tbody").find("tr").each(function(i){
				var jsonData = commonJsonData;
				
				var accountVal = $(this).find("[name='account']").val();
				var bankNameValue = $(this).find("[name='bankName'] option:selected").html();
				var businessDate = $(this).find(":input[name='businessDate']").val();
				var chargePerson = $(this).find("[name='chargePerson']").val();
				var tradeNumber = $(this).find("[name='tradeNumber']").val();
				var moneyValue = $(this).find("[name='money']").val();
				tipMessage = "";
				passFlag = true;
				if(null == accountVal || $.trim(accountVal) == ""){
					tipMessage = "第 "+(i+1)+" 行的账号不能为空";
					passFlag = false;
					return false;
				}
				
				if(null == bankNameValue || $.trim(bankNameValue) == ""){
					tipMessage = "第 "+(i+1)+" 行的开户银行不能为空";
					passFlag = false;
					return false;
				}
				
				if(null == businessDate || $.trim(businessDate) == ""){
					tipMessage = "第 "+(i+1)+" 行的刷卡日期不能为空";
					passFlag = false;
					return false;
				}
				
				if(null == chargePerson || $.trim(chargePerson) == ""){
					tipMessage = "第 "+(i+1)+" 行的刷卡人不能为空";
					passFlag = false;
					return false;
				}
				
				if(null == tradeNumber || $.trim(tradeNumber) == ""){
					tipMessage = "第 "+(i+1)+" 行的交易号不能为空";
					passFlag = false;
					return false;
				}
				
				if(null == moneyValue || $.trim(moneyValue) == ""){
					tipMessage = "第 "+(i+1)+" 行的金额不能为空";
					passFlag = false;
					return false;
				}
				
				jsonData +="'oppositeAccountId':'"+$(this).find(":hidden[name='accountId']").val()+"',";
				jsonData +="'oppositeAccountNumber':'"+accountVal+"',";
				jsonData +="'oppositeBankName':'"+bankNameValue+"',";
				jsonData +="'businessDate':'"+$(this).find(":input[name='businessDate']").val()+"',";
				jsonData +="'chargePerson':'"+chargePerson+"',";
				jsonData +="'tradeNumber':'"+$(this).find("[name='tradeNumber']").val()+"',";
				jsonData +="'money':'"+moneyValue+"',";
				jsonData +="'poundage':'"+$(this).find("[name='poundage']").val()+"',";
				jsonData +="'desc':'"+$(this).find("[name='desc']").val()+"'";
				jsonData+="}";
				jsonArrData +=jsonData+",";
			});
			return;
		}
	});
	if (jsonArrData.indexOf(",") != -1) {
		jsonArrData = jsonArrData.substring(0, jsonArrData.length - 1);
	}
	jsonArrData +="]";
	return jsonArrData;
}

