$(function(){
	console.info('welcome to giftEdit page...');
	//新增规则
	$('#addRule').on('click',addRuleRow);
	
	//所有的.tdshow响应click事件
	$('.tdshow').live('click',tdEdit);
	
	//所有的.tdedti响应blur事件
	$('.tdedit input').live('blur',tdShow);
});

/**
 * 点击tdshow显示编辑行
 */
function tdEdit(){
	var $div = $(this);
	//hide自己
	$div.hide();
	//显示自己的input
	var $tdedit = $div.next('.tdedit');
	$tdedit.show();
	$tdedit.find('input').focus();
}
/**
 * 输入完成之后显示展示
 */
function tdShow(){
	var $div = $(this).parent();
	//hide自己
	$div.hide();
	//显示自己的input
	var $tdshow = $div.prev('.tdshow');
	$tdshow.show();
	//赋值操作
	var _newValue = $(this).val();
	$tdshow.html(_newValue);
}

/**
 * 添加规则
 */
function addRuleRow(){
	
	//找到要添加的table
	var $table=$('.redBagTab');
	
	//组织添加的tr
	var trdom='';
	trdom='<tr>'
		+	'<td><a href="javascript:void(0);" onclick="delRuleRow(this);">删除</a></td>'
		+	'<td class="rule_money"><div class="tdshow"></div><div class="tdedit" style="display:none;"><input style="width: 60px;" type="text"></input></div></td>'
		+	'<td class="rule_type">'
		+		'<select name="ruleType">'
		+			'<option value="CASH">抵用券</option>'
		/*+			'<option value="BONUS">红包</option>'*/
		+		'</select>'
		+	'</td>'
		+	'<td class="rule_minimumAmount"><div class="tdshow"></div><div class="tdedit" style="display:none;"><input style="width: 60px;" type="text"></input></div></td>'
		+	'<td></td>'
		+	'<td></td>'
		+ '</tr>'

	//拼接到table中最后一行
	$table.append(trdom);
}

/**
 * 删除规则
 */
function delRuleRow(_this){
	
	//找到要删除的规则的table
	var $table = $('.redBagTab');
	
	//判断是否保留有至少一个的数据
	var surplus = $table.find('tr').length;
	if(surplus <= 2){
		art.dialog.tips('请至少保留一行规则！');
		return ;
	}
	
	var $ptr = $(_this).parent().parent();
	$ptr.remove();
}

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(typeof(beforesave) == "function"){
		beforesave(dlg);
	}
	currentDialog = dlg;
	//$('form').submit();---不采用直接提交使用ajax提交
	
	//校验数据
	var checkObj = checkForm();
	if(!checkObj || typeof(checkObj) == 'undefined'){//表示，验证不通过
		//no something
		console.info(checkObj);
		console.info('验证没通过');
	}else{
		//验证通过。提交
		console.info(checkObj);
		$.post(base+'/ebsite/gift/save',{
			jsonGift:JSON.stringify(checkObj)
		},function(res){
			console.info(res);
			if(res.STATE == 'SUCCESS'){
				setTimeout(function(){art.dialog.close();},1000);
			}else{
				art.dialog.alert(res.MSG);
			}
		},'json');
	}
	
	return false;
}

/**
 * 校验表单数据正确性
 */
