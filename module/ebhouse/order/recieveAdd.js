var oldBuyerId;
var passFlag = true;	//通过标识
var tipMessage = "";	//提示信息
$(function(){
	bindEvent();
	
	//设置刷卡日期为当前日期
	 if(!isNotNull($("input[name='businessDate']").val())){
			$("input[name='businessDate']").val(formate_yyyyMMdd(new Date()));
	 }
	
	//setAtivityTypeSelectValue($("#houseProjectName option:selected").val());
});

//姓名自动补全的回调函数
function selectValue(resultData){
	$("#buyerId").val(resultData.value);
	$("#buyerName").val(resultData.name);
	$("td[key='mobileNo']").html(resultData.phone);
	$("td[key='cardType']").html(resultData.cardType);
	$("td[key='cardNo']").html(resultData.cardNumber);
	setDisplayOrHideSettleAccDiv();
}

//设置隐藏和显示结算信息的Div
function setDisplayOrHideSettleAccDiv(){
	var totalPrice = parseFloat($("td[key='totalPrice']").html());
	var leftAmount = parseFloat($("td[key='leftAmount']").html());
	//只有总价大于0并且填写了买劵人并且剩余数量要大于0  才可以填写结算信息
	if(leftAmount > 0 && totalPrice > 0 && null != $("#buyerId").val() && "" != $("#buyerId").val()){	
//		$("#settleAccountDiv").show();
//		$("#tips").hide();
	} else {
//		$("#tips").show();
//		$("#settleAccountDiv").hide();
	}
}

