/**
 * 加载银行信息
 */
function loadingBank($bankDiv){
	$.post(getPath()+"/ebhouse/order/getAllBank",{},function(data){
		var bankList = data.bankList;
		var $select = $("<select></select>");
		if(null != bankList && bankList.length > 0){
			for(var i= 0; i< bankList.length ; i++){
				var tmpBank = bankList[i];
				$select.append("<option value='"+tmpBank.id+"'>"+tmpBank.bankName+"</option>");
			}
		}
		$bankDiv.append($select);
	},"json");
}

/**
 * 重新设置tr的行号
 */
function resetTrRowno($tableComp){
	$tableComp.find("tbody tr").each(function(i){
		$(this).attr("rowno",i);
	});
}

//初始化金额的输入框
function initMoneyText(){
	//数量
	$(":input[dataType='money']").unbind("keyup").bind("keyup",function(event){  
	    var partten = /(^\d+$)|(^\d+\.$)|(^\d+\.\d{1,2}$)/;  
	    var numberVal = $(this).val(); 
	    if(!partten.test(numberVal)){//如果不是数字的话，则将其删除  
	        $(this).val(numberVal.substring(0,numberVal.length-1));       
	    } 
	});
	
}

/**
 * 初始化金额输入框移开 焦点的事件
 */
function initMoneyTextBlurEvent(){
	//金额鼠标移开事件
	$(":text[name='money']").each(function(){
		swindCardMoneyChangeEvent($(this));
	});
	
	$(":text[name='poundage']").each(function(){
//		swindCardMoneyChangeEvent($(this));
	});
}

// 初始化 账户自动补全
function initCapaccountAutoComplete($comp){
	var userId = $("#buyerId").val();
	$comp.autocomplete({
		serviceUrl:getPath()+"/ebhouse/member/ajaxAccount",
		type:'POST',
		dataType:'json',
		width:'180px',
		minChars:0,
		maxHeight:'160px',
		paramName:'key',
		params:{rowno:$comp.closest("tr").attr("rowno"),userId:userId},
		clsIncomplete:true,
		onSelect:setAccountInfo
	});
	$(':text[name="account"]').unbind("keyup").bind("keyup",function(){
		onlyPutNum(this);
	});
}


//设置防止自动冒泡
function setStopProgation(){
	/**
	 * 复选框点击防冒泡
	 */
	$(":checkbox,:text,select").each(function(){
		
		$(this).bind("click",function(event){
			if($(this).is(":checkbox")){
				displayOrHideComp($(this));
			}
			event.stopPropagation();
		})
	});
}

//初始化复选框的单击事件
function initCheckBoxClick(){
	//复选框点击事件
	$("#settleAccount").find("tr").each(function(){
		$(this).find(":checkbox").click(function(){
			var checkboxComp = $(this);
			if(checkboxComp.is(":checked")){
				displayOrHideComp($(checkboxComp));
			} else {
				displayOrHideComp($(checkboxComp));
			}
		});
		
		
		$(this).find("td :first").click(function(){
			var checkboxComp = $(this).find(":checkbox");
			if(checkboxComp.is(":checked")){
				$(checkboxComp).removeAttr("checked");
				displayOrHideComp($(checkboxComp));
			} else {
				$(checkboxComp).attr("checked","checked");
				displayOrHideComp($(checkboxComp));
			}
		});
	});
}

/**
 * 回调函数
 * @param resultData
 */
function setAccountInfo(resultData){
	var rowno = resultData.rowno;
	var trComp = $("tr[rowno='"+rowno+"']");
	trComp.find(":hidden[name='accountId']").val(resultData.value)
	trComp.find("select[name='bankName'] option[value='"+resultData.bank.id+"']").attr("selected","selected");
	trComp.find(":text[name='branchName']").val(resultData.branchName);
}


/**
 * 显示隐藏控件
 * @returns
 */
function displayOrHideComp(checkboxComp){
	var key = $(checkboxComp).attr("id");
	if($(checkboxComp).is(":checked")){
		if(null != window.loadingCapaccount && 'undefined' != window.loadingCapaccount){	//如果window里面有这个函数则执行
			loadingCapaccount(key);
		}
		$("[key='"+key+"']").show();
	} else {
		$("[key='"+key+"']").hide();
	}
}

/**
 * 判断下拉框有值
 * @param selectComp
 * @returns
 */
function selectHaveOption(selectComp){
	var options = selectComp.find("option");
	if(null != options && options.length >0){
		return true;
	}
	return false;
}

//初始化 账户自动补全
function initAccountAutoComplete(){
	//账号自动补全
	$(':text[name="account"]').each(function(){
		
		initCapaccountAutoComplete($(this));
	});
	$(':text[name="account"]').unbind("keyup").bind("keyup",function(){
		onlyPutNum(this);
	});
	
}

/**
 * 刷卡金额 改变事件
 * @param $comp
 */
function swindCardMoneyChangeEvent($comp){
	$comp.bind("blur",function(){
		swingCardMoneyChangeFun($(this).attr("total"),$(this));
	});
}

//设置银行数据到组件中去
function setBankDataToComp($selectComp){
	var options = $selectComp.find("option");
	if(null == options || options.length == 0){
		$selectComp.append($("#bankOption select").find("option").clone());
	}
}


//初始化删除按钮事件
function initDelBtnEvent(){
	$("a[name='delBtn']").unbind().each(function(i,ele){
		$(ele).click(function(){
			var $trComp = $(this).closest("tr");
			$trComp.remove();
			swingCardMoneyChangeFun($trComp.find(':text[name="money"]').attr("total"),$trComp.find(':text[name="money"]'));	//设置事件
			resetTrRowno($("table[swingTable]"));
		});
	});
}

/**
 * 刷卡金额 改变函数
 * @param $comp
 */
function swingCardMoneyChangeFun(totalKey,moneyComp){
	var swingCardTotal = 0;
	$("tr[rowno]").each(function(){
		var money = parseFloat($(this).find(':text[name="money"]').val());
		var poundage = parseFloat($(this).find(':text[name="poundage"]').val());
		if(!isNaN(money)){
			swingCardTotal += money;
		}
//		if(!isNaN(poundage)){
//			swingCardTotal += poundage;
//		}
	});
	$("["+totalKey+"]").val(swingCardTotal);
	//设置金额
}

/**
 * 比较结算金额和总金额的值
 * @returns {Boolean}
 */
function compareMoney(totalMoney){
	var totalMoney = parseFloat(totalMoney);
	var addMoney = 0;
	var notThrough = false;		//是否提示
	$("#settleAccountDiv").find(":checkbox:checked").each(function(){
		var labelName = $(this).next("b").html();
		var money = $(this).closest("tr").find(":text").val();
		if(null == money || "" == $.trim(money)){
			art.dialog.tips("【"+labelName+"】金额不能为空！！");
			notThrough = true;
			return false;
		}
		
//		if(parseFloat(money) <= 0){
//			art.dialog.tips("【"+labelName+"】金额必须要大于0！！");
//			notThrough = true;
//			return false;
//		}
		addMoney += parseFloat(money);
	});
	
	if(notThrough){
		return true;
	}
	
//	if(totalMoney != addMoney){
//		art.dialog.tips("【结算金额："+addMoney+"】与【总金额："+totalMoney+"】不等！！");
//		notThrough = true;
//	}
	return notThrough;
}