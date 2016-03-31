//供应商编辑操作
$(function() {
	clickBankType();
});

// 保存方法；
// 保存编辑数据
function saveEdit(dlg) {
	// 这里重写数据；异步提交不使用表单提交；
	// 1、提交之前做的校验
	var flag = checkForm();
	console.info(flag);
	if(flag){//保存
		//支付方式
		var alipay=$("#aliPay").attr('checked');
		var micropay=$('#micropay').attr('checked');
		var baidu=$('#baiduPay').attr('checked');
		var bankCard=$('#bankPay').attr('checked');
		var aliPayNo=$('#aliPayNo').val();
		var weixinPayNo=$('#weixinPayNo').val();
		var baiduPayNo=$('#baiduPayNo').val();
		//银行卡json数据
		//遍历得到所有的银行卡；
		var openBankIds=[];
		var openBranchIds=[];
		var bankCardNos=[];
		//排除第一行
		$('tr #bankRow:not(0)').each(function(){
			var openBankId=$(this).find('openBankId').val();
			var openBranchId=$(this).find('openBranchId').val();
			var bankCardNo=$(this).find('bankCardNo').val();
			openBankIds.push(openBankId);
			openBranchIds.push(openBranchId);
			bankCardNos.push(bankCardNo);
		});
		$.post(base+'/storage/provide/save',{
			alipay:alipay,
			micropay:micropay,
			baidu:baidu,
			bankCard:bankCard,
			
			aliPayNo:aliPayNo,
			weixinPayNo:weixinPayNo,
			baiduPayNo:baiduPayNo,
			
			openBankIds:openBankIds.join(','),
			openBranchIds:openBranchIds.join(','),
			bankCardNos:bankCardNos(',')
		},function(res){
			if(res.STATE=='SUCCESS'){//编辑成功
				alert(res.MSG);
			}
		},'json');
	}
	return false;
}

function checkForm() {
	// 判断是否至少选择一种支付方式
	var payment = $("input[name='payment']:checked");
	if (payment.length == 0) {
		art.dialog.tips('请至少勾选一种支付方式');
		return false;
	}
	/*
	else {// 如果不为空。则表示有选择，选择则对应的支付方式不能为空...
		payment.each(function(i, n) {// 遍历
			// 给每个需要填写的对象加上not null属性
			var $for = $('#' + $(this).attr('for'));
			// 判断是否有validate属性；如果有则需要取出来，然后拼接
			var isValidate = $for.attr('validate');
			if (isValidate) {// 表示存在--->追加属性{notNull:true,};从头部加
				if (isValidate.indexOf('notNull') < 0) {//找不到才添加
					isValidate = isValidate.substring(0, 1) + ('notNull:true,')
							+ isValidate.substring(1, isValidate.length);
					$for.attr('validate', isValidate);
				}
			} else {// 不用追加，直接添加
				$for.attr('validate', '{notNull:true}');
			}
		});
	}*/
	// 整体验证。取出所有的input---带validate属性的；验证
	var flag = true;// 定义一个开关
	$('input[validate]').each(function() {
		var $this = $(this);
		var validateStr = $this.attr('validate');
		// 拆分
		var $thisValidte = eval("(" + validateStr + ")");
		for ( var funStr in $thisValidte) {
			var fun = eval("(" + funStr + ")");
			if (typeof (fun) == 'function' && $thisValidte[funStr] == true) {
				console.info('验证');
				flag = fun.call($this);// 用flag接收
			}
		}
	});
	return flag;
}
// 定义一个全局的notNull方法测试看看
function notNull() {
	var $this = $(this);// 调用者
	var v = $this.val();
	if (typeof (v) == 'undefined' || v == null || v == '') {
		// 调整样式
		alert($this.attr('id') + '不能为空');
		return false;
	}else{
		return true;
	}
}

//添加银行卡
function addBank(){
	//得到模板
	var $tr=$('#bankRow');
	//追加到table中
	var $table=$tr.parent();
	var toTr=$tr.clone();
	toTr.css({display: 'block'});
	$table.append(toTr);
}

//删除银行卡
function delBank(obj){
	$(obj).parent().parent().remove();//删除对应的tr
}

//点击复选框事件
function clickBankType(){
	//1、如果选择银行卡，则需要主动增加一行银行卡输入；
	//2、如果选择或者取消其他支付类型则需要正确的清除、活添加样式
	$("input[name='payment']").click(function(){
		var checked=$(this).attr('checked');
		if(checked){//不为undefined
			if($(this).attr('id')=='bankPay'){//银行卡
				addBank();
			}else{
				// 给每个需要填写的对象加上not null属性
				var $for = $('#' + $(this).attr('for'));
				// 判断是否有validate属性；如果有则需要取出来，然后拼接
				var isValidate = $for.attr('validate');
				if (isValidate) {// 表示存在--->追加属性{notNull:true,};从头部加
					if (isValidate.indexOf('notNull') < 0) {//找不到才添加
						isValidate = isValidate.substring(0, 1) + ('notNull:true,')
								+ isValidate.substring(1, isValidate.length);
						$for.attr('validate', isValidate);
					}
				} else {// 不用追加，直接添加
					$for.attr('validate', '{notNull:true}');
				}
			}
		}else{
			if($("tr[id='bankRow']").length==2){//银行卡
				$("tr[id='bankRow']:last").remove();
			}else{
				//删除validate---notNull方法
				var $for = $('#' + $(this).attr('for'));
				var validateStr = $for.attr('validate');
				var $validteObj = eval("(" + validateStr + ")");
				if( getLength($validteObj)== 1){//如果为1
					//直接删除validate
					$for.removeAttr('validate');
				}else{
					validateStr=validateStr.replace('notNull:true,','');
					validateStr=validateStr.replace('notNull:true','');//兼容。。。
				}
			}
		}
	});
}

/**
 * 获取对象的属性个数
 * @param arry
 * @returns {Number}
 */
function getLength(arry){
	var length=0;
	for(var attr in arry){
		length++;
	}
	return length;
}