function bindEvent(){
	//姓名自动补全
	$('#buyerName').autocomplete({
		serviceUrl:getPath()+"/ebhouse/member/autoComplete",
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
                            	'<a class="blue" href="javascript:void(0)" name="delBtn">删除</a>'+
                           	'</td>'+
                          '</tr>';
		$("table[swingTable]").find("tbody").append(trHtml);
		var $trcomp = $("table[swingTable] tbody").find("tr[rowno='"+rowno+"']");
		
		$trcomp.find(':text[name="businessDate"]').val(formate_yyyyMMdd(new Date));
		$trcomp.find(':text[name="chargePerson"]').val($("#buyerName").val());
		initCapaccountAutoComplete($trcomp.find(':text[name="account"]'));	//设置事件
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
			$.post(getPath()+"/ebhouse/order/getGroupCapaccount",{},function(data){
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
	if(isNotNull(houseProjectId)){
		$("#activityType").empty();
		$.post(getPath()+"/ebhouse/activity/ajaxGet",{houseProjectId:houseProjectId},function(data){
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
function saveRecieve(currentDialog){
	if(!isNotNull($("#recieveNum").val())){
		art.dialog.tips("收据号不能为空！");
		return;
	}
	var settleAccountJson = getSettleAccountJson();
	if(!passFlag){
		art.dialog.tips(tipMessage);
		return;
	}
	if(passFlag){
		$.post(getPath()+"/ebhouse/order/save",{remark:$("#remark").val(),orderJson:getOrderDataJson(),settleAccountJson:settleAccountJson},function(data){
			if(data.STATE == 'SUCCESS'){
				art.dialog.tips(data.MSG,null,"succeed");
				setTimeout(function(){art.dialog.close();},1000);
			} else {
				art.dialog.alert(data.MSG);
			}
		},"json");
	}
	
	if(currentDialog){
		currentDialog.button({name:"取消",disabled:true});
		currentDialog.button({name:"确定",disabled:true});
	}
}

/**
 * 得到买劵信息的Json数据
 * added by taking.wang
 */
function getOrderDataJson(){
	var payMoney = $("#payMoney").val();
	var addMoney = 0;
	var status = "PAYED";
	var notThrough = false;		//是否提示
	$("#settleAccountDiv").find(":checkbox:checked").each(function(){
		var money = $(this).closest("tr").find(":text").val();
		addMoney += parseFloat(money);
	});
	var jsonData = "{";
	jsonData += "'id':'"+$("#id").val()+"',";
	jsonData += "'payPrice':'"+addMoney+"',";
	if(payMoney != addMoney){
		status = "PARTPAYED";
	}
	jsonData += "'recieveNum':'"+$("#recieveNum").val()+"',";
	jsonData += "'status':'"+status+"'";
	jsonData +="}"
	return jsonData;
}

/**
 * 得到得到结算信息的json数据
 * added by taking.wang
 */
function getSettleAccountJson(){
	var allRecieveMoney = 0;
	var waitPayMoney = $("#waitPayMoney").val();
	passFlag = true;
	var jsonArrData = "[";
	if($(":checkbox:checked").length == 0){
		tipMessage = "请选择收款方式！";
		passFlag = false;
	}
	$(":checkbox:checked").each(function(){
		var money = $(this).closest("tr").find(":text").val();
		if($(this).attr("id") == 'cash'){	//现金
			var jsonData = "{";
			jsonData+="'method':'CASH',"
			jsonData+="'money':'"+money+"'";
			jsonData+="}";
			jsonArrData +=jsonData+",";
		}
		
		if($(this).attr("id") == 'transfer'){	//转账
			var jsonData = "{";
			jsonData+="'method':'TRANSFER',"
			jsonData+="'money':'"+money+"',";
			jsonData+="'myAccountId':'"+$("#transferCapaccount").val()+"',";
			jsonData+="'remark':'"+$("#transferCapaccount option:selected").html()+"'";
			jsonData+="}";
			jsonArrData +=jsonData+",";
			if(passFlag && !isNotNull(money)){
				tipMessage = "【转账】金额不能为空！！";
				passFlag = false;
			}
			if(passFlag && parseFloat(money) <=0){
				tipMessage = "【转账】金额不能小于0！！";
				passFlag = false;
			}
			
		}
		
		
		
		allRecieveMoney = parseFloat(money) + parseFloat(allRecieveMoney);
		
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
				if(passFlag && null == accountVal || $.trim(accountVal) == ""){
					tipMessage = "第 "+(i+1)+" 行的账号不能为空";
					passFlag = false;
				}
				
				if(passFlag && null == bankNameValue || $.trim(bankNameValue) == ""){
					tipMessage = "第 "+(i+1)+" 行的开户银行不能为空";
					passFlag = false;
				}
				
				if(null == businessDate || $.trim(businessDate) == ""){
					tipMessage = "第 "+(i+1)+" 行的刷卡日期不能为空";
					passFlag = false;
				}
				
				if(null == chargePerson || $.trim(chargePerson) == ""){
					tipMessage = "第 "+(i+1)+" 行的刷卡人不能为空";
					passFlag = false;
				}
				
				if(null == tradeNumber || $.trim(tradeNumber) == ""){
					tipMessage = "第 "+(i+1)+" 行的交易号不能为空";
					passFlag = false;
				}
				
				if(passFlag && null == moneyValue || $.trim(moneyValue) == ""){
					tipMessage = "第 "+(i+1)+" 行的金额不能为空";
					passFlag = false;
				}
				
				if(passFlag && parseFloat($.trim(moneyValue)) <= 0){
					tipMessage = "第 "+(i+1)+" 行的金额必须大于0";
					passFlag = false;
				}
				jsonData +="'oppositeAccountId':'"+$(this).find(":hidden[name='accountId']").val()+"',";
				jsonData +="'oppositeAccountNumber':'"+accountVal+"',";
				jsonData +="'oppositeBankName':'"+bankNameValue+"',";
				jsonData +="'chargePerson':'"+chargePerson+"',";
				jsonData +="'businessDate':'"+$(this).find(":input[name='businessDate']").val()+"',";
				jsonData +="'tradeNumber':'"+$(this).find("[name='tradeNumber']").val()+"',";
				jsonData +="'money':'"+moneyValue+"',";
				jsonData +="'poundage':'"+$(this).find("[name='poundage']").val()+"',";
				jsonData +="'desc':'"+$(this).find("[name='desc']").val()+"'";
				jsonData+="}";
				jsonArrData +=jsonData+",";
			});
		}
	});
	
	if(allRecieveMoney <= 0){
		art.dialog.tips("收款金额不能小于0！");
		return;
	}
	if(waitPayMoney < allRecieveMoney){
		tipMessage = "收款金额超过了待付金额！";
		passFlag = false;
	}
	if (jsonArrData.indexOf(",") != -1) {
		jsonArrData = jsonArrData.substring(0, jsonArrData.length - 1);
	}
	jsonArrData +="]";
	return jsonArrData;
}