function checkForm(){
	
	//校验礼包基本数据
	
	var _giftId = $('form input[name="id"]').val();
	var _giftDesc = $('form textarea[name="desc"]').val();
	
	var _giftName = $('form input[name="name"]').val();
	if(typeof(_giftName) == 'undefined' || _giftName == ''){
		art.dialog.tips('请设置礼包名称！');
		return false;
	}
	var _giftNumber = $('form input[name="number"]').val();
	if(typeof(_giftNumber) == 'undefined' || _giftNumber == ''){
		art.dialog.tips('请设置礼包编码！');
		return false;
	}
	if(!(/^[0-9_]+$/).test(_giftNumber)){
		//    ^[0-9_]+$
		art.dialog.tips('礼包编码只能是数字和下划线！');
		return false;
	}
	var _giftCreateTime = $('form input[name="createTime"]').val();
	if(typeof(_giftCreateTime) == 'undefined' || _giftCreateTime == ''){
		art.dialog.tips('请设置礼包开始时间！');
		return false;
	}
	var _giftEndTime = $('form input[name="endTime"]').val();
	if(typeof(_giftEndTime) == 'undefined' || _giftEndTime == ''){
		art.dialog.tips('请设置礼包结束时间！');
		return false;
	}
	var _giftType = $('form select[name="type"]').val();
	if(typeof(_giftType) == 'undefined' || _giftType == ''){
		art.dialog.tips('请设置礼包类型！');
		return false;
	}
	var _validity = $('form input[name="validity"]').val();
	if(typeof(_validity) == 'undefined' || _validity == ''){
		art.dialog.tips('请填写礼包有效期！');
		return false;
	}
	if(!(/^[1-9]\d*$/).test(_validity)){
		art.dialog.tips('请正确填写礼包有效期！');
		return false;
	}
	var _goodsVal = $("#goodsId").val();
	if(_giftType=='GOODS' && (typeof(_goodsVal) == 'undefined' || _goodsVal == '') ){
		art.dialog.tips('请选择商品数据！');
		return false;
	}
	
	var _minMoney = $("#minMoney").val();
	if(_giftType=='GOODS' && (typeof(_minMoney) == 'undefined' || _minMoney == '')){
		art.dialog.tips('请选择最低消费金额！');
		return false;
	}
	//校验规则数据
	var _allTr = $('.redBagTab tr:gt(0)');
	var rules=[];
	var flag=false;
	$.each(_allTr,function(i,n){
		var _thistr = $(this);
		var _rulemoney = _thistr.find('.rule_money .tdshow').html();
		var _ruletype = _thistr.find('.rule_type select').val();//可以不做校验
		var _ruleminimumAmount = _thistr.find('.rule_minimumAmount .tdshow').html();
		if(typeof(_rulemoney) == 'undefined' || _rulemoney == ''){
			art.dialog.tips('礼包规则券金额不能为空');
			//定位focus
//			_thistr.find('.rule_money .tdshow').click();//没生效
			flag=true;
			return false;
		}
		if(!checkPrice(_rulemoney)){
			art.dialog.tips('礼包规则券金额输入不对');
			flag=true;
			return false;
		}
		if(typeof(_ruleminimumAmount) == 'undefined' || _ruleminimumAmount == ''){
			art.dialog.tips('礼包规则券最低金额不能为空');
			//定位focus
//			_thistr.find('.rule_minimumAmount .tdshow').click();//没生效。是因为调用了。事件立刻变成上一步调用的事件了
			flag=true;
			return false;
		}
		if(!checkPrice(_ruleminimumAmount)){
			art.dialog.tips('礼包规则券最低金额输入不对');
			flag=true;
			return false;
		}
		var rule={};
		rule.money = _rulemoney;
		rule.minimumAmount = _ruleminimumAmount;
		rule.type = _ruletype;
		rules.push(rule);
	});
	if(flag){//表示each执行失败了。
		return ;
	}
	//如果以上验证全部通过则返回一个对象回去
	var gift={};
	gift.id = _giftId;
	gift.name = _giftName;
	gift.number = _giftNumber;
	gift.createTime = _giftCreateTime;
	gift.endTime = _giftEndTime;
	gift.type = _giftType;
	gift.validity = _validity;
	gift.desc = _giftDesc;
	gift.rules = rules;
	gift.goodsId = _goodsVal;
	gift.minMoney = _minMoney;
	return gift;
}

//判断字符是合法的小数
function checkPrice(price) {
	return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(price.toString());
}

