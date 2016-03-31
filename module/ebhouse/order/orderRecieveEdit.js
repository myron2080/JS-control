var recieveNumOrgn;
var passFlag = true;	//通过标识
var tipMessage = "";	//提示信息
$(function(){
	bindEvent();
	recieveNumOrgn = $("#recieveNum").val();
});



function bindEvent(){
	
	setStopProgation();
	
	//初始化金额的输入框
	initMoneyText();
	
	var checkboxComp = $("#transfer");
	
	//显示转账信息
	displayOrHideComp($(checkboxComp));
	
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
                            	'<input class="quan-input" style="width:40px;" onkeyup="onlyPutNum(this)"  total="swingCardTotal" dataType="money" name="money" type="text" />'+
                           	'</td>'+
                            '<td height="30" align="center">'+
                            	'<input class="quan-input" style="width:40px;" dataType="money" total="swingCardTotal" name="poundage" type="text" />元'+
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
		initCapaccountAutoComplete($trcomp.find(':text[name="account"]'));	//设置事件
		swindCardMoneyChangeEvent($trcomp.find(':text[name="money"]'));	//设置事件
		swindCardMoneyChangeEvent($trcomp.find(':text[name="poundage"]'));	//设置事件
		$trcomp.find(':text[name="businessDate"]').val(formate_yyyyMMdd(new Date));
		$trcomp.find(':text[name="chargePerson"]').val($("input[name='chargePerson']").val());
		
//		setBankDataToComp($trcomp.find('select[id="bankName"]'));		//设置银行数据
		var options = $trcomp.find('select[name="bankName"]').find("option");
		if(null == options || options.length == 0){
			$trcomp.find('select[name="bankName"]').append($("#bankNameData").find("option").clone());
		}
		
		
		initMoneyText();
		initDelBtnEvent();
	});
	
	//加载银行信息
//	loadingBank($("#bankOption"));
	
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

function userDepositFlag(obj){
	var chk = $("#depositFlag").attr("checked");
	if(chk){
		$("#depositFlag").removeAttr("checked");
	}else{
		$("#depositFlag").attr("checked","checked")
	}
}


//表单提交
function saveEdit(dlg){
	if(!isNotNull($("#recieveNum").val())){
		art.dialog.tips("收据号不能为空！");
		return;
	}
	
	if($(":checkbox:checked").length<=0){
		art.dialog.tips("请选择付款方式！");
		return;
	}
	
	var settleAccountJson = getSettleAccountJson();
	if(!passFlag){
		art.dialog.tips(tipMessage);
		return;
	}
	
	var depositFlag = $("#depositFlag").attr("checked");
	var depositFlagStr = "NO";
	if(depositFlag){
		depositFlagStr = "YES";
	}
	
	$.post(getPath()+"/ebhouse/order/updateRecieve",{id:$("#id").val(),followRemark:$("#followRemark").val(),
		orderId:$("#orderId").val(),recieveNum:$("#recieveNum").val(),depositFlagStr:depositFlagStr,settleAccountJson:settleAccountJson},function(data){
		if(data.STATE == 'SUCCESS'){
			art.dialog.tips(data.MSG,null,"succeed");
			art.dialog.data("flg","RELOAD");
			setTimeout(function(){
				art.dialog.close();
			},1000);
		} else {
			art.dialog.alert(data.MSG);
		}
	},"json");
}


/**
 * 得到得到结算信息的json数据
 * added by taking.wang
 */
var totalMoney = 0;
function getSettleAccountJson(){
	var allRecieveMoney = 0;
	passFlag = true;
	var waitPayMoney = $("#waitPayMoney").val();
	var tradeMoney = $("#tradeMoney").val();
	
	var jsonArrData = "[";
	$(":checkbox:checked").each(function(){
		var money = $(this).closest("tr").find(":text").val();
		if($(this).attr("id") == 'cash'){	//现金
			var jsonData = "{";
			jsonData+="'id':'" + $("#cashId").val() + "',"
			jsonData+="'method':'CASH',"
			jsonData+="'money':'"+money+"'";
			jsonData+="}";
			jsonArrData +=jsonData+",";
			if(null == money || "" == $.trim(money)){
				tipMessage = "【现金】金额不能为空！！";
				passFlag = false;
			}
		}
		if($(this).attr("id") == 'transfer'){	//转账
			var jsonData = "{";
			var transferId = $("#transferId").val();
			if(transferId){
				jsonData+="'id':'" + $("#transferId").val() + "',"
			}
			jsonData+="'method':'TRANSFER',"
			jsonData+="'money':'"+money+"',";
			jsonData+="'myAccountId':'"+$("#transferCapaccount").val()+"',";
			jsonData+="'remark':'"+$("#transferCapaccount option:selected").html()+"'";
			jsonData+="}";
			jsonArrData +=jsonData+",";
			if(null == money || "" == $.trim(money)){
				tipMessage = "【转账】金额不能为空！！";
				passFlag = false;
			}
			if(parseFloat(money) <=0){
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
				var setAccountId = $(this).find("[name='settlementId']").val();
				var bankNameValue = $(this).find("[name='bankName'] option:selected").html();
				var businessDate = $(this).find(":input[name='businessDate']").val();
				var chargePerson = $(this).find("[name='chargePerson']").val();
				var tradeNumber = $(this).find("[name='tradeNumber']").val();
				var moneyValue = $(this).find("[name='money']").val();
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
				
				if(parseFloat(moneyValue)<=0){
					tipMessage = "第 "+(i+1)+" 行的金额必须大于0";
					passFlag = false;
					return false;
				}
				var settlementId = $(this).find(":hidden[name='settlementId']").val();
				if(settlementId){
					jsonData +="'id':'"+$(this).find(":hidden[name='settlementId']").val()+"',";
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
	
	if(waitPayMoney < (allRecieveMoney - tradeMoney)){
		tipMessage = "收款金额超过了待付金额！";
		passFlag = false;
	}
	
	if (jsonArrData.indexOf(",") != -1) {
		jsonArrData = jsonArrData.substring(0, jsonArrData.length - 1);
	}
	jsonArrData +="]";
	return jsonArrData;
}

