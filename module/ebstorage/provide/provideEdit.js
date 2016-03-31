$(function() {
	payment();
});

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(typeof(beforesave) == "function"){
		beforesave(dlg);
	}
	currentDialog = dlg;
	//判断是否数据合法
	// 判断是否至少选择一种支付方式
	var payment = $("input[name='payment']:checked");
	if (payment.length == 0) {
		art.dialog.tips('请至少勾选一种支付方式');
		return false;
	}else{
		//如果有勾选银行卡。则必须选择银行卡
		var bankPay=$('#bankPay').attr('checked');
		if(bankPay){//如果不为undefined
			//判断
			var bankSelect=$('#belongBankName').val();
			if(bankSelect==''){
				art.dialog.tips('请选择所属银行');
			}else{
				$('form').submit();
			}
		}else{
			$('form').submit();
		}
	}
	return false;
}

function beforeOpen(){
	//判断是否勾选银行卡
	var checked=$('input[id="bankPay"]').attr('checked');
	if(checked){
		return true;
	}else{
		art.dialog.tips('请勾选银行卡!');
		return false;
	}
}

/**
 * 支付click
 */
function payment() {
	$("input[name='payment']").click(function() {
		var checked = $(this).attr('checked');
		if (checked) {// 不为undefined
			var $for = $('#' + $(this).attr('for'));
			$for.removeAttr('disabled');
			$for.removeClass('txtdisabled');
			var $is=$('#'+$(this).attr('is'));
			$is.val(1);
		} else {
			var $for = $('#' + $(this).attr('for'));
			// 清除样式
			if ($for.hasClass("l-textarea")) {
				$for.removeClass("l-textarea-invalid");
			} else if ($for.hasClass("l-text-field")) {
				$for.parent().removeClass("l-text-invalid");
			}
			$for.poshytip("destroy");
			$for.removeAttr("title");
			$for.attr('disabled', 'disabled');
			$for.addClass('txtdisabled');
			var $is=$('#'+$(this).attr('is'));
			$is.val(0);
		}
	});
}

function enableBank() {
	$('#bankTr').show();
}
function disnableBank(){
	$('#bankTr').hide();
}
